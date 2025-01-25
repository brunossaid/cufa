import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/courses");
  }, [isAuthenticated]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await signup(values);
    } catch (error) {
      // procesar errores del backend
      console.log("errors: ", error.response.data.errors);
      const backendErrors = error.response.data.errors;
      Object.entries(backendErrors).forEach(([field, message]) => {
        setError(field, { type: "server", message });
      });
    }
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      <Typography variant="h4" component="h1" marginBottom={2}>
        Registrarse
      </Typography>
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <TextField
          label="Usuario"
          variant="outlined"
          {...register("username", { required: "Username is required" })}
          fullWidth
          error={!!errors.username}
          helperText={errors.username?.message}
        />
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          {...register("email", { required: "Email is required" })}
          fullWidth
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Contraseña"
          type="password"
          variant="outlined"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          fullWidth
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button type="submit" variant="contained" fullWidth>
          Registrate
        </Button>
      </form>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: 5,
        }}
      >
        <Typography mb={1}>Ya tenes cuenta?</Typography>
        <Button onClick={() => navigate("/login")} variant="outlined">
          Iniciar Sesión
        </Button>
      </Box>
    </Box>
  );
}

export default RegisterPage;

/*
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography, Toolbar } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup, isAuthenticated, errors: registerErrors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/courses");
  }, [isAuthenticated]);

  const onSubmit = handleSubmit(async (values) => {
    signup(values);
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      <Typography variant="h4" component="h1" marginBottom={2}>
        Register
      </Typography>
      {registerErrors.map((error, i) => (
        <div key={i}>
          <a1>
            {error}
            {console.log("error del .map: ", error)}
          </a1>
        </div>
      ))}
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <TextField
          label="Username"
          variant="outlined"
          {...register("username", { required: "Username is required" })}
          fullWidth
          error={!!errors.username}
          helperText={errors.username?.message}
        />
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          {...register("email", { required: "Email is required" })}
          fullWidth
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          {...register("password", { required: "Password is required" })}
          fullWidth
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button type="submit" variant="contained" fullWidth>
          Register
        </Button>
      </form>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: 5,
        }}
      >
        <Typography mb={1}>Already have an account?</Typography>
        <Button
          onClick={() => navigate("/login")}
          variant="text"
          sx={{ width: "30%" }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
}

export default RegisterPage;
*/
