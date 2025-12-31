import axios from "axios";

// Krijo një instancë axios me bazë URL dhe header default
const axiosClient = axios.create({
  baseURL: "http://localhost:5138/api",
});

// Interceptor për të shtuar Authorization header në çdo kërkesë
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor për të menaxhuar 401 dhe rifreskimin e tokenit
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        // Nëse nuk ka refreshToken, ridrejto në login
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // POST me refresh token - e dërgo si string JSON, sepse backend pret [FromBody] string
        const response = await axiosClient.post(
          "/account/refresh-token",
          `"${refreshToken}"`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const { token, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Shto tokenin e ri në header dhe provo kërkesën përsëri
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        return axiosClient(originalRequest);
      } catch (err) {
        // Nëse refresh token ka skaduar ose ka problem, fshij tokenat dhe ridrejto
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
