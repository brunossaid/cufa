import React, { useState } from "react";
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

// dias y horas
const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const hours = Array.from({ length: 15 }, (_, i) => 8 + i);

// colores predefinidos
const PREDEFINED_COLORS = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33A1",
  "#A133FF",
  "#33FFF5",
  "#FF8F33",
  "#8FFF33",
  "#338FFF",
  "#FF3333",
];

function PlannerPage() {
  const { courses } = useAuth();

  const [schedule, setSchedule] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null); // curso seleccionado
  const [activeCourses, setActiveCourses] = useState([
    { name: "Fútbol", color: PREDEFINED_COLORS[0] },
  ]); // cursos en el menú (fútbol por default)

  // deseleccinar materia
  const unselectCourse = () => {
    setSelectedCourse(null);
  };

  // celda seleccionada en el planificador
  const handleCellClick = (day, hour) => {
    if (!selectedCourse) return; // si no hay curso seleccionado, no hacer nada

    const key = `${day}-${hour}`;
    setSchedule((prev) => {
      // si la celda ya tiene el color de la materia seleccionada, la despintamos
      if (prev[key] === selectedCourse.color) {
        const updatedSchedule = { ...prev };
        delete updatedSchedule[key]; // eliminar la celda del horario
        return updatedSchedule;
      }

      // si no, pintamos la celda con el color de la materia seleccionada
      return {
        ...prev,
        [key]: selectedCourse.color,
      };
    });
  };

  // eliminar materia del menu
  const handleRemoveCourse = (courseName) => {
    // eliminar el curso de la lista de cursos activos
    setActiveCourses((prev) =>
      prev.filter((course) => course.name !== courseName)
    );

    // si la materia eliminada esta seleccionado, limpiar la seleccion
    if (selectedCourse?.name === courseName) {
      setSelectedCourse(null);
    }

    // eliminar las celdas pintadas de la materia eliminada
    const colorToRemove = activeCourses.find(
      (course) => course.name === courseName
    )?.color;
    setSchedule((prev) => {
      const updatedSchedule = { ...prev };
      Object.keys(updatedSchedule).forEach((key) => {
        if (updatedSchedule[key] === colorToRemove) {
          delete updatedSchedule[key];
        }
      });
      return updatedSchedule;
    });
  };

  // obtener color aleatorio
  const getRandomColor = () => {
    const availableColors = PREDEFINED_COLORS.filter(
      (color) => !activeCourses.some((course) => course.color === color)
    );
    return availableColors.length > 0
      ? availableColors[Math.floor(Math.random() * availableColors.length)]
      : PREDEFINED_COLORS[Math.floor(Math.random() * PREDEFINED_COLORS.length)];
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
          color: getRandomColor(),
        },
      ]);
      setAnchorEl(null); // cerrar menu
    }
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
          <Tooltip title={"Agregar Plan"}>
            <IconButton onClick={() => {}}>
              {<AddCircleIcon fontSize="large" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

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
                    {day}
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
                <TableCell></TableCell>
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
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation(); // evitar seleccionar el item
                  handleRemoveCourse(course.name);
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
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
              ) && course.status === "pending"
          )
          .map((course) => (
            <MenuItem key={course.name} onClick={() => handleAddCourse(course)}>
              {course.name}
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
}

export default PlannerPage;
