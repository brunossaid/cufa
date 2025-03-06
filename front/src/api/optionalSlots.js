import axios from "axios";
import Cookies from "js-cookie";

const API = "http://localhost:3000/api";

export const getOptionalSlotsRequest = async (userId) => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");
  return axios.get(`http://localhost:3000/api/optionalSlots?user=${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // enviar token
    },
  });
};

export const createOptionalSlotRequest = (optionalSlot) => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");
  return axios.post(`${API}/optionalSlots`, optionalSlot, {
    headers: {
      Authorization: `Bearer ${token}`, // enviar token
    },
  });
};

export const deleteOptionalSlotRequest = (optionalSlotId) => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");
  return axios.delete(`${API}/optionalSlots/${optionalSlotId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // enviar token
    },
  });
};
