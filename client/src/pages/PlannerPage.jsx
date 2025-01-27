import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Menu,
  MenuItem,
  Button,
  TextField,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import AddIcon from "@mui/icons-material/AddRounded";
import AddCircleIcon from "@mui/icons-material/AddCircleRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";
import CancelIcon from "@mui/icons-material/CancelRounded";
import { useAuth } from "../context/AuthContext";
import Planner from "../components/Planner";
import { createPlanRequest } from "../api/plans";
import { getPlansRequest } from "../api/plans";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import { deletePlanRequest } from "../api/plans";
import { updatePlanRequest } from "../api/plans";

function PlannerPage({ showAlert }) {
  const { user, courses, plans, setPlans } = useAuth();

  // agregar plan
  const handleAddPlan = async () => {
    try {
      const newPlan = {
        name: "",
        cells: [],
        user: user.id,
      };

      const response = await createPlanRequest(newPlan);
      console.log("plan creado");
      setPlans((prevPlans) => [...prevPlans, response.data]);
      showAlert("Plan Creado", "success");
    } catch (error) {
      console.error("Error al crear el plan:", error);
    }
  };

  // eliminar plan
  const handleDeletePlan = async (plan) => {
    try {
      await deletePlanRequest(plan._id); // llama a la API para eliminar el plan
      console.log("plan eliminado");
      setPlans((prevPlans) => prevPlans.filter((p) => p._id !== plan._id));
      showAlert("Plan Eliminado", "error", <DeleteIcon />);
    } catch (error) {
      console.error("error al eliminar el plan:", error.response.data.message);
    }
  };

  // modificar plan
  const handleUpdatePlanName = async (planId, newName) => {
    try {
      const updatedPlan = plans.find((plan) => plan._id === planId);
      const updatedData = { ...updatedPlan, name: newName };
      await updatePlanRequest(planId, updatedData);

      setPlans((prevPlans) =>
        prevPlans.map((plan) =>
          plan._id === planId ? { ...plan, name: newName } : plan
        )
      );
      console.log("plan actualizado:", newName);
    } catch (error) {
      console.error(
        "Error al actualizar el plan:",
        error.response?.data?.message
      );
    }
  };

  // actualizar la pagina todo al crear/eliminar plan
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getPlansRequest(user.id);
        setPlans(response.data);
      } catch (error) {
        console.error("Error al cargar los planes:", error);
      }
    };

    if (user) fetchPlans();
  }, [user]);

  const [coursesFB, setCoursesFB] = useState(courses);

  useEffect(() => {
    const futbolCourse = {
      name: "Futbol",
      code: "FUT",
      status: "pending", // para que aparezca en el menu
      color: "#FF5733",
    };

    // agregamos "futbol" a coursesFB localmente
    const updatedCourses = [...courses, futbolCourse];
    setCoursesFB(updatedCourses);
  }, [courses]);

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginBottom={2.5}
      >
        <h1 style={{ margin: 0 }}>Planificador</h1>
        <Box display="flex" alignItems="center">
          <Button
            variant={"text"}
            onClick={handleAddPlan}
            color="white"
            endIcon={<AddCircleIcon />}
            style={{
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          >
            Agregar Plan
          </Button>
        </Box>
      </Box>
      {plans.length === 0 ? (
        <Typography>No hay planes creados</Typography>
      ) : (
        plans.map((plan) => (
          <div key={plan._id}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <TextField
                label="plan"
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none", // eliminar borde
                  },
                }}
                value={plan.name}
                // actualizamos el estado local
                onChange={(e) =>
                  setPlans((prevPlans) =>
                    prevPlans.map((p) =>
                      p._id === plan._id ? { ...p, name: e.target.value } : p
                    )
                  )
                }
                // al deseleccionar el textfield, guardamos el cambio en la base de datos
                onBlur={(e) => handleUpdatePlanName(plan._id, e.target.value)}
              />
              <Tooltip title="Eliminar Plan">
                <IconButton
                  size={"small"}
                  onClick={() => handleDeletePlan(plan)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Planner plan={plan} courses={coursesFB} />
          </div>
        ))
      )}
    </div>
  );
}

export default PlannerPage;
