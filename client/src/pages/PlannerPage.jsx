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

function PlannerPage() {
  const { user, courses, plans, setPlans } = useAuth();

  const handleAddPlan = async () => {
    try {
      const newPlan = {
        name: "",
        cells: [],
        user: user.id,
      };

      const response = await createPlanRequest(newPlan);
      console.log("Nuevo plan creado:", response.data);
      setPlans((prevPlans) => [...prevPlans, response.data]); // Actualiza el estado
    } catch (error) {
      console.error("Error al crear el plan:", error);
    }
  };

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
          <Tooltip title={"Agregar Plan"}>
            <IconButton onClick={handleAddPlan}>
              <AddCircleIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      {plans.length === 0 ? (
        <Typography>no hay planes xd</Typography>
      ) : (
        plans.map((plan) => (
          <Planner key={plan._id} plan={plan} courses={courses} />
        ))
      )}
    </div>
  );
}

export default PlannerPage;
