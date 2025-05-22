import axios from "axios";

// Create an instance of axios
const API_URL =
  import.meta.env.VITE_API_URL || "https://imax.flash-print.uz/api";

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem("adminToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

// Service API functions for admin
export const getServices = () => api.get("/services");

export const createService = (formData) => {
  return api.post("/services", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateService = (id, formData) => {
  return api.put(`/services/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteService = (id) => api.delete(`/services/${id}`);

export const getPortfolio = () => api.get("/portfolio");

export const createPortfolio = (formData) => {
  return api.post("/portfolio", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updatePortfolio = (id, formData) => {
  return api.put(`/portfolio/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deletePortfolio = (id) => api.delete(`/portfolio/${id}`);

export const getAboutInfo = () => api.get("/about");
export const updateAboutInfo = (data) => api.put("/about", data);

export const addTeamMember = (formData) => {
  return api.post("/about/team", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteTeamMember = (id) => api.delete(`/about/team/${id}`);

export const getContacts = () => api.get("/admin/contacts");
export const updateContactStatus = (id) => api.patch(`/admin/contacts/${id}`);
export const deleteContact = (id) => api.delete(`/admin/contacts/${id}`);
