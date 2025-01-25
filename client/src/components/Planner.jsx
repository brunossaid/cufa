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
import CloseIcon from "@mui/icons-material/CloseRounded";
import AddIcon from "@mui/icons-material/AddRounded";

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

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const hours = Array.from({ length: 15 }, (_, i) => 8 + i);

function Planner({
  activeCourses,
  schedule,
  setSchedule,
  selectedCourse,
  setSelectedCourse,
  handleRemoveCourse,
  handleCellClick,
  handleOpenMenu,
  anchorEl,
  handleCloseMenu,
  handleAddCourse,
  courses,
}) {
  return (
    <Box display="flex">
      <TableContainer
        component={Paper}
        sx={{ flex: 1, border: "1px solid #303233" }}
      >
        <Table sx={{ borderCollapse: "collapse" }}>
          <TableBody>
            {days.map((day) => (
              <TableRow key={day} sx={{ height: 40 }}>
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

          <TableFooter>
            <TableRow>
              <TableCell></TableCell>
              {hours.map((hour) => (
                <TableCell
                  key={hour}
                  align="center"
                  sx={{ padding: "4px", border: "1px solid #303233" }}
                >
                  {hour}
                </TableCell>
              ))}
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <Box sx={{ marginLeft: 2, width: 200 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Materias</Typography>
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
                e.stopPropagation();
                handleRemoveCourse(course.name);
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>

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
    </Box>
  );
}

export default Planner;
