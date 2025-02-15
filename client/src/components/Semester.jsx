import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import * as React from "react";
import VisibilityIcon from "@mui/icons-material/VisibilityRounded";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import AddIcon from "@mui/icons-material/AddRounded";
import { useNavigate } from "react-router-dom";
import {
  addCourseToPeriodRequest,
  deleteCourseFromPeriodRequest,
  deletePeriodRequest,
} from "../api/periods";

// transicion del dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Semester({
  period,
  periods,
  setPeriods,
  courses,
  showAlert,
}) {
  // estado local para los courses del period
  const [periodCourses, setPeriodCourses] = React.useState(period.courses);

  // traducir status
  const translateStatus = (status) => {
    switch (status) {
      case "approved":
        return "Aprobado";
      case "promoted":
        return "Promocion";
      case "disapproved":
        return "Desaprobado";
      case "in_progress":
        return "En curso";
      default:
        return "Desconocido";
    }
  };

  // navigate
  const navigate = useNavigate();
  const handleNavigate = (code, periodId) => {
    console.log("Navigating to: ", code);
    navigate(`/courses/${code}`, { state: { periodId } });
  };

  // eliminar materia del period
  const deleteCourse = async () => {
    try {
      await deleteCourseFromPeriodRequest(periodForUpdate, courseToDelete);
      console.log("course eliminado");

      // actualizamos estado local y global
      setPeriodCourses((prevCourses) =>
        prevCourses.filter((course) => course.courseId !== courseToDelete)
      );
      setPeriods((prevPeriods) =>
        prevPeriods.map((p) =>
          p._id === periodForUpdate
            ? {
                ...p,
                courses: p.courses.filter((c) => c.courseId !== courseToDelete),
              }
            : p
        )
      );

      showAlert("Materia Eliminada", "error", <DeleteIcon />);
      handleClosedialogCourseDelete();
    } catch (error) {
      console.error("error al eliminar course:", error);
      showAlert("Error", "error");
    }
  };

  // dialog de eliminar materia
  const [dialogCourseDelete, setDialogCourseDelete] = React.useState(false);
  const [courseToDelete, setCourseToDelete] = React.useState(null);
  const [periodForUpdate, setPeriodForUpdate] = React.useState(null);
  // abrir
  const handleOpendialogCourseDelete = (periodId, courseId) => {
    setPeriodForUpdate(periodId);
    setCourseToDelete(courseId);
    setDialogCourseDelete(true);
  };
  // cerrar
  const handleClosedialogCourseDelete = () => {
    setDialogCourseDelete(false);
    setPeriodForUpdate(null);
    setCourseToDelete(null);
  };

  // eliminar period
  const deletePeriod = async () => {
    try {
      await deletePeriodRequest(periodToDelete);
      console.log("period eliminado");

      // eliminar el period del estado local
      setPeriods((prevPeriods) =>
        prevPeriods.filter((period) => period._id !== periodToDelete)
      );

      showAlert("Cursada Eliminada", "error", <DeleteIcon />);
      handleCloseDialogPeriodDelete();
    } catch (error) {
      console.error("error al eliminar course:", error.response.data.message);
      showAlert("Error", "error");
    }
  };

  // dialog de eliminar materia
  const [dialogPeriodDelete, setDialogPeriodDelete] = React.useState(false);
  const [periodToDelete, setPeriodToDelete] = React.useState(null);
  // abrir
  const handleOpenDialogPeriodDelete = (periodId) => {
    setPeriodToDelete(periodId);
    setDialogPeriodDelete(true);
  };
  // cerrar
  const handleCloseDialogPeriodDelete = () => {
    setDialogPeriodDelete(false);
    setPeriodToDelete(null);
  };

  // dialog de agregar materia
  const [dialogCourseAdd, setDialogCourseAdd] = React.useState(false);
  // abrir
  const handleOpenDialogCourseAdd = (periodId) => {
    setDialogCourseAdd(true);
  };
  // cerrar
  const handleCloseDialogCourseAdd = () => {
    setDialogCourseAdd(false);
  };

  // course a agregar
  const [courseToAdd, setCourseToAdd] = React.useState({
    courseId: null,
    status: "",
    grade: null,
  });

  // opciones de grade segun status
  const getValidGrades = (status) => {
    switch (status) {
      case "approved":
        return [4, 5, 6];
      case "promoted":
        return [7, 8, 9, 10];
      case "disapproved":
        return [1, 2, 3];
      default:
        return [];
    }
  };

  // states de errores
  const [formErrors, setFormErrors] = React.useState({
    courseId: false,
    status: false,
  });

  // guardar materia
  const handleSaveCourse = async () => {
    setFormErrors({
      courseId: false,
      status: false,
    });

    if (courseToAdd.courseId && courseToAdd.status) {
      const newCourse = {
        courseId: courseToAdd.courseId,
        status: courseToAdd.status,
        grade: courseToAdd.grade || null,
      };

      try {
        await addCourseToPeriodRequest(period._id, newCourse);

        // actualizamos estado local y global
        setPeriodCourses((prevCourses) => [...prevCourses, newCourse]);
        setPeriods((prevPeriods) =>
          prevPeriods.map((p) =>
            p._id === period._id
              ? { ...p, courses: [...p.courses, newCourse] }
              : p
          )
        );

        console.log("materia agregada");
        showAlert("Materia Agregada", "success");
        handleCloseDialogCourseAdd();
      } catch (error) {
        console.error("error al agregar course:", error);
        showAlert("Error al agregar materia", "error");
      }
    } else {
      setFormErrors({
        courseId: !courseToAdd.courseId,
        status: !courseToAdd.status,
      });
      showAlert("Faltan campos obligatorios", "error");
    }
  };

  return (
    <div style={{ marginBottom: 22 }}>
      <Card sx={{ width: "100%" }}>
        <CardHeader
          title={period.year}
          subheader={`${period.semester}º Cuatrimestre`}
          action={
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Tooltip
                title={
                  periodCourses.length >= 5
                    ? "Límite de 5 Materias"
                    : "Agregar Materia"
                }
              >
                <span>
                  <IconButton
                    onClick={() => handleOpenDialogCourseAdd()}
                    disabled={periodCourses.length >= 5}
                  >
                    <AddIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={"Eliminar Plan"}>
                <IconButton
                  onClick={() => handleOpenDialogPeriodDelete(period._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          }
          sx={{ paddingY: 1 }}
        />
        <CardContent sx={{ paddingY: 0 }}>
          <Table>
            <TableBody>
              {periodCourses.map((course) => {
                // encuentra el curso en la lista "courses"
                const courseData = courses.find(
                  (c) => c._id === course.courseId
                );

                return (
                  <TableRow key={course.courseId}>
                    <TableCell sx={{ width: "10%" }} align="center">
                      {courseData?.code}
                    </TableCell>

                    <TableCell sx={{ width: "40%" }}>
                      {courseData?.name}
                    </TableCell>

                    <TableCell sx={{ width: "18%" }} align="center">
                      {translateStatus(course.status)}
                    </TableCell>

                    <TableCell sx={{ width: "14%" }} align="center">
                      <Tooltip
                        title={
                          typeof course.grade === "number"
                            ? "Nota de cursada"
                            : "No hay nota cargada"
                        }
                        arrow
                      >
                        <span>
                          {typeof course.grade === "number"
                            ? course.grade
                            : "-"}
                        </span>
                      </Tooltip>
                      {course.status === "approved" &&
                        course.finalGrade !== undefined && (
                          <Tooltip title="Nota de final" arrow>
                            <span> ({course.finalGrade})</span>
                          </Tooltip>
                        )}
                    </TableCell>

                    <TableCell sx={{ width: "18%" }} align="center">
                      <Tooltip title={"Ver más"}>
                        <IconButton
                          onClick={() => {
                            handleNavigate(courseData.code, period._id);
                          }}
                          sx={{ padding: 0, marginRight: 1 }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={"Eliminar"}>
                        <IconButton
                          onClick={() => {
                            handleOpendialogCourseDelete(
                              period._id,
                              course.courseId
                            );
                          }}
                          sx={{ padding: 0, marginLeft: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* dialog de agregar materia*/}
      <Dialog
        open={dialogCourseAdd}
        onClose={handleCloseDialogCourseAdd}
        TransitionComponent={Transition}
        sx={{
          "& .MuiDialog-paper": { width: "30%", maxWidth: "none" },
        }}
      >
        <DialogTitle>
          Agregar Materia
          <Box sx={{ marginTop: 0.5 }}>
            <Typography variant="subtitle2" color="textSecondary">
              2º Cuatrimestre 2025
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ paddingBottom: 1 }}>
          <Grid container size={12} spacing={2} sx={{ marginTop: 0.7 }}>
            <Grid size={{ xs: 12, md: 12, lg: 12 }}>
              <Autocomplete
                options={courses.filter(
                  (course) =>
                    !periodCourses.some(
                      (periodCourse) => periodCourse.courseId === course._id
                    )
                )}
                getOptionLabel={(option) => `(${option.code}) ${option.name}`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Materia"
                    error={formErrors.courseId}
                  />
                )}
                onChange={(event, newValue) => {
                  setCourseToAdd((prev) => ({
                    ...prev,
                    courseId: newValue ? newValue._id : null,
                  }));
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 12, lg: 7 }}>
              <FormControl fullWidth error={formErrors.status}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={courseToAdd.status || ""}
                  label="Estado"
                  onChange={(event) => {
                    setCourseToAdd({
                      ...courseToAdd,
                      status: event.target.value,
                      grade: null,
                    });
                  }}
                >
                  <MenuItem value={"approved"}>Aprobada</MenuItem>
                  <MenuItem value={"promoted"}>Promocionada</MenuItem>
                  <MenuItem value={"disapproved"}>Desaprobada</MenuItem>
                  <MenuItem value={"in_progress"}>Cursando</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 12, lg: 5 }}>
              <FormControl fullWidth>
                <InputLabel>Nota</InputLabel>
                <Select
                  value={courseToAdd.grade || ""}
                  label="Nota"
                  onChange={(event) => {
                    setCourseToAdd({
                      ...courseToAdd,
                      grade: event.target.value,
                    });
                  }}
                  disabled={
                    !courseToAdd.status || courseToAdd.status === "in_progress"
                  }
                >
                  {getValidGrades(courseToAdd.status).map((grade) => (
                    <MenuItem key={grade} value={grade}>
                      {grade}
                    </MenuItem>
                  ))}
                  <MenuItem value={null}>-</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            marginX: 2,
            marginY: 1,
          }}
        >
          <Button
            variant="contained"
            color="error"
            onClick={handleCloseDialogCourseAdd}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleSaveCourse}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* dialog de eliminar materia*/}
      <Dialog
        open={dialogCourseDelete}
        onClose={handleClosedialogCourseDelete}
        TransitionComponent={Transition}
      >
        <DialogTitle>{"Seguro de eliminar esta materia?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Este cambio es irreversible</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClosedialogCourseDelete}
            color="error"
            variant="contained"
          >
            Cancelar
          </Button>
          <Button onClick={deleteCourse} color="success" variant="contained">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      {/* dialog de eliminar period*/}
      <Dialog
        open={dialogPeriodDelete}
        onClose={handleCloseDialogPeriodDelete}
        TransitionComponent={Transition}
      >
        <DialogTitle>{"Seguro de eliminar esta cursada?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Este cambio es irreversible</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialogPeriodDelete}
            color="error"
            variant="contained"
          >
            Cancelar
          </Button>
          <Button onClick={deletePeriod} color="success" variant="contained">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
