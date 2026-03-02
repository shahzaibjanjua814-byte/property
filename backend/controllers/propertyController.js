import { v4 as uuidv4 } from 'uuid';
import * as PropertyModel from '../models/propertyModel.js';

export const getAllProperties = async (req, res) => {
    try {
        const rows = await PropertyModel.findAll(req.query);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getPropertyById = async (req, res) => {
    try {
        const property = await PropertyModel.findById(req.params.id || req.params.propertyId);
        if (!property) return res.status(404).json({ success: false, error: 'Property not found' });
        res.json({ success: true, data: property });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getFeaturedProperties = async (req, res) => {
    try {
        const properties = await PropertyModel.findFeatured();
        res.json({ success: true, data: properties });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createProperty = async (req, res) => {
    try {
        const propertyData = {
            ...req.body,
            id: uuidv4(),
            agent_id: req.body.agent_id || req.body.user_id || req.userId,
            property_type: req.body.property_type || req.body.type || 'Apartment'
        };
        const id = await PropertyModel.create(propertyData);
        res.status(201).json({ success: true, message: 'Property created', id });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateProperty = async (req, res) => {
    try {
        const propertyData = {
            ...req.body,
            property_type: req.body.property_type || req.body.type || 'Apartment'
        };
        await PropertyModel.update(req.params.id, propertyData);
        res.json({ success: true, message: 'Property updated' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteProperty = async (req, res) => {
    try {
        await PropertyModel.remove(req.params.id);
        res.json({ success: true, message: 'Property deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getPropertiesBySociety = async (req, res) => {
    try {
        const rows = await PropertyModel.findBySociety(req.query);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getUserProperties = async (req, res) => {
    try {
        const rows = await PropertyModel.findByAgent(req.params.userId, {});
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
