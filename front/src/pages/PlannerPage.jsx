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
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Slide,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemAvatar,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import AddIcon from "@mui/icons-material/AddRounded";
import AddCircleIcon from "@mui/icons-material/AddCircleRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";
import CancelIcon from "@mui/icons-material/CancelRounded";
import DoneIcon from "@mui/icons-material/DoneRounded";
import EditIcon from "@mui/icons-material/EditRounded";
import TurnedInIcon from "@mui/icons-material/TurnedInRounded";
import AssignmentIcon from "@mui/icons-material/AssignmentRounded";
import { useAuth } from "../context/AuthContext";
import Planner from "../components/Planner";
import { createPlanRequest } from "../api/plans";
import { getPlansRequest } from "../api/plans";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import { deletePlanRequest } from "../api/plans";
import { updatePlanRequest } from "../api/plans";
import {
  createExtraTaskRequest,
  updateExtraTaskRequest,
  getExtraTasksRequest,
  deleteExtraTaskRequest,
} from "../api/extraTasks";

// transicion del dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PlannerPage({ showAlert }) {
  const { user, courses, plans, setPlans, extraTasks, setExtraTasks, periods } =
    useAuth();

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

  const [items, setitems] = useState(courses);

  // combinamos courses y extraTasks
  useEffect(() => {
    setitems([...courses, ...extraTasks]);
  }, [courses, extraTasks]);

  // dialog de actividades extras
  const [dialogExtraTask, setDialogExtraTask] = React.useState(false);
  // abrir
  const handleOpenDialogExtraTask = () => {
    setDialogExtraTask(true);
  };
  // cerrar
  const handleCloseDialogExtraTask = () => {
    // si estamos editando una task y su 'name' está vacío, la eliminamos
    if (
      editingTaskIndex !== null &&
      tasks[editingTaskIndex].name.trim() === ""
    ) {
      deleteTask(editingTaskIndex);
      showAlert("Actividad vacia eliminada", "info");
    }

    setDialogExtraTask(false);
    setEditingTaskIndex(null);
  };

  // funciones de actividades extra
  const [tasks, setTasks] = React.useState(extraTasks);
  const [editingTaskIndex, setEditingTaskIndex] = React.useState(null);

  // actualizar tasks cuando extraTasks cambie
  useEffect(() => {
    setTasks(extraTasks);
  }, [extraTasks]);

  // agregar task
  const addTask = () => {
    // si estamos editando una task y su 'name' está vacío, la eliminamos
    if (
      editingTaskIndex !== null &&
      tasks[editingTaskIndex].name.trim() === ""
    ) {
      deleteTask(editingTaskIndex);
      showAlert("Actividad vacia eliminada", "info");
    }

    // crear una nueva task
    const newTask = {
      name: "",
      color: getRandomColor(),
      user: user.id,
    };

    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks, newTask];
      setEditingTaskIndex(updatedTasks.length - 1); // nueva task en modo edicion
      return updatedTasks;
    });
  };

  // editar task
  const updateTaskField = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };
  // guardar task
  const saveTask = async (index) => {
    const taskName = tasks[index].name.trim();

    // chequear si el nombre esta vacio
    if (taskName === "") {
      showAlert("El nombre no puede estar vacío", "error");
      return;
    }

    try {
      if (tasks[index]._id) {
        // si hay ID, se esta editando una task existente
        await updateExtraTaskRequest(tasks[index]._id, tasks[index]);
        console.log("task actualizada");
      } else {
        // si no, es porque se esta creando una nueva task
        await createExtraTaskRequest(tasks[index]);
        console.log("task creada");

        // actualizar los tasks con la DB
        const updatedTasks = await getExtraTasksRequest();
        setExtraTasks(updatedTasks.data);
      }

      setEditingTaskIndex(null);
    } catch (error) {
      showAlert("Error", "error");
      console.error(error);
    }
  };
  // eliminar task
  const deleteTask = async (index) => {
    try {
      const taskId = tasks[index]._id;

      if (!taskId) {
        // si no tiene ID, es una tarea nueva no guardada
        setTasks((prev) => prev.filter((_, i) => i !== index));
        return;
      }

      // eliminar en la DB
      await deleteExtraTaskRequest(taskId);
      console.log("task eliminada");

      // actualizar las tareas desde la DB
      const updatedTasks = await getExtraTasksRequest();
      setExtraTasks(updatedTasks.data);
    } catch (error) {
      showAlert("Error al eliminar la actividad", "error");
      console.error(error);
    }
  };

  // color random
  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
  };

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
          <Tooltip title="Actividades extra">
            <IconButton
              sx={{
                marginRight: 1.5,
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "scale(1.15)",
                },
              }}
              onClick={handleOpenDialogExtraTask}
            >
              <AssignmentIcon />
            </IconButton>
          </Tooltip>

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
                label="Plan"
                variant="outlined"
                size="small"
                autoComplete="off"
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
            <Planner {...{ plan, items, periods }} />
          </div>
        ))
      )}

      {/* dialog de actividades extra*/}
      <Dialog
        open={dialogExtraTask}
        onClose={handleCloseDialogExtraTask}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Actividades Extra</DialogTitle>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            sx={{
              border: "1px solid #5B5B5B",
              borderRadius: "4px",
              paddingX: "12px",
              paddingY: "6px",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography sx={{ color: "text.secondary" }}>
                Agregá otras actividades a tu planificación
              </Typography>

              <Tooltip title="Agregar Actividad">
                <IconButton onClick={addTask}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <List sx={{ paddingY: 0 }}>
              {tasks.map((task, index) => (
                <ListItem
                  key={index}
                  alignItems="center"
                  secondaryAction={
                    <>
                      {editingTaskIndex === index ? (
                        <Tooltip title="Guardar">
                          <span>
                            <IconButton
                              edge="end"
                              sx={{ marginRight: 1 }}
                              onClick={() => saveTask(index)}
                            >
                              <DoneIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Editar">
                          <span>
                            <IconButton
                              edge="end"
                              sx={{ marginRight: 1 }}
                              onClick={() => setEditingTaskIndex(index)}
                            >
                              <EditIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                      <Tooltip title="Eliminar">
                        <span>
                          <IconButton
                            edge="end"
                            onClick={() => deleteTask(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </>
                  }
                >
                  <ListItemAvatar>
                    <TurnedInIcon fontSize="large" sx={{ color: task.color }} />
                  </ListItemAvatar>
                  {editingTaskIndex === index ? (
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap={1.5}
                      sx={{ width: "70%" }}
                    >
                      <TextField
                        label="Nombre"
                        value={task.name}
                        onChange={(e) =>
                          updateTaskField(index, "name", e.target.value)
                        }
                        size="small"
                        autoComplete="off"
                        autoFocus
                      />
                    </Box>
                  ) : (
                    <ListItemText primary={task.name} />
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions sx={{ margin: 1 }}>
          <Button onClick={handleCloseDialogExtraTask} variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PlannerPage;
