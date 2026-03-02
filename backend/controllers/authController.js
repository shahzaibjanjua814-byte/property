import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import * as AuthModel from '../models/authModel.js';
import * as EmailService from '../services/emailService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'aura_home_secret_key_2024';

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const register = async (req, res) => {
    try {
        const { email, password, name, phone, agency, experience, cnic, address, userType, attachments } = req.body;

        if (!email || !password || !name || !phone) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        const existingUser = await AuthModel.findByEmail(email, 'users');
        const existingAgent = await AuthModel.findByEmail(email, 'agents');

        if (existingUser || existingAgent) {
            return res.status(400).json({ success: false, error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        const verificationCode = generateVerificationCode();
        const codeExpires = new Date(Date.now() + 1000 * 60 * 15);

        if (userType === 'agent') {
            if (!agency || !experience || !cnic || !address) {
                return res.status(400).json({ success: false, error: 'All agent fields are required' });
            }

            await AuthModel.createAgentApplication({
                id: userId, name, email, phone, agency, experience, cnic, address,
                password_hash: hashedPassword, attachments, verification_code: verificationCode,
                verification_code_expires: codeExpires
            });
        } else {
            await AuthModel.createUser({
                id: userId, name, email, phone, password_hash: hashedPassword,
                verification_code: verificationCode, verification_code_expires: codeExpires
            });
        }

        await EmailService.sendVerificationEmail(email, name, verificationCode);

        res.status(201).json({
            success: true,
            message: `${userType === 'agent' ? 'Agent application submitted' : 'User registered'} successfully. Please verify your email.`,
            userId,
            requiresVerification: true
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password required' });
        }

        // Admin login
        if (email === 'dummy@gmail.com' && password === 'asd123') {
            const token = jwt.sign({ id: 'admin-uuid', email, name: 'Admin', type: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
            return res.json({ success: true, message: 'Admin login successful', token, user: { id: 'admin-uuid', name: 'Admin', email, type: 'admin' } });
        }

        let user = await AuthModel.findByEmail(email, 'users');
        let type = 'user';

        if (!user) {
            user = await AuthModel.findByEmail(email, 'agents');
            type = 'agent';
        }

        if (!user) {
            user = await AuthModel.findByEmail(email, 'agent_applications');
            type = 'agent_applicant';
        }

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        if (!user.email_verified) {
            return res.status(403).json({ success: false, error: 'Email not verified', userId: user.id, requiresVerification: true, userType: type === 'user' ? 'user' : 'agent' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, type: type === 'agent_applicant' ? 'agent' : type, status: user.status || 'approved' },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            [type.includes('agent') ? 'agent' : 'user']: {
                id: user.id, name: user.name, email: user.email, phone: user.phone,
                agency: user.agency, experience: user.experience, type: type === 'agent_applicant' ? 'agent' : type,
                status: user.status || 'approved'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { email, verificationCode, userType } = req.body;
        const table = userType === 'agent' ? 'agent_applications' : 'users';

        let user = await AuthModel.findByEmail(email, table);
        if (!user && userType === 'agent') user = await AuthModel.findByEmail(email, 'agents');

        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        if (user.email_verified) return res.status(400).json({ success: false, error: 'Email already verified' });
        if (user.verification_code !== verificationCode) return res.status(400).json({ success: false, error: 'Invalid code' });
        if (new Date(user.verification_code_expires) < new Date()) return res.status(400).json({ success: false, error: 'Code expired' });

        await AuthModel.verifyEmail(user.agency ? (user.status ? 'agents' : 'agent_applications') : 'users', email);
        res.json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, error: 'Email required' });

        const user = (await AuthModel.findByEmail(email, 'users')) || (await AuthModel.findByEmail(email, 'agents'));
        if (!user) return res.status(200).json({ success: true, message: 'If an account exists, a reset code was sent' });

        const resetCode = generateVerificationCode();
        const expires = new Date(Date.now() + 1000 * 60 * 15);

        await AuthModel.upsertPasswordReset(email, resetCode, expires);
        await EmailService.sendPasswordResetEmail(email, user.name, resetCode);

        res.json({ success: true, message: 'Reset code sent', email });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        if (!email || !code || !newPassword) return res.status(400).json({ success: false, error: 'Missing fields' });
        if (newPassword.length < 8) return res.status(400).json({ success: false, error: 'Password too short' });

        const reset = await AuthModel.findPasswordReset(email, code);
        if (!reset || new Date(reset.expires) < new Date()) return res.status(400).json({ success: false, error: 'Invalid or expired code' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const table = (await AuthModel.findByEmail(email, 'users')) ? 'users' : 'agents';

        await AuthModel.updatePassword(table, email, hashedPassword);
        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const agent = await AuthModel.findById(req.userId, 'agents');
        if (!agent) return res.status(404).json({ success: false, error: 'Agent not found' });
        res.json({ success: true, agent });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const logout = (req, res) => res.json({ success: true, message: 'Logout successful' });
