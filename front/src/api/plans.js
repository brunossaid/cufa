import axios from "axios";
import Cookies from "js-cookie";

const API = "http://localhost:3000/api";

// obtener todos los planes
export const getPlansRequest = async (userId) => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");
  return axios.get(`${API}/plans?user=${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // enviar token
    },
  });
};

// crear un plan
export const createPlanRequest = (plan) => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");
  return axios.post(`${API}/plans`, plan, {
    headers: {
      Authorization: `Bearer ${token}`, // enviar token
    },
  });
};

// actualizar un plan
export const updatePlanRequest = (planId, plan) => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");
  return axios.put(`${API}/plans/${planId}`, plan, {
    headers: {
      Authorization: `Bearer ${token}`, // enviar token
    },
  });
};

// actualizar un plan (eliminar item del plan)
export const removeItemFromPlanRequest = (planId, itemId) => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");
  return axios.delete(`${API}/plans/${planId}/remove-item`, {
    headers: {
      Authorization: `Bearer ${token}`, // enviar token
      "Content-Type": "application/json",
    },
    data: { itemId }, // enviar el ID del item en el cuerpo de la solicitud
  });
};

// eliminar un plan
export const deletePlanRequest = (planId) => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");
  return axios.delete(`${API}/plans/${planId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // enviar token
    },
  });
};

// obtener un plan por ID
export const getPlanRequest = (planId) => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");
  return axios.get(`${API}/plans/${planId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // enviar token
    },
  });
};
