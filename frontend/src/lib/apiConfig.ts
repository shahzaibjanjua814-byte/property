/**
 * Centralized API configuration for the frontend.
 * This reads the API base URL from environment variables or falls back to localhost for development.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const API_ROUTES = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        REGISTER: `${API_BASE_URL}/api/auth/register`,
        VERIFY_EMAIL: `${API_BASE_URL}/api/auth/verify-email`,
        FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
        RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
        ME: `${API_BASE_URL}/api/auth/me`,
    },
    PROPERTIES: {
        BASE: `${API_BASE_URL}/api/properties`,
        SEARCH: (query: string) => `${API_BASE_URL}/api/properties/search/${encodeURIComponent(query)}`,
        BY_SOCIETY: `${API_BASE_URL}/api/properties/by-society`,
    },
    AGENTS: {
        BASE: `${API_BASE_URL}/api/agents`,
        SEARCH: (query: string) => `${API_BASE_URL}/api/agents/search/${encodeURIComponent(query)}`,
        PROFILE: (id: string) => `${API_BASE_URL}/api/agents/profile/${id}`,
    },
    CHAT: {
        BASE: `${API_BASE_URL}/api/chat`,
        CONVERSATIONS: `${API_BASE_URL}/api/chat/conversations`,
        MESSAGES: (convId: string) => `${API_BASE_URL}/api/chat/conversations/${convId}/messages`,
    }
};
