import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Autocomplete,
  Box,
  FormControl,
  FormHelperText,
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
import OneIcon from "@mui/icons-material/LooksOneRounded";
import TwoIcon from "@mui/icons-material/LooksTwoRounded";
import VisibilityIcon from "@mui/icons-material/VisibilityRounded";
import EditIcon from "@mui/icons-material/EditRounded";
import AddIcon from "@mui/icons-material/AddRounded";
import DoneIcon from "@mui/icons-material/DoneRounded";
import AlarmIcon from "@mui/icons-material/AlarmRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import PersonIcon from "@mui/icons-material/PersonRounded";
import GroupsIcon from "@mui/icons-material/GroupsRounded";
import HeadsetIcon from "@mui/icons-material/HeadsetMicRounded";
import { updateCourseRequest } from "../api/courses";
import LoadingX from "../components/LoadingX";

function CoursePage({ showAlert }) {
  const { courses, loading } = useAuth();
  const { code } = useParams();
  const navigate = useNavigate();

  // 📌 Estados principales
  const [name, setName] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [workload, setWorkload] = React.useState("");
  const [prerequisites, setPrerequisites] = React.useState([]);
  const [type, setType] = React.useState("");
  const [year, setYear] = React.useState(null);
  const [semester, setSemester] = React.useState(null);
  const [commission, setCommission] = React.useState("");
  const [building, setBuilding] = React.useState("");
  const [classroom, setClassroom] = React.useState("");
  const [grade, setGrade] = React.useState("");
  const [modality, setModality] = React.useState("");
  const [observations, setObservations] = React.useState("");

  // 📌 Profesores
  const [professors, setProfessors] = React.useState([]);
  const [editingProffessorIndex, setEditingProffessorIndex] =
    React.useState(null);

  // 📌 Horarios
  const [schedules, setSchedules] = React.useState([]);
  const [editingScheduleIndex, setEditingScheduleIndex] = React.useState(null);

  // 📌 Manejo de errores
  const [errors, setErrors] = React.useState({});

  // 📌 Activar/desactivar modo edición
  const [editMode, setEditMode] = React.useState(false);

  // 📌 Definir curso
  const course = courses?.find((course) => course.code === code) || null;

  // 📌 Verificaciones
  if (loading) return <LoadingX />;
  if (!courses || courses.length === 0) {
    showAlert("No hay materias cargadas", "error");
    navigate("/courses");
    return null;
  }
  if (!course) {
    showAlert("Materia no encontrada", "error");
    navigate("/courses");
    return null;
  }

  // 📌 Funciones de manejo de profesores
  const addProfessor = () => {
    setProfessors([...professors, { name: "", email: "", observations: "" }]);
    setEditingProffessorIndex(professors.length);
  };

  const updateProfessorField = (index, field, value) => {
    const updatedProfessors = [...professors];
    updatedProfessors[index][field] = value;
    setProfessors(updatedProfessors);
  };

  const saveProfessor = () => setEditingProffessorIndex(null);
  const deleteProfessor = (index) => {
    setProfessors(professors.filter((_, i) => i !== index));
  };

  // 📌 Funciones de manejo de horarios
  const addSchedule = () => {
    setSchedules([
      ...schedules,
      { startTime: "", endTime: "", day: "", modality: "presential" },
    ]);
    setEditingScheduleIndex(schedules.length);
  };

  const updateScheduleField = (index, field, value) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index][field] = value;
    setSchedules(updatedSchedules);
  };

  const saveSchedule = () => setEditingScheduleIndex(null);
  const deleteSchedule = (index) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  // 📌 Funciones de manejo de cambios
  const toggleMode = () => setEditMode(!editMode);

  const saveChanges = () => {
    const newErrors = {};

    // Verificar cada campo y crear un error si está vacío
    if (!code) newErrors.code = "El código es obligatorio.";
    if (!name) newErrors.name = "El nombre es obligatorio.";
    if (!workload) newErrors.workload = "La carga horaria es obligatoria.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showAlert("Falta Completar Datos", "error");
      return;
    }

    // Guardamos SOLO los datos que se modificaron
    const editedCourse = {};
    if (name !== course.name) editedCourse.name = name;
    if (workload !== course.workload) editedCourse.workload = workload;
    if (status !== course.status) editedCourse.status = status;
    if (prerequisites !== course.prerequisites)
      editedCourse.prerequisites = prerequisites;
    if (year !== course.year) editedCourse.year = year;
    if (semester !== course.semester) editedCourse.semester = semester;
    if (type !== course.type) editedCourse.type = type;
    if (commission !== course.commission) editedCourse.commission = commission;
    if (building !== course.building) editedCourse.building = building;
    if (classroom !== course.classroom) editedCourse.classroom = classroom;
    if (grade !== course.grade) editedCourse.grade = grade;
    if (modality !== course.modality) editedCourse.modality = modality;
    if (observations !== course.observations)
      editedCourse.observations = observations;
    if (professors !== course.professors) editedCourse.professors = professors;

    // Eliminar campos vacíos
    const filteredCourse = Object.fromEntries(
      Object.entries(editedCourse).filter(([_, value]) => value !== "")
    );

    resetFields();
    setErrors({});
    setEditMode(false);

    try {
      updateCourseRequest(course._id, filteredCourse);
      showAlert("Materia Editada", "info", <DoneIcon />);
    } catch (error) {
      console.error("error: ", error);
      showAlert("Error", "error");
    }
  };

  const cancelChanges = () => {
    resetFields();
    setEditMode(false);
  };

  const resetFields = () => {
    setName(course.name);
    setStatus(course.status);
    setGrade(course.grade);
    setWorkload(course.workload);
    setModality(course.modality);
    setPrerequisites(course.prerequisites);
    setYear(course.year);
    setSemester(course.semester);
    setType(course.type);
    setCommission(course.commission);
    setBuilding(course.building);
    setClassroom(course.classroom);
    setProfessors(course.professors);
    setSchedules(course.schedules);
    setObservations(course.observations);
  };

  // 📌 Manejo de cambios de campos
  const handleChangeName = (event) => {
    setName(event.target.value);
  };
  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
  };
  const handleChangeWorkload = (event) => {
    setWorkload(event.target.value);
  };
  const handleChangePrerequisites = (event, value) => {
    const updatedPrerequisites = value.map((course) => course._id);
    setPrerequisites(updatedPrerequisites);
  };
  const handleChangeType = (event, newType) => {
    setType(newType);
  };
  const handleChangeYear = (event, newYear) => {
    setYear(newYear);
  };
  const handleChangeSemester = (event, newSemester) => {
    setSemester(newSemester);
  };
  const handleChangeCommission = (event) => {
    setCommission(event.target.value);
  };
  const handleChangeBuilding = (event) => {
    setBuilding(event.target.value);
  };
  const handleChangeClassroom = (event) => {
    setClassroom(event.target.value);
  };
  const handleChangeGrade = (event) => {
    setGrade(event.target.value);
  };
  const handleChangeModality = (event, newValue) => {
    setModality(newValue);
  };
  const handleChangeObservations = (event, newValue) => {
    setObservations(newValue);
  };

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginBottom={2.5}
      >
        <h1 style={{ margin: 0 }}>{course.name}</h1>
        <Box display="flex" alignItems="center">
          {editMode ? (
            <>
              <Tooltip title={"Guardar"} sx={{ marginRight: 1.5 }}>
                <IconButton onClick={saveChanges}>
                  <DoneIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={"Cancelar"}>
                <IconButton onClick={cancelChanges}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Tooltip title={"Modo Edicion"}>
              <IconButton onClick={toggleMode}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      <Grid container spacing={2}>
        {/* fila 1: nombre - codigo - estado - nota */}
        <Grid container size={12} sx={{ marginTop: 0.7 }}>
          <Grid size={{ xs: 12, md: 4, lg: 2 }}>
            <TextField
              label="Código"
              name="code"
              fullWidth
              autoComplete="off"
              value={course.code}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 8, lg: 5 }}>
            <TextField
              label="Nombre"
              name="name"
              fullWidth
              autoComplete="off"
              value={name}
              onChange={handleChangeName}
              slotProps={{
                input: {
                  readOnly: !editMode,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 8, lg: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={status}
                label="Estado"
                onChange={handleChangeStatus}
                slotProps={{
                  input: {
                    readOnly: !editMode,
                  },
                }}
                sx={{
                  ".MuiSelect-icon": {
                    display: editMode ? "block" : "none", // ocultar la flecha
                  },
                }}
              >
                <MenuItem value={"approved"}>Aprobada</MenuItem>
                <MenuItem value={"promoted"}>Promocionada</MenuItem>
                <MenuItem value={"pending"}>Pendiente</MenuItem>
                <MenuItem value={"in_progress"}>En Curso</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4, lg: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Nota</InputLabel>
              <Select
                value={grade}
                label="Nota"
                onChange={handleChangeGrade}
                slotProps={{
                  input: {
                    readOnly: !editMode,
                  },
                }}
                sx={{
                  ".MuiSelect-icon": {
                    display: editMode ? "block" : "none", // ocultar la flecha
                  },
                }}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={10}>10</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* fila 2: carga horaria - modalidad - correlativas*/}
        <Grid container size={12}>
          <Grid size={{ xs: 12, md: 6, lg: 2 }}>
            <FormControl fullWidth error={!!errors.workload}>
              <InputLabel>Carga Horaria</InputLabel>
              <Select
                value={workload}
                label="Carga Horaria"
                onChange={handleChangeWorkload}
                slotProps={{
                  input: {
                    readOnly: !editMode,
                  },
                }}
                sx={{
                  ".MuiSelect-icon": {
                    display: editMode ? "block" : "none", // ocultar la flecha
                  },
                }}
              >
                {Array.from({ length: 16 }, (_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
              {errors.workload && (
                <FormHelperText color={"red"}>{errors.workload}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <ToggleButtonGroup
              value={modality}
              exclusive
              onChange={handleChangeModality}
              fullWidth={true}
              sx={{ height: "100%" }}
            >
              <ToggleButton value={"presential"} disabled={!editMode}>
                Presencial
              </ToggleButton>
              <ToggleButton value={"virtual"} disabled={!editMode}>
                Virtual
              </ToggleButton>
              <ToggleButton value={"mixed"} disabled={!editMode}>
                Mixta
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          <Grid size={{ xs: 12, md: 12, lg: 6 }}>
            <Autocomplete
              multiple
              name="prerequisites"
              options={courses.filter(
                (course) =>
                  !prerequisites.some((selected) => selected === course._id)
              )}
              getOptionLabel={(option) => `(${option.code}) ${option.name}`}
              value={courses.filter((course) =>
                prerequisites.includes(course._id)
              )}
              onChange={handleChangePrerequisites}
              readOnly={!editMode}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Correlativas"
                  placeholder="Materia"
                />
              )}
            />
            {/* 
            <Autocomplete
              multiple
              name="prerequisites"
              options={courses.filter(
                (course) =>
                  !prerequisites.some(
                    (selected) => selected.code === course.code
                  )
              )}
              getOptionLabel={(option) => option.name}
              value={prerequisites}
              onChange={handleChangePrerequisites}
              readOnly={!editMode}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Correlativas"
                  placeholder="Materia"
                />
              )}
            />
            */}
          </Grid>
        </Grid>

        {/* fila 3: año - cuatrimestre - tipo */}
        <Grid container size={12}>
          <Grid size={{ xs: 12, sm: 12, md: 8, lg: 5 }}>
            <Typography gutterBottom sx={{ marginBottom: 0.2 }}>
              Año
            </Typography>
            <ToggleButtonGroup
              value={year}
              exclusive
              onChange={handleChangeYear}
              fullWidth={true}
            >
              <ToggleButton value={1} disabled={!editMode}>
                1º
              </ToggleButton>
              <ToggleButton value={2} disabled={!editMode}>
                2º
              </ToggleButton>
              <ToggleButton value={3} disabled={!editMode}>
                3º
              </ToggleButton>
              <ToggleButton value={4} disabled={!editMode}>
                4º
              </ToggleButton>
              <ToggleButton value={5} disabled={!editMode}>
                5º
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2 }}>
            <Typography gutterBottom sx={{ marginBottom: 0.2 }}>
              Cuatrimestre
            </Typography>
            <ToggleButtonGroup
              value={semester}
              exclusive
              onChange={handleChangeSemester}
              fullWidth={true}
            >
              <ToggleButton value={1} disabled={!editMode}>
                <OneIcon />
              </ToggleButton>
              <ToggleButton value={2} disabled={!editMode}>
                <TwoIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          <Grid size={{ xs: 12, sm: 12, lg: 5 }}>
            <Typography gutterBottom sx={{ marginBottom: 0.2 }}>
              Tipo
            </Typography>
            <ToggleButtonGroup
              value={type}
              exclusive
              onChange={handleChangeType}
              fullWidth={true}
            >
              <ToggleButton value="mandatory" disabled={!editMode}>
                Obligatoria
              </ToggleButton>
              <ToggleButton value="optional" disabled={!editMode}>
                Optativa
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>

        {/* fila 4: edificio - aula - comision */}
        {status != "pending" && (
          <Grid container size={12}>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 5 }}>
              <TextField
                label="Edificio"
                name="building"
                fullWidth
                autoComplete="off"
                value={building}
                onChange={handleChangeBuilding}
                slotProps={{
                  input: {
                    readOnly: !editMode,
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 8, lg: 4 }}>
              <TextField
                label="Aula"
                name="classroom"
                fullWidth
                autoComplete="off"
                value={classroom}
                onChange={handleChangeClassroom}
                slotProps={{
                  input: {
                    readOnly: !editMode,
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 3 }}>
              <TextField
                label="Comision"
                name="commission"
                fullWidth
                autoComplete="off"
                value={commission}
                onChange={handleChangeCommission}
                slotProps={{
                  input: {
                    readOnly: !editMode,
                  },
                }}
              />
            </Grid>
          </Grid>
        )}

        {/* fila 5: profesor - horarios */}
        {status != "pending" && (
          <Grid container size={12} sx={{ marginTop: 0.2 }}>
            <Grid size={{ xs: 12, md: 12, lg: 6 }}>
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
                  <Typography>
                    {professors.length <= 1 ? "Profesor" : "Profesores"}
                  </Typography>
                  <Tooltip title="Agregar Profesor">
                    <span
                      style={{
                        visibility: editMode ? "visible" : "hidden",
                      }}
                    >
                      <IconButton onClick={addProfessor}>
                        <AddIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
                <List sx={{ paddingY: 0 }}>
                  {professors.map((professor, index) => (
                    <ListItem
                      key={index}
                      alignItems="flex-start"
                      secondaryAction={
                        <>
                          {editingProffessorIndex === index ? (
                            <Tooltip title="Guardar">
                              <span
                                style={{
                                  visibility: editMode ? "visible" : "hidden",
                                }}
                              >
                                <IconButton
                                  edge="end"
                                  sx={{ marginRight: 1 }}
                                  onClick={() => saveProfessor(index)}
                                >
                                  <DoneIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Editar">
                              <span
                                style={{
                                  visibility: editMode ? "visible" : "hidden",
                                }}
                              >
                                <IconButton
                                  edge="end"
                                  sx={{ marginRight: 1 }}
                                  onClick={() =>
                                    setEditingProffessorIndex(index)
                                  }
                                >
                                  <EditIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                          <Tooltip title="Eliminar">
                            <span
                              style={{
                                visibility: editMode ? "visible" : "hidden",
                              }}
                            >
                              <IconButton
                                edge="end"
                                onClick={() => deleteProfessor(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </>
                      }
                    >
                      <ListItemAvatar>
                        <PersonIcon fontSize="large" />
                      </ListItemAvatar>
                      {editingProffessorIndex === index ? (
                        <Box
                          display="flex"
                          flexDirection="column"
                          gap={1.5}
                          sx={{ width: "80%" }}
                        >
                          <TextField
                            label="Nombre"
                            value={professor.name}
                            onChange={(e) =>
                              updateProfessorField(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            size="small"
                          />
                          <TextField
                            label="Email"
                            value={professor.email}
                            onChange={(e) =>
                              updateProfessorField(
                                index,
                                "email",
                                e.target.value
                              )
                            }
                            size="small"
                          />
                        </Box>
                      ) : (
                        <ListItemText
                          primary={professor.name}
                          secondary={professor.email}
                        />
                      )}
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 12, lg: 6 }}>
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
                  <Typography>
                    {schedules.length <= 1 ? "Horario" : "Horarios"}
                  </Typography>
                  <Tooltip title="Agregar Horario">
                    <span
                      style={{
                        visibility: editMode ? "visible" : "hidden",
                      }}
                    >
                      <IconButton onClick={addSchedule}>
                        <AddIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
                <List sx={{ paddingY: 0 }}>
                  {schedules.map((schedule, index) => (
                    <ListItem
                      key={index}
                      alignItems="flex-start"
                      secondaryAction={
                        <>
                          {editingScheduleIndex === index ? (
                            <Tooltip title="Guardar">
                              <span
                                style={{
                                  visibility: editMode ? "visible" : "hidden",
                                }}
                              >
                                <IconButton
                                  edge="end"
                                  sx={{ marginRight: 1 }}
                                  onClick={() => saveSchedule(index)}
                                >
                                  <DoneIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Editar">
                              <span
                                style={{
                                  visibility: editMode ? "visible" : "hidden",
                                }}
                              >
                                <IconButton
                                  edge="end"
                                  sx={{ marginRight: 1 }}
                                  onClick={() => setEditingScheduleIndex(index)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                          <Tooltip title="Eliminar">
                            <span
                              style={{
                                visibility: editMode ? "visible" : "hidden",
                              }}
                            >
                              <IconButton
                                edge="end"
                                onClick={() => deleteSchedule(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </>
                      }
                    >
                      <ListItemAvatar>
                        {schedule.modality === "virtual" ? (
                          <Tooltip title="Virtual">
                            <HeadsetIcon fontSize="large" />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Presencial">
                            <GroupsIcon fontSize="large" />
                          </Tooltip>
                        )}
                      </ListItemAvatar>
                      {editingScheduleIndex === index ? (
                        <Box
                          display="flex"
                          flexDirection="column"
                          gap={1.5}
                          sx={{ width: "80%" }}
                        >
                          <Grid container size={12} spacing={1.5}>
                            <Grid container size={12} spacing={1.5}>
                              <Grid size={{ sm: 12, md: 6 }}>
                                <TextField
                                  label="Hora Inicio"
                                  value={schedule.startTime}
                                  onChange={(e) =>
                                    updateScheduleField(
                                      index,
                                      "startTime",
                                      e.target.value
                                    )
                                  }
                                  size="small"
                                  fullWidth
                                />
                              </Grid>
                              <Grid size={{ sm: 12, md: 6 }}>
                                <TextField
                                  label="Hora Fin"
                                  value={schedule.endTime}
                                  onChange={(e) =>
                                    updateScheduleField(
                                      index,
                                      "endTime",
                                      e.target.value
                                    )
                                  }
                                  size="small"
                                  fullWidth
                                />
                              </Grid>
                            </Grid>

                            <Grid container size={12} spacing={1.5}>
                              <Grid size={{ sm: 12, md: 6 }}>
                                <Autocomplete
                                  options={days}
                                  getOptionLabel={(option) => option.spanish} // mostrar en español
                                  value={
                                    days.find(
                                      (day) => day.english === schedule.day
                                    ) || null
                                  }
                                  onChange={(event, newValue) => {
                                    updateScheduleField(
                                      index,
                                      "day",
                                      newValue?.english || ""
                                    ); // guardar en ingles
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Día"
                                      size="small"
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid size={{ sm: 12, md: 6 }}>
                                <ToggleButtonGroup
                                  value={schedule.modality}
                                  exclusive
                                  onChange={(event, newValue) =>
                                    updateScheduleField(
                                      index,
                                      "modality",
                                      newValue
                                    )
                                  }
                                  size="small"
                                  fullWidth
                                >
                                  <ToggleButton value="presential">
                                    Presencial
                                  </ToggleButton>
                                  <ToggleButton value="virtual">
                                    Virtual
                                  </ToggleButton>
                                </ToggleButtonGroup>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Box>
                      ) : (
                        <ListItemText
                          primary={
                            days.find((day) => day.english === schedule.day)
                              ?.spanish || schedule.day
                          }
                          secondary={`${schedule.startTime} - ${schedule.endTime}`}
                        />
                      )}
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
          </Grid>
        )}

        {/* fila 6: observaciones */}
        {status != "pending" && (
          <TextField
            label="Observaciones"
            name="observations"
            fullWidth
            autoComplete="off"
            value={observations}
            onChange={handleChangeObservations}
            slotProps={{
              input: {
                readOnly: !editMode,
              },
            }}
          />
        )}
      </Grid>
    </div>
  );
}

export default CoursePage;
