import * as React from "react";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/EditRounded";
import VisibilityIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOffRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";
import DoneIcon from "@mui/icons-material/DoneRounded";
import { updateProfileRequest } from "../api/auth";

function UserPage({ showAlert }) {
  // extraer datos del contexto
  const { user, setUser, updatePassword } = useAuth();

  // edicion de username/email
  const [editing, setEditing] = React.useState({
    username: false,
    email: false,
  });
  const [tempData, setTempData] = React.useState({
    username: user.username,
    email: user.email,
  });

  // cambiando contraseña
  const [passwordChanging, setPasswordChanging] = React.useState(false);
  const handlePasswordChanging = () => {
    if (editing.username || editing.email) {
      // si estamos editando email/username, cancelamos
      setEditing({ username: false, email: false });
      setTempData({ username: user.username, email: user.email });
    }
    setPasswordChanging(!passwordChanging);
  };

  // visibilidad de la contraseña
  const [passwordVisibility, setPasswordVisibility] = React.useState(false);
  const handlePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  // almcanear datos del form
  const [passwordData, setPasswordData] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // maneja los campos de las contraseñas
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // guardar contraseña nueva
  const handleSubmitPassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showAlert("Las contraseñas no coinciden", "error");
      return;
    }
    try {
      await updatePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      showAlert("Contraseña actualizada", "success");

      // reiniciar los campos
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordChanging(false);
    } catch (error) {
      console.error("error al cambiar la contraseña:", error);
      showAlert("Error al actualizar la contraseña", "error");
    }
  };

  // cancelar cambiar contraseña
  const handleCancelPassword = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordChanging(false);
  };

  // modo edicion de username/email
  const handleEditClick = (field) => {
    if (passwordChanging) {
      // si estamos editando la contraseña, cancelamos
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordChanging(false);
    }

    setEditing((prevState) => ({
      ...prevState,
      [field]: true,
    }));
  };

  // guardar usuario
  const handleSaveUser = async (field) => {
    try {
      // actualiza estado local
      setUser((prevState) => ({
        ...prevState,
        [field]: tempData[field],
      }));

      // guardar en la DB
      const userData = { [field]: tempData[field] };
      await updateProfileRequest(userData);
      showAlert("Usuario modificado", "success");

      // desactivar modo edicion
      setEditing((prevState) => ({
        ...prevState,
        [field]: false,
      }));
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      showAlert("Error", "error");
    }
  };

  // cancerlar cambiar usuario/email
  const handleCancelUser = (field) => {
    setTempData((prevState) => ({
      ...prevState,
      [field]: user[field],
    }));
    setEditing((prevState) => ({
      ...prevState,
      [field]: false,
    }));
  };

  // manejo de campos de usuario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div>
      <h1>Perfil</h1>
      <Stack spacing={2}>
        {/* Usuario */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            label="Usuario"
            variant="outlined"
            value={tempData.username}
            onChange={handleChange}
            sx={{ width: 350 }}
            disabled={!editing.username}
            name="username"
          />
          {!editing.username ? (
            <IconButton
              sx={{ ml: 1 }}
              onClick={() => handleEditClick("username")}
            >
              <EditIcon />
            </IconButton>
          ) : (
            <>
              <IconButton
                sx={{ ml: 1 }}
                onClick={() => handleSaveUser("username")}
              >
                <DoneIcon />
              </IconButton>
              <IconButton
                sx={{ ml: 1 }}
                onClick={() => handleCancelUser("username")}
              >
                <CloseIcon />
              </IconButton>
            </>
          )}
        </Box>

        {/* Email */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            label="Email"
            variant="outlined"
            value={tempData.email}
            onChange={handleChange}
            sx={{ width: 350 }}
            disabled={!editing.email}
            name="email"
          />
          {!editing.email ? (
            <IconButton sx={{ ml: 1 }} onClick={() => handleEditClick("email")}>
              <EditIcon />
            </IconButton>
          ) : (
            <>
              <IconButton
                sx={{ ml: 1 }}
                onClick={() => handleSaveUser("email")}
              >
                <DoneIcon />
              </IconButton>
              <IconButton
                sx={{ ml: 1 }}
                onClick={() => handleCancelUser("email")}
              >
                <CloseIcon />
              </IconButton>
            </>
          )}
        </Box>
        {!passwordChanging && (
          <Button
            variant="outlined"
            onClick={handlePasswordChanging}
            sx={{ width: 350 }}
          >
            Cambiar Contraseña
          </Button>
        )}
      </Stack>
      {passwordChanging && (
        <Stack spacing={2} sx={{ marginTop: 5 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              label="Contraseña Actual"
              variant="outlined"
              type={passwordVisibility ? "text" : "password"}
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              sx={{ width: 350 }}
            />
            <IconButton
              sx={{ ml: 1 }}
              onClick={() => handlePasswordVisibility()}
            >
              {passwordVisibility ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </Box>
          <TextField
            label="Nueva Contraseña"
            variant="outlined"
            type={passwordVisibility ? "text" : "password"}
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            sx={{ width: 350 }}
          />
          <TextField
            label="Confirmar Contraseña"
            variant="outlined"
            type={passwordVisibility ? "text" : "password"}
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            sx={{ width: 350 }}
          />
          <Button
            variant="contained"
            onClick={handleSubmitPassword}
            sx={{ width: 350 }}
          >
            Guardar
          </Button>
          <Button
            variant="contained"
            onClick={handleCancelPassword}
            sx={{ width: 350 }}
            color="error"
          >
            Cancelar
          </Button>
        </Stack>
      )}
    </div>
  );
}

export default UserPage;
