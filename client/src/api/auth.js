import axios from "axios";
import Cookies from "js-cookie";

const API = "http://localhost:3000/api";

export const registerRequest = (user) => axios.post(`${API}/register`, user);

export const loginRequest = (user) => axios.post(`${API}/login`, user);

export const logoutRequest = () => axios.post(`${API}/logout`);

export const verifyTokenRequest = () =>
  axios.get("/api/verify", { withCredentials: true });

export const updateProfileRequest = (userData) => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");

  return axios.put(`${API}/update-profile`, userData, {
    headers: {
      Authorization: `Bearer ${token}`, // enviar token
    },
  });
};

export const updatePasswordRequest = async (currentPassword, newPassword) => {
  const token = Cookies.get("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios.put(
    "/api/update-password",
    { currentPassword, newPassword },
    config
  );
};
