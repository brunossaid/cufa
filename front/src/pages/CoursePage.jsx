import * as React from "react";
import { useLocation, useParams } from "react-router-dom";
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
  Paper,
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
import EditIcon from "@mui/icons-material/EditRounded";
import AddIcon from "@mui/icons-material/AddRounded";
import DoneIcon from "@mui/icons-material/DoneRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import PersonIcon from "@mui/icons-material/PersonRounded";
import GroupsIcon from "@mui/icons-material/GroupsRounded";
import HeadsetIcon from "@mui/icons-material/HeadsetMicRounded";
import { updateCourseRequest } from "../api/courses";
import { updatePeriodRequest } from "../api/periods";
import LoadingX from "../components/LoadingX";
import { useNavigate } from "react-router-dom";
import ArrowLeftIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowRightIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { ChromePicker } from "react-color";

function CoursePage({ showAlert }) {
  const { courses, periods, loading } = useAuth();
  const { code } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // si existe, obtener periodId
  const { periodId } = location.state || {};

  // definir curso
  const course = courses?.find((course) => course.code === code) || null;

  // useStates course
  const [name, setName] = React.useState("");
  const [workload, setWorkload] = React.useState("");
  const [modality, setModality] = React.useState("");
  const [prerequisites, setPrerequisites] = React.useState([]);
  const [year, setYear] = React.useState(null);
  const [semester, setSemester] = React.useState(null);
  const [type, setType] = React.useState("");
  // useStates period
  const [status, setStatus] = React.useState("");
  const [grade, setGrade] = React.useState("");
  const [finalGrade, setFinalGrade] = React.useState("");
  const [building, setBuilding] = React.useState("");
  const [classroom, setClassroom] = React.useState("");
  const [commission, setCommission] = React.useState("");
  const [observations, setObservations] = React.useState("");
  const [color, setColor] = React.useState("");
  // useStates de profesores - horarios
  const [professors, setProfessors] = React.useState([]);
  const [editingProffessorIndex, setEditingProffessorIndex] =
    React.useState(null);
  const [schedules, setSchedules] = React.useState([]);
  const [editingScheduleIndex, setEditingScheduleIndex] = React.useState(null);

  // useStates de errores
  const [errors, setErrors] = React.useState({});
  // periodos en los q se curso, y su indice
  const [coursePeriods, setCoursePeriods] = React.useState([]);
  const [selectedPeriodIndex, setSelectedPeriodIndex] = React.useState(null);
  // modo edicion de course y period
  const [editCourseMode, setEditCourseMode] = React.useState(false);
  const [editPeriodMode, setEditPeriodMode] = React.useState(false);

  const [selectedPeriod, setSelectedPeriod] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState(false);

  // si el type NO ES mandatory, no se puede modificar el year y semester
  const [isMandatory, setIsMandatory] = React.useState(true);

  // color picker
  const [showPicker, setShowPicker] = React.useState(false);

  // resetear datos de course
  const resetCourseFields = () => {
    setName(course.name);
    setWorkload(course.workload);
    setModality(course.modality);
    setPrerequisites(course.prerequisites);
    setYear(course.year);
    setSemester(course.semester);
    setType(course.type);
    setColor(course.color);
  };

  // resetear datos de period
  const resetPeriodFields = () => {
    if (!selectedCourse) return;
    setStatus(selectedCourse.status || "");
    setGrade(selectedCourse.grade || "");
    setFinalGrade(selectedCourse.finalGrade || "");
    setBuilding(selectedCourse.building || "");
    setClassroom(selectedCourse.classroom || "");
    setCommission(selectedCourse.commission || "");
    setObservations(selectedCourse.observations || "");
    setProfessors(selectedCourse.professors || []);
    setSchedules(selectedCourse.schedules || []);
  };

  // filtrar los periodos en los que se curso la materia
  React.useEffect(() => {
    if (course && periods?.length > 0) {
      const filteredPeriods = periods.filter((period) =>
        period.courses.some((c) => c.courseId === course._id)
      );
      setCoursePeriods(filteredPeriods);

      // asignar el period que se va a mostrar
      if (periodId) {
        // si periodId existe
        const index = filteredPeriods.findIndex(
          (period) => period._id === periodId
        );
        setSelectedPeriodIndex(index !== -1 ? index : null);
      } else {
        // si periodId no existe
        setSelectedPeriodIndex(
          filteredPeriods.length > 0 ? filteredPeriods.length - 1 : null
        );
      }
    }
  }, [course, periods]);

  // cargar los datos iniciales de selectedPeriod y selectedCourse
  React.useEffect(() => {
    if (course && coursePeriods.length > 0 && selectedPeriodIndex !== null) {
      const period = coursePeriods[selectedPeriodIndex];
      if (period) {
        setSelectedPeriod(period);
        setSelectedCourse(
          period.courses.find((c) => c.courseId === course?._id) || {}
        );
      }
    }
  }, [course, coursePeriods, selectedPeriodIndex]);

  // resetear los valores de course y selectedPeriod al cargar la página
  React.useEffect(() => {
    if (course) {
      resetCourseFields();
      resetPeriodFields();
    }
  }, [course, selectedPeriod]);

  // cargar campos al cancelar guardar
  React.useEffect(() => {
    if (!editPeriodMode) {
      resetPeriodFields();
    }
  }, [coursePeriods]);

  // forzamos recarga (para el navigate de Semester)
  React.useEffect(() => {
    if (course && !selectedPeriod) {
      // no hacemos nada
    }
  }, [course, periods, selectedPeriod, coursePeriods]);

  // verificaciones
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

  // togglear editCourseMode
  const toggleCourseMode = () => {
    setEditCourseMode(!editCourseMode);
  };

  // togglear editPeriodMode
  const togglePeriodMode = () => {
    setEditPeriodMode(!editPeriodMode);
  };

  // guardar cambios de course
  const saveCourseChanges = () => {
    const newErrors = {};

    // verificar cada campo, y crear un error si esta vacio
    if (!code) newErrors.code = "El código es obligatorio.";
    if (!name) newErrors.name = "El nombre es obligatorio.";
    if (!workload) newErrors.workload = "La carga horaria es obligatoria.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // establecer errores en "errors"
      showAlert("Falta Completar Datos", "error");
      return; // salir si hay errores
    }

    // guardamos SOLO los datos que se modificaron
    const editedCourse = {};
    if (name !== course.name) editedCourse.name = name;
    if (workload !== course.workload) editedCourse.workload = workload;
    if (status !== course.status) editedCourse.status = status;
    if (prerequisites !== course.prerequisites)
      editedCourse.prerequisites = prerequisites;
    if (year !== course.year) editedCourse.year = year;
    if (semester !== course.semester) editedCourse.semester = semester;
    if (type !== course.type) editedCourse.type = type;
    if (color !== course.color) editedCourse.color = color;
    if (commission !== course.commission) editedCourse.commission = commission;
    if (building !== course.building) editedCourse.building = building;
    if (classroom !== course.classroom) editedCourse.classroom = classroom;
    if (grade !== course.grade) editedCourse.grade = grade;
    if (modality !== course.modality) editedCourse.modality = modality;
    if (observations !== course.observations)
      editedCourse.observations = observations;
    if (professors !== course.professors) editedCourse.professors = professors;
    if (periods !== course.periods) editedCourse.periods = periods;

    // eliminar campos vacios
    const filteredCourse = Object.fromEntries(
      Object.entries(editedCourse).filter(([_, value]) => value !== "")
    );

    setErrors({});
    setEditCourseMode(false);
    try {
      updateCourseRequest(course._id, filteredCourse);
      showAlert("Materia Editada", "info", <DoneIcon />);
      console.log("course editado");
    } catch (error) {
      console.error("error: ", error);
      showAlert("Error", "error");
    }
  };

  // cancelar cambios
  const cancelCourseChanges = () => {
    resetCourseFields(); // resetear datos
    setEditCourseMode(false);
    setShowPicker(false);
  };

  // guardar cambios de period
  const savePeriodChanges = async () => {
    const newErrors = {};

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showAlert("Falta Completar Datos", "error");
      return;
    }

    // guardamos SOLO los datos que se modificaron
    const editedCourse = {};
    if (status !== selectedCourse.status) editedCourse.status = status;
    if (grade !== selectedCourse.grade) editedCourse.grade = grade;
    if (finalGrade !== selectedCourse.finalGrade)
      editedCourse.finalGrade = finalGrade;
    if (observations !== selectedCourse.observations)
      editedCourse.observations = observations;

    if (building !== selectedCourse.building) editedCourse.building = building;
    if (classroom !== selectedCourse.classroom)
      editedCourse.classroom = classroom;
    if (commission !== selectedCourse.commission)
      editedCourse.commission = commission;

    if (professors !== selectedCourse.professors)
      editedCourse.professors = professors;
    if (schedules !== selectedCourse.schedules)
      editedCourse.schedules = schedules;

    // eliminar campos vacíos
    const filteredCourse = Object.fromEntries(
      Object.entries(editedCourse).filter(([_, value]) => value !== "")
    );

    if (Object.keys(filteredCourse).length === 0) {
      showAlert("No hay cambios para guardar", "warning");
      return;
    }

    // buscar el periodo correcto y actualizar solo el curso dentro de el
    const updatedPeriod = {
      ...selectedPeriod,
      courses: selectedPeriod.courses.map((c) =>
        c.courseId === course._id ? { ...c, ...filteredCourse } : c
      ),
    };

    setErrors({});
    setEditPeriodMode(false);
    setEditingProffessorIndex(false);
    setEditingScheduleIndex(false);
    try {
      await updatePeriodRequest(selectedPeriod._id, updatedPeriod);
      console.log("updatedPeriod", updatedPeriod);
      showAlert("Materia Editada", "info", <DoneIcon />);
      console.log("course (period) editado");
    } catch (error) {
      console.error("error: ", error);
      showAlert("Error", "error");
    }
  };

  // cancelar cambios
  const cancelPeriodChanges = () => {
    resetPeriodFields(); // resetear datos
    setEditPeriodMode(false);
  };

  // manejo de cambios del course
  const handleChangeName = (event) => {
    setName(event.target.value);
  };
  const handleChangeWorkload = (event) => {
    setWorkload(event.target.value);
  };
  const handleChangeModality = (event, newValue) => {
    if (newValue !== null) {
      setModality(newValue);
    }
  };
  const handleChangePrerequisites = (event, value) => {
    const updatedPrerequisites = value.map((course) => course._id);
    setPrerequisites(updatedPrerequisites);
  };
  const handleChangeYear = (event, newYear) => {
    if (newYear !== null) {
      setYear(newYear);
    }
  };
  const handleChangeSemester = (event, newSemester) => {
    if (newSemester !== null) {
      setSemester(newSemester);
    }
  };
  const handleChangeType = (event, newType) => {
    if (newType !== null) {
      setType(newType);

      if (newType === "mandatory") {
        setIsMandatory(true);
        year === null && setYear(course.year);
        semester === null && setSemester(course.semester);
      } else {
        setIsMandatory(false);
        setYear(null);
        setSemester(null);
      }
    }
  };

  // manejo de cambios del period
  const handleChangeStatus = (event) => {
    setGrade(null);
    setFinalGrade(null);
    setStatus(event.target.value);
  };
  const handleChangeGrade = (event) => {
    setGrade(event.target.value);
  };
  const handleChangeFinalGrade = (event) => {
    setFinalGrade(event.target.value);
  };
  const handleChangeBuilding = (event) => {
    setBuilding(event.target.value);
  };
  const handleChangeClassroom = (event) => {
    setClassroom(event.target.value);
  };
  const handleChangeCommission = (event) => {
    setCommission(event.target.value);
  };
  const handleChangeObservations = (event) => {
    setObservations(event.target.value);
  };

  // funciones de profesores, horarios y historial(periods)
  // agregar profesor
  const addProfessor = () => {
    const newProfessor = {
      name: "",
      email: "",
    };
    setProfessors([...professors, newProfessor]);
    setEditingProffessorIndex(professors.length); // ponemos profesor nuevo en modo edicion
  };
  // editar profesor
  const updateProfessorField = (index, field, value) => {
    const updatedProfessors = [...professors];
    updatedProfessors[index][field] = value;
    setProfessors(updatedProfessors);
  };
  // guardar  profesor
  const saveProfessor = (index) => {
    setEditingProffessorIndex(null); // salir de modo edicion
  };
  // eliminar profesor
  const deleteProfessor = (index) => {
    const updatedProfessors = professors.filter((_, i) => i !== index);
    setProfessors(updatedProfessors);
  };

  // agregar horario
  const addSchedule = () => {
    const newSchedule = {
      startTime: "",
      endTime: "",
      day: "",
      modality: "presential",
    };
    setSchedules([...schedules, newSchedule]);
    setEditingScheduleIndex(schedules.length); // nuevo horario en modo edicion
  };
  // editar horario
  const updateScheduleField = (index, field, value) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index][field] = value;
    setSchedules(updatedSchedules);
  };
  // guardar horario
  const saveSchedule = (index) => {
    setEditingScheduleIndex(null); // salir de modo edicion
  };
  // eliminar horario
  const deleteSchedule = (index) => {
    const updatedSchedules = schedules.filter((_, i) => i !== index);
    setSchedules(updatedSchedules);
  };

  // obtener grades validas segun el status
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

  // switchear entre periodos
  const handlePreviousPeriod = () => {
    setSelectedPeriodIndex((prev) => Math.max(prev - 1, 0));
    setEditPeriodMode(false);
  };
  const handleNextPeriod = () => {
    setSelectedPeriodIndex((prev) =>
      Math.min(prev + 1, coursePeriods.length - 1)
    );
    setEditPeriodMode(false);
  };

  // dias
  const days = [
    { english: "monday", spanish: "Lunes" },
    { english: "tuesday", spanish: "Martes" },
    { english: "wednesday", spanish: "Miércoles" },
    { english: "thursday", spanish: "Jueves" },
    { english: "friday", spanish: "Viernes" },
    { english: "saturday", spanish: "Sábado" },
  ];
  //años
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2009 },
    (_, index) => 2010 + index
  );
  // horarios
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 22; hour++) {
      times.push(`${hour}:00`);
      if (hour !== 22) times.push(`${hour}:30`);
    }
    return times;
  };
  const timeOptions = generateTimeOptions();

  // color picker
  // cambia el color
  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
  };
  // ver el picker
  const handleClickPaper = () => {
    setShowPicker(!showPicker);
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
          {editCourseMode ? (
            <>
              <Tooltip title={"Guardar"} sx={{ marginRight: 1.5 }}>
                <IconButton onClick={saveCourseChanges}>
                  <DoneIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={"Cancelar"}>
                <IconButton onClick={cancelCourseChanges}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Tooltip title={"Modo Edicion"}>
              <IconButton onClick={toggleCourseMode}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* DATOS MATERIA */}
      <Grid container spacing={2}>
        {/* fila 1: nombre - codigo - tipo */}
        <Grid container size={12} sx={{ marginTop: 0.7 }}>
          <Grid size={{ xs: 12, md: 4, lg: 1.5 }}>
            <TextField
              label="Código"
              name="code"
              fullWidth
              autoComplete="off"
              value={course.code}
              slotProps={{
                input: {
                  disabled: true,
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
                  disabled: !editCourseMode,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 12, lg: 5.5 }}>
            <ToggleButtonGroup
              value={type}
              exclusive
              onChange={handleChangeType}
              fullWidth={true}
              sx={{ height: "100%" }}
            >
              <ToggleButton value="mandatory" disabled={!editCourseMode}>
                Obligatoria
              </ToggleButton>
              <ToggleButton value="optional" disabled={!editCourseMode}>
                Optativa
              </ToggleButton>
              <ToggleButton value="extraescolar" disabled={!editCourseMode}>
                Extracurricular
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
        {/* fila 2: carga horaria - modalidad - correlativas*/}
        <Grid container size={12}>
          <Grid size={{ xs: 12, md: 6, lg: 2 }}>
            <FormControl fullWidth error={!!errors.workload}>
              <InputLabel>Carga Horaria</InputLabel>
              <Select
                value={workload || ""}
                label="Carga Horaria"
                onChange={handleChangeWorkload}
                disabled={!editCourseMode}
                sx={{
                  ".MuiSelect-icon": {
                    display: editCourseMode ? "block" : "none", // ocultar la flecha
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
              <ToggleButton value={"presential"} disabled={!editCourseMode}>
                Presencial
              </ToggleButton>
              <ToggleButton value={"virtual"} disabled={!editCourseMode}>
                Virtual
              </ToggleButton>
              <ToggleButton value={"mixed"} disabled={!editCourseMode}>
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
              disabled={!editCourseMode}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Correlativas"
                  placeholder={prerequisites.length === 0 ? "Materia" : ""}
                  disabled={!editCourseMode}
                />
              )}
              sx={{
                ...(editCourseMode
                  ? {}
                  : {
                      // aplicar solo si editCourseMode = false
                      "& .MuiInputLabel-root": {
                        color: "gray", // color del texto
                        "&.Mui-focused": {
                          color: "gray", // color del texto al clickear
                        },
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "gray", // color del borde normal
                          borderWidth: "1px", // ancho del borde normal
                        },
                        "&:hover fieldset": {
                          borderColor: "gray", // color del borde al hacer hover
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "gray", // color del borde al clickear
                          borderWidth: "1px", // mantener el ancho del borde al clickear
                        },
                      },
                      "& .MuiAutocomplete-popupIndicator": {
                        display: "none", // ocultar flecha
                      },
                    }),
              }}
            />
          </Grid>
        </Grid>
        {/* fila 3: año - cuatrimestre - color */}
        <Grid container size={12}>
          <Grid size={{ xs: 12, sm: 12, md: 8, lg: 6 }}>
            <Typography gutterBottom sx={{ marginBottom: 0 }}>
              Año
            </Typography>
            <ToggleButtonGroup
              value={year}
              exclusive
              onChange={handleChangeYear}
              fullWidth={true}
            >
              <ToggleButton
                value={1}
                disabled={!editCourseMode || !isMandatory}
              >
                1º
              </ToggleButton>
              <ToggleButton
                value={2}
                disabled={!editCourseMode || !isMandatory}
              >
                2º
              </ToggleButton>
              <ToggleButton
                value={3}
                disabled={!editCourseMode || !isMandatory}
              >
                3º
              </ToggleButton>
              <ToggleButton
                value={4}
                disabled={!editCourseMode || !isMandatory}
              >
                4º
              </ToggleButton>
              <ToggleButton
                value={5}
                disabled={!editCourseMode || !isMandatory}
              >
                5º
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 4, lg: 3 }}>
            <Typography gutterBottom sx={{ marginBottom: 0 }}>
              Cuatrimestre
            </Typography>
            <ToggleButtonGroup
              value={semester}
              exclusive
              onChange={handleChangeSemester}
              fullWidth={true}
            >
              <ToggleButton
                value={1}
                disabled={!editCourseMode || !isMandatory}
              >
                <OneIcon />
              </ToggleButton>
              <ToggleButton
                value={2}
                disabled={!editCourseMode || !isMandatory}
              >
                <TwoIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          <Grid size={{ xs: 12, sm: 12, lg: 3 }}>
            <Typography gutterBottom sx={{ marginBottom: 0 }}>
              Color
            </Typography>
            <Paper
              sx={{
                backgroundColor: color,
                height: 48,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
              disabled={!editCourseMode}
              onClick={handleClickPaper}
            >
              <Typography>{color}</Typography>
            </Paper>
            {showPicker && editCourseMode && (
              <div
                style={{
                  position: "absolute",
                  zIndex: 10,
                }}
              >
                <ChromePicker color={color} onChange={handleColorChange} />
              </div>
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* DATOS CURSADA */}
      {selectedPeriod !== false && selectedPeriod !== null && (
        <Grid container spacing={2} marginTop={5}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Box display="flex" alignItems="center">
              <IconButton
                sx={{ marginRight: 1 }}
                onClick={handlePreviousPeriod}
                disabled={selectedPeriodIndex === 0}
              >
                <ArrowLeftIcon />
              </IconButton>
              <h2 style={{ margin: 0 }}>{selectedPeriod?.year || "-"}</h2>
              <h4 style={{ margin: 0, marginLeft: "10px", color: "gray" }}>
                {selectedPeriod?.semester
                  ? `${selectedPeriod.semester}º Cuatrimestre`
                  : "-"}
              </h4>
              <IconButton
                sx={{ marginLeft: 1 }}
                onClick={handleNextPeriod}
                disabled={selectedPeriodIndex === coursePeriods.length - 1}
              >
                <ArrowRightIcon />
              </IconButton>
            </Box>

            <Box display="flex" alignItems="center">
              {editPeriodMode ? (
                <>
                  <Tooltip title="Guardar" sx={{ marginRight: 1.5 }}>
                    <IconButton onClick={savePeriodChanges}>
                      <DoneIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Cancelar">
                    <IconButton onClick={cancelPeriodChanges}>
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <Tooltip title="Modo Edición">
                  <IconButton onClick={togglePeriodMode}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          {/* fila 3: estado - nota - notafinal? - observaciones */}
          <Grid container size={12} sx={{ marginTop: 0.2 }}>
            <Grid size={{ xs: 12, md: 8, lg: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={status || ""}
                  label="Estado"
                  onChange={handleChangeStatus}
                  disabled={!editPeriodMode}
                >
                  <MenuItem value="approved">Aprobada</MenuItem>
                  <MenuItem value="promoted">Promocionada</MenuItem>
                  <MenuItem value="disapproved">Desaprobada</MenuItem>
                  <MenuItem value="in_progress">En Curso</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 4, sm: 6, lg: 1.5 }}>
              <FormControl fullWidth>
                <InputLabel>Nota</InputLabel>
                <Select
                  value={grade || ""}
                  label="Nota"
                  onChange={handleChangeGrade}
                  disabled={
                    !editPeriodMode || !status || status === "in_progress"
                  }
                >
                  {getValidGrades(status).map((grade) => (
                    <MenuItem key={grade} value={grade}>
                      {grade}
                    </MenuItem>
                  ))}
                  <MenuItem value={null}>-</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 1.5 }}>
              <FormControl fullWidth>
                <InputLabel>Nota Final</InputLabel>
                <Select
                  value={finalGrade || ""}
                  label="Nota Final"
                  onChange={handleChangeFinalGrade}
                  disabled={!editPeriodMode || status !== "approved"}
                >
                  {[4, 5, 6, 7, 8, 9, 10].map((grade) => (
                    <MenuItem key={grade} value={grade}>
                      {grade}
                    </MenuItem>
                  ))}
                  <MenuItem value={null}>-</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 8, lg: 6 }}>
              <TextField
                label="Observaciones"
                name="observations"
                fullWidth
                autoComplete="off"
                value={observations || ""}
                onChange={handleChangeObservations}
                slotProps={{
                  input: {
                    disabled: !editPeriodMode,
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* fila 5: edificio - aula - comision */}
          <Grid container size={12}>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 5 }}>
              <TextField
                label="Edificio"
                name="building"
                fullWidth
                autoComplete="off"
                value={building || ""}
                onChange={handleChangeBuilding}
                slotProps={{
                  input: {
                    disabled: !editPeriodMode,
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
              <TextField
                label="Aula"
                name="classroom"
                fullWidth
                autoComplete="off"
                value={classroom || ""}
                onChange={handleChangeClassroom}
                slotProps={{
                  input: {
                    disabled: !editPeriodMode,
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
              <TextField
                label="Comision"
                name="commission"
                fullWidth
                autoComplete="off"
                value={commission || ""}
                onChange={handleChangeCommission}
                slotProps={{
                  input: {
                    disabled: !editPeriodMode,
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* fila 6: profesor - horarios */}
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
                        visibility: editPeriodMode ? "visible" : "hidden",
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
                                  visibility: editPeriodMode
                                    ? "visible"
                                    : "hidden",
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
                                  visibility: editPeriodMode
                                    ? "visible"
                                    : "hidden",
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
                                visibility: editPeriodMode
                                  ? "visible"
                                  : "hidden",
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
                        visibility: editPeriodMode ? "visible" : "hidden",
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
                                  visibility: editPeriodMode
                                    ? "visible"
                                    : "hidden",
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
                                  visibility: editPeriodMode
                                    ? "visible"
                                    : "hidden",
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
                                visibility: editPeriodMode
                                  ? "visible"
                                  : "hidden",
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
                                <Autocomplete
                                  options={timeOptions}
                                  value={schedule.startTime || ""}
                                  onChange={(event, newValue) =>
                                    updateScheduleField(
                                      index,
                                      "startTime",
                                      newValue
                                    )
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Hora Inicio"
                                      size="small"
                                      fullWidth
                                    />
                                  )}
                                />
                              </Grid>

                              <Grid size={{ sm: 12, md: 6 }}>
                                <Autocomplete
                                  options={timeOptions}
                                  value={schedule.endTime || ""}
                                  onChange={(event, newValue) =>
                                    updateScheduleField(
                                      index,
                                      "endTime",
                                      newValue
                                    )
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Hora Fin"
                                      size="small"
                                      fullWidth
                                    />
                                  )}
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
        </Grid>
      )}
    </div>
  );
}

export default CoursePage;
