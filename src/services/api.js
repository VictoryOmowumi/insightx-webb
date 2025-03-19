import axios from 'axios';
import { baseUrl } from '../utils/baseUrl';
const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response) {
      const { status, data } = response;

      if (status === 403 && data.message === 'Forbidden') {
        window.location.href = '/unauthorized';
      }

      if (status === 401 || (status === 400 && data.message === 'Invalid token.')) {
        // Store the current page URL before redirecting to login
        const currentPath = window.location.pathname + window.location.search;
        localStorage.setItem('redirectPath', currentPath);
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Get All Users
export const getUsers = async () => {
  const response = await api.get('/auth/users');
  return response.data;
};

export const createForm = async (formData) => {
  const response = await api.post('/forms', formData);
  return response.data;
};

export const duplicateForm = async (id) => {
  const response = await api.post(`/forms/${id}/duplicate`);
  return response.data;
}

export const stopResponses = async (id) => {
  const response = await api.post(`/forms/${id}/stop-responses`);
  return response.data;
}

export const getForms = async (id) => {
  const response = await api.get(`/forms`);
  return response.data;
}

export const getFormById = async (id) => {
  const response = await api.get(`/forms/${id}`);
  return response.data;
}

export const submitPublicForm = async (data) => {
  const response = await api.post('/forms/public/submit', data);
  return response.data;
}

export const getPublicFormById = async (id) => {
  const response = await api.get(`/forms/${id}/public`);
  return response.data;
};

export const updateForm = async (id, data) => {
  const response = await api.put(`/forms/${id}`, data);
  return response.data;
};

export const deleteForm = async (id) => {
  const response = await api.delete(`/forms/${id}`);
  return response.data;
}

export const publishForm = async (formId, data) => {
  const response = await api.put(`/forms/${formId}/publish`, data);
  return response.data;
};

export const formSummary = async () => {
  const response = await api.get('/forms/summary');
  return response.data;
};

// Fetch form responses
export const getFormResponses = async (formId) => {
  const response = await api.get(`/forms/${formId}/response`);
  return response.data;
};


// Create a new activity
export const createActivity = async (data) => {
  const response = await api.post('/activities', data);
  return response.data;
};


// Fetch activities
export const getActivities = async () => {
  const response = await api.get('/activities');
  return response.data;
};

// Fetch Activity by ID
export const getActivityById = async (id) => {
  const response = await api.get(`/activities/${id}`);
  return response.data;
};

// Update activity
export const updateActivity = async (id, data) => {
  const response = await api.put(`/activities/${id}`, data);
  return response.data;
};

// Get Activities Summary
export const activitiesSummary = async () => {
  const response = await api.get('/activities/summary');
  return response.data;
};

// Get Channels
export const getChannels = async () => {
  const response = await api.get('/activities/channels');
  return response.data;
};

// Post discussion message
export const postDiscussionMessage = async (activityId, data) => {
  const response = await api.post(`/activities/${activityId}/discussion`, data);
  return response.data;
};

// Post Activity Feedback
export const postActivityFeedback = async (activityId, data) => {
  const response = await api.post(`/activities/${activityId}/feedback`, data);
  return response.data;
};

// Fetch collaborators
export const getCollaborators = async () => {
  const response = await api.get('/auth/users');
  return response.data;
};

// Fetch agents
export const getAgents = async () => {
  const response = await api.get('/agents');
  return response.data;
};

// Register agent
export const registerAgent = async (data) => {
  const response = await api.post('/agents/register', data);
  return response.data;
};

// Agents summary
export const agentsSummary = async () => {
  const response = await api.get('/agents/summary');
  return response.data;
};

// Fetch agent by ID
export const getAgentById = async (id) => {
  const response = await api.get(`/agents/${id}`);
  return response.data;
};

// Reset agent password
export const resetAgentPassword = async (id, data) => {
  const response = await api.post(`/agents/${id}/reset-password`, data);
  return response.data;
};

// Get all stock requests
export const getStockRequests = async () => {
  const response = await api.get('/requests');
  return response.data;
};

// Stock request summary
export const stockRequestSummary = async () => {
  const response = await api.get('/requests/summary');
  return response.data;
};

// Create a new stock request
export const createStockRequest = async (data) => {
  const response = await api.post('/requests', data);
  return response.data;
};

// Fetch stock request by ID
export const getStockRequestById = async (id) => {
  const response = await api.get(`/requests/${id}`);
  return response.data;
};

// Update stock request
export const updateStockRequest = async (id, data) => {
  const response = await api.put(`/requests/${id}`, data);
  return response.data;
};

// Get stock request history
export const getStockRequestHistory = async (id) => {
  const response = await api.get(`/requests/${id}/history`);
  return response.data;
};


// DASHBOARD
// Fetch dashboard summary
export const dashboardSummary = async () => {
  const response = await api.get('/dashboard/summary');
  return response.data;
};

// Get User Settings
export const getUserSettings = async () => {
  const response = await api.get('/settings/user');
  return response.data;
};

// Update User Settings
export const updateUserSettings = async (data) => {
  const response = await api.put('/settings/user', data);
  return response.data;
};


// Get Admin Settings
export const getAdminSettings = async () => {
  const response = await api.get('/settings/admin');
  return response.data;
};

// Update Admin Settings
export const updateAdminSettings = async (data) => {
  const response = await api.put('/settings/admin', data);
  return response.data;
};

export const fetchProducts = async () => {
  try {
    const response = await fetch("https://android.sevenup.org/orders/api/placeorder/GetBetaPadiProducts/ik0000155");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Fetch all notifications
export const getNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    throw error;
  }
};

// Mark a single notification as read
export const markNotificationAsRead = async (id) => {
  try {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.put('/notifications/read');
    return response.data;
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    throw error;
  }
};

// Register a new user
export const registerUser = async (data) => {
  try {
    const response = await api.post('/auth/register', data);
    return response.data;
  } catch (error) {
    console.error('Failed to register user:', error);
    throw error;
  }
};

// Update user role (Admin only)
export const updateUserDetails = async (userId, data) => {
  try {
    const response = await api.put(`/auth/users/${userId}/details`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to update user role:', error);
    throw error;
  }
};

// Toggle user status (Admin only)
export const toggleUserStatus = async (userId, data) => {
  try {
    const response = await api.put(`/auth/users/${userId}/status`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to toggle user status:', error);
    throw error;
  }
};

// Get all regions
export const getRegions = async () => {
  try {
    const response = await api.get('/regions');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch regions:', error);
    throw error;
  }
};


export default api;