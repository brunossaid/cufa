import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user, courses } = useAuth(); // extraer usuario del contexto

  return (
    <div>
      <h1>Home Page</h1>
      {user && <h2>Hello, {user.username}!</h2>}
      {courses && <h2>courses: {courses.length}</h2>}
    </div>
  );
};

export default HomePage;
