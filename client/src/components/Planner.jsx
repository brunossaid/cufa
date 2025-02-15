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
import { removeCourseFromPlanRequest } from "../api/plans";

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

export default function Planner({ courses, plan, periods }) {
  const [schedule, setSchedule] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null); // curso seleccionado
  const [activeCourses, setActiveCourses] = useState([]); // cursos en el menu

  // buscar entre los periods el status
  const getStatus = (courseId) => {
    for (let i = periods.length - 1; i >= 0; i--) {
      const period = periods[i];
      const course = period.courses.find((c) => c.courseId === courseId);

      if (course) {
        return course.status;
      }
    }

    return "pending"; // default
  };

  const handleCellClick = async (day, hour) => {
    if (!selectedCourse) return; // si no hay curso seleccionado, no hacer nada

    const key = `${day}-${hour}`;
    const updatedSchedule = { ...schedule };

    if (updatedSchedule[key] === selectedCourse.color) {
      // si la celda ya tiene el color de la materia seleccionada, la despintamos
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
      updatedSchedule[key] = selectedCourse.color;

      setSchedule(updatedSchedule); // actualizar el estado inmediatamente

      try {
        // preparar los datos para guardar
        const cells = Object.entries(updatedSchedule).map(([key, color]) => {
          const [day, hour] = key.split("-");
          const course = activeCourses.find((course) => course.color === color);
          return {
            day,
            hour: parseInt(hour, 10),
            courseCode: course?.code || null,
          };
        });

        const updatedPlan = {
          ...plan,
          cells,
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

  // eliminar materia del menu
  const handleRemoveCourse = async (courseName) => {
    // encontrar el curso a eliminar
    const courseToRemove = activeCourses.find(
      (course) => course.name === courseName
    );

    if (!courseToRemove) return; // si el curso no existe, no hacer nada

    try {
      await removeCourseFromPlanRequest(plan._id, courseToRemove.code);

      setActiveCourses((prev) =>
        prev.filter((course) => course.name !== courseName)
      );

      if (selectedCourse?.name === courseName) {
        setSelectedCourse(null);
      }

      // eliminar celdas pintadas de la materia eliminada
      const colorToRemove = courseToRemove.color;
      setSchedule((prev) => {
        const updatedSchedule = { ...prev };
        Object.keys(updatedSchedule).forEach((key) => {
          if (updatedSchedule[key] === colorToRemove) {
            delete updatedSchedule[key];
          }
        });
        return updatedSchedule;
      });

      console.log(`Curso ${courseName} eliminado correctamente del plan.`);
    } catch (error) {
      console.error(
        `Error al eliminar el curso ${courseName}:`,
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

  // agregar materia al menu
  const handleAddCourse = (course) => {
    // verificar que el curso no este repetido
    if (course) {
      setActiveCourses((prev) => [
        ...prev,
        {
          name: course.name,
          code: course.code,
          color: course.color || "#7303fc",
        },
      ]);
      setAnchorEl(null); // cerrar menu
      setSelectedCourse(course);
    }
  };

  // cargar las celdas y activeCourses del plan al cargar la pagina
  const initializeSchedule = () => {
    const initialSchedule = {};
    const activeCoursesSet = new Set(); // usar un conjunto para evitar duplicados

    if (plan.cells && plan.cells.length > 0) {
      plan.cells.forEach((cell) => {
        const key = `${cell.day}-${cell.hour}`;
        const course = courses.find(
          (course) => course.code === cell.courseCode
        );
        if (course) {
          initialSchedule[key] = course.color; // asociar el color de la materia
          activeCoursesSet.add(course); // añadir la materia al conjunto
        }
      });
    }

    setSchedule(initialSchedule);
    setActiveCourses([...activeCoursesSet]); // actualizar activeCourses
  };
  useEffect(() => {
    initializeSchedule();
  }, [plan, courses]);

  return (
    <Box sx={{ mb: 3 }}>
      {/* tabla */}
      <Box display="flex">
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
              <TableRow>
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

        {/* menu de materias */}
        <Box sx={{ marginLeft: 2, width: 200 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">Materias</Typography>
            {/* boton para agregar materias */}
            {activeCourses.length < 6 && (
              <Tooltip title="Agregar Materia">
                <IconButton size="small" onClick={handleOpenMenu}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Divider sx={{ borderWidth: "1px", marginBottom: 0.1 }} />
          {activeCourses.map((course) => (
            <Box
              key={course.name}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={0.2}
              onClick={() =>
                setSelectedCourse(
                  selectedCourse?.name === course.name ? null : course
                )
              }
              sx={{
                cursor: "pointer",
                backgroundColor:
                  selectedCourse?.name === course.name ? "#303233" : "inherit",
                padding: "0.8px",
                borderRadius: "4px",
              }}
            >
              <Box display="flex" alignItems="center">
                <Tooltip title={course.code}>
                  <CircleIcon sx={{ color: course.color, marginRight: 1 }} />
                </Tooltip>
                <Typography>{course.name}</Typography>
              </Box>
              <Tooltip title="Eliminar Materia">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation(); // evitar seleccionar el item
                    handleRemoveCourse(course.name);
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
        </Box>
      </Box>

      {/* menu de agregar materia */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        sx={{ maxHeight: 300 }}
      >
        {courses
          .filter(
            (course) =>
              !activeCourses.some(
                (activeCourse) => activeCourse.name === course.name
              ) &&
              !["approved", "promoted", "in_progress"].includes(
                getStatus(course._id)
              )
          )
          .map((course) => (
            <MenuItem key={course.name} onClick={() => handleAddCourse(course)}>
              {course.name}
            </MenuItem>
          ))}
      </Menu>
    </Box>
  );
}
