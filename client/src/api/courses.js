import axios from "axios";
import Cookies from "js-cookie";

const API = "http://localhost:3000/api";

export const getCoursesRequest = async (userId) => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");
  return axios.get(`http://localhost:3000/api/courses?user=${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // enviar token
    },
  });
};

export const createCourseRequest = (course) => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");
  return axios.post(`${API}/courses`, course, {
    headers: {
      Authorization: `Bearer ${token}`, // enviar token
    },
  });
};

export const updateCourseRequest = (courseId, course) => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");
  return axios.put(`${API}/courses/${courseId}`, course, {
    headers: {
      Authorization: `Bearer ${token}`, // enviar token
    },
  });
};

export const deleteCourseRequest = (courseId) => {
  const token = Cookies.get("token") || localStorage.getItem("authToken");
  return axios.delete(`${API}/courses/${courseId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // enviar token
    },
  });
};
