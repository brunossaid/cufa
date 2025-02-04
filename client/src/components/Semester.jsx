import {
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
  IconButton,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import * as React from "react";
import VisibilityIcon from "@mui/icons-material/VisibilityRounded";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import AddIcon from "@mui/icons-material/AddRounded";
import { useNavigate } from "react-router-dom";
import {
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
      case "in-progress":
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

      // eliminar el course del estado local
      setPeriodCourses((prevCourses) =>
        prevCourses.filter((course) => course.courseId !== courseToDelete)
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

  return (
    <div style={{ marginBottom: 22 }}>
      <Card sx={{ width: "100%" }}>
        <CardHeader
          title={period.year}
          subheader={`${period.semester}º Cuatrimestre`}
          action={
            <>
              <Tooltip title={"Agregar Materia"}>
                <IconButton>
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={"Eliminar Plan"}>
                <IconButton
                  onClick={() => handleOpenDialogPeriodDelete(period._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
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

                    {course.status !== "in_progress" && (
                      <TableCell sx={{ width: "14%" }} align="center">
                        {course.grade !== undefined ? course.grade : "-"}
                        {course.status === "approved" &&
                          course.finalGrade !== undefined &&
                          ` (${course.finalGrade})`}
                      </TableCell>
                    )}

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

      {/* dialog de eliminar materia*/}
      <Dialog
        open={dialogCourseDelete}
        onClose={handleClosedialogCourseDelete}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          {"¿Seguro que quieres eliminar esta materia?"}
        </DialogTitle>
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
        <DialogTitle>
          {"¿Seguro que quieres eliminar esta cursada?"}
        </DialogTitle>
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
