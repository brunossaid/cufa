import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
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
import CloseIcon from "@mui/icons-material/CloseRounded";
import { updatePlanRequest } from "../api/plans";
import { removeItemFromPlanRequest } from "../api/plans";
import Grid from "@mui/material/Grid2";

// dias y horas
const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const dayTranslations = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
};
const hours = Array.from({ length: 15 }, (_, i) => 8 + i);

export default function Planner({ plan, items, periods }) {
  const [schedule, setSchedule] = useState({});
  const [selectedItem, setSelectedItem] = useState(null); // item seleccionado
  const [activeItems, setActiveItems] = useState([]); // items en el menu

  // buscar entre los periods el status
  const getStatus = (courseId) => {
    if (!periods || periods.length === 0) {
      return "pending"; // valor predeterminado si no hay periods
    }

    for (let i = periods.length - 1; i >= 0; i--) {
      const period = periods[i];
      const course = period.items?.find((c) => c.courseId === courseId);

      if (course) {
        return course.status;
      }
    }

    return "pending"; // valor predeterminado si no se encuentra el curso
  };

  const handleCellClick = async (day, hour) => {
    if (!selectedItem) return; // si no hay item seleccionado, no hacer nada

    const key = `${day}-${hour}`;
    const updatedSchedule = { ...schedule };

    if (updatedSchedule[key] === selectedItem.color) {
      // si la celda ya tiene el color del item seleccionado, la despintamos
      delete updatedSchedule[key];

      setSchedule(updatedSchedule); // actualizar el estado inmediatamente

      try {
        // filtrar la celda correspondiente de las "cells" del plan
        const updatedCells = plan.cells.filter(
          (cell) => !(cell.day === day && cell.hour === parseInt(hour, 10))
        );

        const updatedPlan = {
          ...plan,
          cells: updatedCells,
        };

        // guardar en la base de datos
        await updatePlanRequest(plan._id, updatedPlan);
        console.log("cambio guardado");
        plan.cells = updatedCells;
      } catch (error) {
        console.error(
          "error al guardar el cambio:",
          error.response?.data?.message
        );
      }
    } else {
      // si no, pintamos la celda con el color de la materia seleccionada
      updatedSchedule[key] = selectedItem.color;

      setSchedule(updatedSchedule); // actualizar el estado inmediatamente

      try {
        // preparar los datos para guardar
        const newCells = Object.entries(updatedSchedule)
          .map(([key, color]) => {
            const [day, hour] = key.split("-");
            const item = activeItems.find((item) => item.color === color);

            const itemId = item?._id || null;
            const itemCode = item?.code || null;

            // verificar si itemId ya cargo
            if (!itemId) {
              return null;
            }

            // determinar itemType basado en la existencia de code
            const itemType = itemCode ? "course" : "extraTask";

            return {
              day,
              hour: parseInt(hour, 10),
              itemId,
              itemType,
            };
          })
          .filter(Boolean); // eliminar elementos nulls del arreglo

        const combinedCells = [...plan.cells];

        newCells.forEach((newCell) => {
          if (newCell) {
            // verificar si la celda ya existe y actualizarla
            const index = combinedCells.findIndex(
              (cell) => cell.day === newCell.day && cell.hour === newCell.hour
            );

            if (index !== -1) {
              combinedCells[index] = newCell; // actualizar celda existente
            } else {
              combinedCells.push(newCell); // agregar nueva celda
            }
          }
        });

        const updatedPlan = {
          ...plan,
          cells: combinedCells,
        };

        // guardar en la base de datos
        await updatePlanRequest(plan._id, updatedPlan);
        console.log("cambio guardado");
      } catch (error) {
        console.error(
          "error al guardar el cambio:",
          error.response?.data?.message
        );
      }
    }
  };

  // eliminar item del menu
  const handleRemoveItem = async (itemId) => {
    // encontrar el item a eliminar
    const itemToRemove = activeItems.find((item) => item._id === itemId);

    if (!itemToRemove) return; // si el item no existe, no hacer nada

    try {
      await removeItemFromPlanRequest(plan._id, itemToRemove._id);

      setActiveItems((prev) => prev.filter((item) => item._id !== itemId));

      if (selectedItem?._id === itemId) {
        setSelectedItem(null);
      }

      // eliminar celdas pintadas del item eliminado
      const colorToRemove = itemToRemove.color;
      setSchedule((prev) => {
        const updatedSchedule = { ...prev };
        Object.keys(updatedSchedule).forEach((key) => {
          if (updatedSchedule[key] === colorToRemove) {
            delete updatedSchedule[key];
          }
        });
        return updatedSchedule;
      });

      console.log(`item ${itemId} eliminado`);
    } catch (error) {
      console.error(
        `error al eliminar el item ${itemId}:`,
        error.response?.data?.message || error.message
      );
    }
  };

  // menu de agregar materia
  const [anchorEl, setAnchorEl] = useState(null);

  // abrir y cerrar menu
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // agregar item al menu
  const handleAddItem = (item) => {
    // verificar que el curso no esté repetido
    if (item) {
      setActiveItems((prev) => [
        ...prev,
        {
          name: item.name,
          _id: item._id,
          color: item.color || "#7303fc",
          code: item.code || null, // agregar code si está presente
        },
      ]);
      setAnchorEl(null); // cerrar menu
      setSelectedItem(item);
    }
  };

  // cargar las celdas y activeItems del plan al cargar la pagina
  const initializeSchedule = () => {
    const initialSchedule = {};
    const activeItemsSet = new Set(); // usar un conjunto para evitar duplicados

    if (plan.cells && plan.cells.length > 0) {
      plan.cells.forEach((cell) => {
        const key = `${cell.day}-${cell.hour}`;
        const item = items.find((item) => item._id === cell.itemId);
        if (item) {
          initialSchedule[key] = item.color; // asociar el color de la materia
          activeItemsSet.add(item); // añadir la materia al conjunto
        }
      });
    }

    setSchedule(initialSchedule);
    setActiveItems([...activeItemsSet]); // actualizar activeItems
  };
  useEffect(() => {
    initializeSchedule();
  }, [plan, items]);

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container size={12}>
        <Grid size={{ md: 12, lg: 9 }}>
          {/* tabla */}
          <TableContainer
            component={Paper}
            sx={{ flex: 1, border: "1px solid #303233" }}
          >
            <Table sx={{ borderCollapse: "collapse" }}>
              <TableBody>
                {days.map((day) => (
                  <TableRow key={day} sx={{ height: 40 }}>
                    {/* dia */}
                    <TableCell
                      component="th"
                      scope="row"
                      align="center"
                      sx={{
                        padding: "4px 8px",
                        width: 80,
                        border: "1px solid #303233",
                      }}
                    >
                      {dayTranslations[day]}
                    </TableCell>

                    {/* celdas de horarios */}
                    {hours.map((hour) => {
                      const key = `${day}-${hour}`;
                      const backgroundColor = schedule[key] || "transparent";

                      return (
                        <TableCell
                          key={key}
                          onClick={() => handleCellClick(day, hour)}
                          sx={{
                            backgroundColor,
                            width: 30,
                            height: 30,
                            cursor: "pointer",
                            border: "1px solid #303233",
                          }}
                        />
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>

              {/* horarios (abajo) */}
              <TableFooter>
                <TableRow sx={{ height: 40 }}>
                  <TableCell
                    sx={{
                      padding: "4px",
                      border: "1px solid #303233",
                    }}
                  ></TableCell>
                  {hours.map((hour) => (
                    <TableCell
                      key={hour}
                      align="center"
                      sx={{
                        padding: "4px",
                        border: "1px solid #303233",
                      }}
                    >
                      {hour}
                    </TableCell>
                  ))}
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Grid>

        <Grid size={{ md: 12, lg: 3 }}>
          {/* menu de items */}
          <Box sx={{ marginLeft: 2 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6">Materias</Typography>
              {/* boton para agregar items */}
              {activeItems.length < 6 && (
                <Tooltip title="Agregar Materia X">
                  <IconButton size="small" onClick={handleOpenMenu}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Divider sx={{ borderWidth: "1px", marginBottom: 0.1 }} />
            {activeItems.map((item) => (
              <Box
                key={item.name}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={0.2}
                onClick={() =>
                  setSelectedItem(
                    selectedItem?.name === item.name ? null : item
                  )
                }
                sx={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedItem?.name === item.name ? "#303233" : "inherit",
                  padding: "0.8px",
                  borderRadius: "4px",
                }}
              >
                <Box display="flex" alignItems="center">
                  <CircleIcon sx={{ color: item.color, marginX: 0.5 }} />
                  <Typography>{item.name}</Typography>
                </Box>
                <Tooltip title="Eliminar Materia">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // evitar seleccionar el item
                      handleRemoveItem(item._id);
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* menu de agregar item */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        sx={{ maxHeight: 300 }}
      >
        {items
          .filter(
            (course) =>
              !activeItems.some(
                (activeCourse) => activeCourse.name === course.name
              ) &&
              !["approved", "promoted", "in_progress"].includes(
                getStatus(course._id)
              )
          )
          .map((item) => (
            <MenuItem key={item.name} onClick={() => handleAddItem(item)}>
              {item.name}
            </MenuItem>
          ))}
      </Menu>
    </Box>
  );
}
