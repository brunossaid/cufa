import axios from "axios";
import Cookies from "js-cookie";

const API = "http://localhost:3000/api";

// obtener las extraTasks
export const getExtraTasksRequest = async () => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");
  return axios.get(`${API}/extraTasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// crear una extraTask
export const createExtraTaskRequest = (extraTask) => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");
  return axios.post(`${API}/extraTasks`, extraTask, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// editar una extraTask
export const updateExtraTaskRequest = (extraTaskId, extraTask) => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");
  return axios.put(`${API}/extraTasks/${extraTaskId}`, extraTask, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// eliminar una extraTask
export const deleteExtraTaskRequest = (extraTaskId) => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");
  return axios.delete(`${API}/extraTasks/${extraTaskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
