import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
  withCredentials: true, // Important for sending/receiving HttpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple simultaneous refresh token calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor to add access token to requests
api.interceptors.request.use(
  (config) => {
    // We will inject the token from Zustand store directly when using the api, 
    // or we can read it from localStorage if we decide to store it there.
    // For now, Zustand handles passing the token or we can inject it via a global state reader.
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do not intercept if it's the refresh token endpoint itself to avoid infinite loops
    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check if user is authenticated in localStorage before attempting refresh
      let isAuthenticated = false;
      try {
        if (typeof window !== "undefined") {
          const authStorageStr = localStorage.getItem("auth-storage");
          if (authStorageStr) {
            const authStorage = JSON.parse(authStorageStr);
            isAuthenticated = !!authStorage?.state?.isAuthenticated;
          }
        }
      } catch (e) {
        // Ignore JSON parse errors
      }

      // If not authenticated, don't try to refresh
      if (!isAuthenticated) {
        return Promise.reject(error);
      }
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // The cookie is sent automatically because of withCredentials: true
        const { data } = await axios.post(
          (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1") + "/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = data.access_token;
        
        // Notify useAuth store of the new token (handled in the hook)
        // For axios retry:
        api.defaults.headers.common["Authorization"] = "Bearer " + newAccessToken;
        originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
        
        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // If refresh fails, we should log out the user
        // We will handle this in the useAuth hook (e.g. listening to an event)
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth:logout"));
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
