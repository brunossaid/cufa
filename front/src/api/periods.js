import axios from "axios";
import Cookies from "js-cookie";

const API = "http://localhost:3000/api";

// obtener los periods
export const getPeriodsRequest = async () => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");
  return axios.get(`${API}/periods`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// crear period
export const createPeriodRequest = (period) => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");
  return axios.post(`${API}/periods`, period, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// actualizar period
export const updatePeriodRequest = (periodId, period) => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");
  return axios.put(`${API}/periods/${periodId}`, period, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// eliminar course de un period
export const deleteCourseFromPeriodRequest = (periodId, courseId) => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");
  return axios.delete(`${API}/periods/${periodId}/courses/${courseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// agregar course a un period
export const addCourseToPeriodRequest = (periodId, courseData) => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");
  return axios.post(`${API}/periods/${periodId}/courses`, courseData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// eliminar period
export const deletePeriodRequest = (periodId) => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");
  return axios.delete(`${API}/periods/${periodId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
