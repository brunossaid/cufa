import { createContext, useState, useContext, useEffect } from "react";
import {
  registerRequest,
  loginRequest,
  verifyTokenRequest,
  logoutRequest,
} from "../api/auth";
import { getCoursesRequest } from "../api/courses";
import { getPlansRequest } from "../api/plans";
import { getPeriodsRequest } from "../api/periods";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true); // cuando todavia no cargaron los datos

  // register
  const signup = async (user) => {
    const res = await registerRequest(user); // enviar datos al backend
    setUser(res.data); // guardar datos del usuario en el contexto
    setIsAuthenticated(true); // autentificar usuario
    console.log("signup res: ", res.data);
  };

  // login
  const signin = async (user) => {
    const res = await loginRequest(user); // enviar datos al backend
    setUser(res.data); // guardar datos del usuario en el contexto
    setIsAuthenticated(true); // autentificar usuario

    Cookies.set("token", res.data.token);

    await fetchCourses(res.data);
    await fetchPlans(res.data);
    await fetchPeriods(res.data);

    console.log("signin res: ", res.data);
  };

  const logout = async () => {
    Cookies.remove("token"); // eliminar la cookie del token
    localStorage.removeItem("authToken");
    await logoutRequest();
    setUser(null);
    setIsAuthenticated(false);
    setCourses([]); // limpiar las materias o cualquier otro dato del usuario
    console.log("User logged out successfully");
  };

  // materias
  const [courses, setCourses] = useState([]);
  const fetchCourses = async (user) => {
    try {
      const res = await getCoursesRequest(user.id);
      setCourses(res.data);
    } catch (error) {
      console.log("Error fetching courses: ", error);
    }
  };

  // planes
  const [plans, setPlans] = useState([]);
  const fetchPlans = async (user) => {
    try {
      const res = await getPlansRequest(user.id);
      setPlans(res.data);
    } catch (error) {
      console.log("Error fetching plans: ", error);
    }
  };

  // cursadas
  const [periods, setPeriods] = useState([]);
  const fetchPeriods = async (user) => {
    try {
      const res = await getPeriodsRequest(user.id);
      setPeriods(res.data);
    } catch (error) {
      console.log("Error fetching periods: ", error);
    }
  };

  // almacenar cookie para no desloguearse al actualizar
  useEffect(() => {
    const checkLogin = async () => {
      setLoading(true); // cargando..
      const cookies = Cookies.get(); // obtenemos las cookies

      let token = cookies.token || localStorage.getItem("authToken"); // usamos cookies si están disponibles, sino intentamos con localStorage

      console.log("token: ", token);

      // si no hay token, no hay usuario autenticado
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false); // termina de cargar
        return;
      }

      try {
        const res = await verifyTokenRequest(token);

        // si la respuesta no contiene datos, desautenticamos al usuario
        if (!res.data) {
          setIsAuthenticated(false);
          setUser(null);
        } else {
          // si la respuesta es valida (res.data existe), el token es valido
          setIsAuthenticated(true);
          setUser(res.data);

          // cargar datos
          await fetchCourses(res.data);
          await fetchPlans(res.data);
          await fetchPeriods(res.data);
        }
      } catch (error) {
        console.log("error: ", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false); // termina de cargar
      }
    };

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        user,
        isAuthenticated,
        setIsAuthenticated,
        courses,
        setCourses,
        plans,
        setPlans,
        periods,
        setPeriods,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
