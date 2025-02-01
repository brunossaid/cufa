import * as React from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useAuth } from "../context/AuthContext";
import EditIcon from "@mui/icons-material/EditRounded";
import AddIcon from "@mui/icons-material/AddRounded";
import DoneIcon from "@mui/icons-material/DoneRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLateRounded";
import AlarmIcon from "@mui/icons-material/AlarmRounded";
import { createPeriodRequest } from "../api/periods";

function HistoryPage() {
  const { courses, periods, user, loading } = useAuth();

  // useStates
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [semester, setSemester] = React.useState(1);

  const [periodCourses, setPeriodCourses] = React.useState([]);
  const [editingPeriodCourseIndex, setEditingPeriodCourseIndex] =
    React.useState(null);

  // dialog de agregar materia
  const [dialogAdd, setDialogAdd] = React.useState(false);
  // abrir
  const handleOpenDialog = () => {
    setDialogAdd(true);
  };
  // cerrar
  const handleCloseDialog = () => {
    setDialogAdd(false);
    resetFields();
  };

  // resetear campos
  const resetFields = () => {
    setYear(new Date().getFullYear());
    setSemester(1);
    setPeriodCourses([]);
    setEditingPeriodCourseIndex(null);
  };

  // agregar materia al period
  const addCourse = () => {
    const newCourse = {
      courseId: null,
      status: "",
    };
    setPeriodCourses([...periodCourses, newCourse]);
    setEditingPeriodCourseIndex(periodCourses.length); // nuevo periodo en modo edicion
  };
  // editar materia
  const updatePeriodCourseField = (index, field, value) => {
    const updatedCourses = [...periodCourses];
    updatedCourses[index][field] = value;
    setPeriodCourses(updatedCourses);
  };
  // guardar materia
  const savePeriodCourse = (index) => {
    setEditingPeriodCourseIndex(null); // salir de modo edicion
  };
  // eliminar materia
  const deletePeriodCourse = (index) => {
    setPeriodCourses((prevCourses) =>
      prevCourses.filter((_, i) => i !== index)
    );
  };

  // crear periodo
  const savePeriod = async () => {
    console.log(periodCourses);
    const period = {
      year: year,
      semester: semester,
      courses: periodCourses,
      user: user.id,
    };

    try {
      const response = await createPeriodRequest(period);
      console.log("nuevo periodo creado:", response.data);
      handleCloseDialog();
    } catch (error) {
      console.error("error al crear el period:", error);
    }
  };

  // dias y años
  const days = [
    { english: "monday", spanish: "Lunes" },
    { english: "tuesday", spanish: "Martes" },
    { english: "wednesday", spanish: "Miércoles" },
    { english: "thursday", spanish: "Jueves" },
    { english: "friday", spanish: "Viernes" },
    { english: "saturday", spanish: "Sábado" },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2009 },
    (_, index) => 2010 + index
  );

  return (
    <div>
      <h1>Historial</h1>
      <Button variant="outlined" onClick={handleOpenDialog}>
        crear cursada
      </Button>

      {/* dialog de agregar materia*/}
      <Dialog
        open={dialogAdd}
        onClose={handleCloseDialog}
        sx={{
          "& .MuiDialog-paper": { width: "50%", maxWidth: "none" },
        }}
      >
        <DialogTitle>Nueva Cursada</DialogTitle>

        <DialogContent sx={{ paddingBottom: 1 }}>
          <Grid container size={12} spacing={2} sx={{ marginTop: 0.7 }}>
            <Grid size={{ xs: 12, md: 12, lg: 6 }}>
              <Autocomplete
                value={year}
                options={years}
                renderInput={(params) => (
                  <TextField {...params} label="Año" size="small" />
                )}
                isOptionEqualToValue={(option, value) => option === value}
                getOptionLabel={(option) => option.toString()}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 12, lg: 6 }}>
              <ToggleButtonGroup
                exclusive
                size="small"
                fullWidth
                value={semester}
                onChange={(event, newValue) => {
                  if (newValue !== null) {
                    setSemester(newValue);
                  }
                }}
              >
                <ToggleButton value={1}>1ºc</ToggleButton>
                <ToggleButton value={2}>2ºc</ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            <Grid size={{ xs: 12, md: 12, lg: 12 }}>
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
                  <Typography>{"Materias"}</Typography>
                  <Tooltip title="Agregar Materia">
                    <IconButton onClick={addCourse}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <List sx={{ paddingY: 0 }}>
                  {periodCourses.map((course, index) => (
                    <ListItem
                      key={index}
                      alignItems="flex-start"
                      secondaryAction={
                        <>
                          {editingPeriodCourseIndex === index ? (
                            <Tooltip title="Guardar">
                              <IconButton
                                edge="end"
                                sx={{ marginRight: 1 }}
                                onClick={() => savePeriodCourse(index)}
                              >
                                <DoneIcon />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Editar">
                              <IconButton
                                edge="end"
                                sx={{ marginRight: 1 }}
                                onClick={() =>
                                  setEditingPeriodCourseIndex(index)
                                }
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Eliminar">
                            <IconButton
                              edge="end"
                              onClick={() => deletePeriodCourse(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      }
                    >
                      <ListItemAvatar>
                        {course.status === "promoted" ? (
                          <Tooltip title="Promocionada">
                            <AssignmentTurnedInIcon
                              fontSize="large"
                              color="primary"
                            />
                          </Tooltip>
                        ) : course.status === "approved" ? (
                          <Tooltip title="Aprobada">
                            <AssignmentTurnedInIcon fontSize="large" />
                          </Tooltip>
                        ) : course.status === "disapproved" ? (
                          <Tooltip title="Desaprobada">
                            <AssignmentLateIcon fontSize="large" />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Cursando">
                            <AlarmIcon fontSize="large" />
                          </Tooltip>
                        )}
                      </ListItemAvatar>
                      {editingPeriodCourseIndex === index ? (
                        <Box
                          display="flex"
                          flexDirection="column"
                          gap={1.5}
                          sx={{ width: "75%" }}
                        >
                          <Grid container size={12} spacing={1.5}>
                            <Grid size={{ xs: 12, md: 12, lg: 6 }}>
                              <Autocomplete
                                value={
                                  courses.find(
                                    (c) => c._id === course.courseId
                                  ) || null
                                }
                                onChange={(e, newValue) =>
                                  updatePeriodCourseField(
                                    index,
                                    "courseId",
                                    newValue?._id || null
                                  )
                                }
                                options={courses.filter(
                                  (c) =>
                                    !periodCourses.some(
                                      (pc) => pc.courseId === c._id
                                    )
                                )}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Materia"
                                    size="small"
                                  />
                                )}
                                isOptionEqualToValue={(option, value) =>
                                  option?._id === value?._id
                                }
                                getOptionLabel={(option) =>
                                  option
                                    ? `(${option.code}) ${option.name}`
                                    : ""
                                }
                              />
                            </Grid>

                            <Grid size={{ xs: 12, md: 12, lg: 6 }}>
                              <FormControl fullWidth>
                                <InputLabel size="small">Estado</InputLabel>
                                <Select
                                  value={course.status}
                                  label="Estado"
                                  size="small"
                                  onChange={(event) =>
                                    updatePeriodCourseField(
                                      index,
                                      "status",
                                      event.target.value
                                    )
                                  }
                                >
                                  <MenuItem value={"approved"}>
                                    Aprobada
                                  </MenuItem>
                                  <MenuItem value={"promoted"}>
                                    Promocionada
                                  </MenuItem>
                                  <MenuItem value={"disapproved"}>
                                    Desaprobada
                                  </MenuItem>
                                  <MenuItem value={"in_progress"}>
                                    Cursando
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Box>
                      ) : (
                        <ListItemText
                          primary={
                            courses.find((c) => c._id === course.courseId)?.name
                          }
                          secondary={
                            courses.find((c) => c._id === course.courseId)?.code
                          }
                        />
                      )}
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            marginX: 2,
            marginY: 1,
          }}
        >
          <Button variant="contained" color="error" onClick={handleCloseDialog}>
            Cancelar
          </Button>

          <Button variant="contained" color="success" onClick={savePeriod}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default HistoryPage;
