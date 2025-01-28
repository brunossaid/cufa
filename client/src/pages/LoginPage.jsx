import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const { signin } = useAuth();

  const onSubmit = handleSubmit(async (values) => {
    try {
      await signin(values);
    } catch (error) {
      console.log("errors: ", error.response.data.errors);
      const backendErrors = error.response.data.errors;
      Object.entries(backendErrors).forEach(([field, message]) => {
        setError(field, { type: "server", message });
      });
    }
  });

  const navigate = useNavigate();

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
        Iniciar Sesión
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
          autoComplete="off"
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
          Iniciar Sesión
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
        <Typography mb={1}>No tenes cuenta?</Typography>
        <Button onClick={() => navigate("/register")} variant="outlined">
          Registrarse
        </Button>
      </Box>
    </Box>
  );
}

export default LoginPage;
