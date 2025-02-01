import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableVirtuoso } from "react-virtuoso";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  Slider,
  stepClasses,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/VisibilityRounded";
import EditIcon from "@mui/icons-material/EditRounded";
import AddIcon from "@mui/icons-material/AddRounded";
import DoneIcon from "@mui/icons-material/DoneRounded";
import AlarmIcon from "@mui/icons-material/AlarmRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";
import styled from "styled-components";
import Grid from "@mui/material/Grid2";
import OneIcon from "@mui/icons-material/LooksOneRounded";
import TwoIcon from "@mui/icons-material/LooksTwoRounded";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import PersonIcon from "@mui/icons-material/PersonRounded";
import ClockIcon from "@mui/icons-material/QueryBuilderRounded";
import HeadsetIcon from "@mui/icons-material/HeadsetMicRounded";
import GroupsIcon from "@mui/icons-material/GroupsRounded";
import { useAuth } from "../context/AuthContext";
import {
  createCourseRequest,
  getCoursesRequest,
  updateCourseRequest,
} from "../api/courses";
import { useNavigate } from "react-router-dom";

// datos de las columnas
const columns = [
  { width: "15%", label: "Código", dataKey: "code", align: "center" },
  { width: "35%", label: "Materia", dataKey: "course", align: "left" },
  {
    width: "20%",
    label: "Carga Horaria",
    dataKey: "workload",
    align: "center",
  },
  {
    width: "15%",
    label: "Correlativas",
    dataKey: "prerequisites",
    align: "center",
  },
  {
    width: "15%",
    label: "Accion",
    dataKey: "action",
    align: "center",
  },
];

// componentes personalizados de la tabla virtuoso
const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
    />
  ),
  TableHead: React.forwardRef((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableRow,
  TableBody: React.forwardRef((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

// estilo de la scrollbar
const StyledPaper = styled(Paper)`
  height: 700px;
  width: 100%;
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 9px; /* ancho del scrollbar */
  }

  ::-webkit-scrollbar-thumb {
    background-color: #161618; /* color de la barra */
    border-radius: 10px; /* bordes redondeados */
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #131314; /* color con el mouse arriba */
  }

  ::-webkit-scrollbar-track {
    background-color: #282829; /* color del fondo */
  }
`;

// componente principal
function CoursesPage({ showAlert }) {
  // cambiar entre modo visualizacion/edicion
  const [mode, setMode] = React.useState("view");
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "view" ? "edit" : "view"));
  };

  // cambiar status de las materias
  const toggleStatus = async (code) => {
    try {
      // encontrar la fila que se va a actualizar
      const updatedRow = rows.find((row) => row.code === code);
      if (!updatedRow) {
        return;
      }

      // calcular el nuevo estado
      const newStatus =
        updatedRow.status === "approved" || updatedRow.status === "promoted"
          ? "in_progress"
          : updatedRow.status === "in_progress"
          ? "pending"
          : "approved";

      // actualizar la base de datos
      await updateCourseRequest(updatedRow._id, { status: newStatus });

      // actualizar el estado local
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.code === code ? { ...row, status: newStatus } : row
        )
      );

      console.log(updatedRow.name, "status cambiado a:", newStatus);

      // recargar courses
      fetchCourses();
    } catch (error) {
      console.error("Error al actualizar el status: ", error);
      showAlert("Error", "error");
    }
  };

  // determinar el color de la fila segun el status
  const getRowBackgroundColor = (status) => {
    switch (status) {
      case "approved":
      case "promoted":
        return "#00AFFF"; // celeste
      case "in_progress":
        return "#FF6C24"; // naranja
      case "pending":
      default:
        return "inherit";
    }
  };

  // navigate
  const navigate = useNavigate();
  const handleNavigate = (code) => {
    console.log("Navigating to: ", code);
    navigate(`/courses/${code}`); // navegar a la pagina de la materia con el codigo
  };

  // como se renderizan las filas en la tabla
  const rowContent = (_index, row, mode) => {
    switch (row.type) {
      case "year":
        return (
          <TableCell
            colSpan={columns.length}
            align="center"
            style={{
              backgroundColor: "#1D1D1E",
              fontWeight: "bold",
              color: "white",
            }}
          >
            {row.label}
          </TableCell>
        );
      case "semester":
        return (
          <TableCell
            colSpan={columns.length} // Ocupa todas las columnas.
            align="center"
            style={{
              backgroundColor: "#171717", // Gris para cuatrimestres.
              fontStyle: "italic",
              color: "white",
            }}
          >
            {row.label}
          </TableCell>
        );
      case "title":
        return (
          <TableCell
            colSpan={columns.length} // Ocupa todas las columnas.
            align="center"
            style={{
              backgroundColor: "#e683df", // Rosa para título intermedio.
              fontWeight: "bold",
              color: "white",
            }}
          >
            {row.label}
          </TableCell>
        );
      case "mandatory":
      case "optional":
        // para "mandatory"/"optional" (materias)
        return (
          <>
            <TableCell
              align="center"
              style={{ backgroundColor: getRowBackgroundColor(row.status) }}
            >
              {row.code}
            </TableCell>
            <TableCell
              align="left"
              style={{ backgroundColor: getRowBackgroundColor(row.status) }}
            >
              {row.name}
            </TableCell>
            <TableCell
              align="center"
              style={{ backgroundColor: getRowBackgroundColor(row.status) }}
            >
              {row.workload}
            </TableCell>
            <TableCell
              align="center"
              style={{
                backgroundColor:
                  row.status === "approved"
                    ? getRowBackgroundColor(row.status)
                    : (row.prerequisites || []).length === 0 ||
                      row.prerequisites.every((prerequisiteId) => {
                        const course = courses.find(
                          (course) => course._id === prerequisiteId
                        );
                        return course ? course.status === "approved" : false;
                      })
                    ? "green" // verde si no hay prerequisites o si todas están aprobadas
                    : getRowBackgroundColor(row.status), // color predeterminado
              }}
            >
              {(row.prerequisites || []).length > 0 ? (
                row.prerequisites.map((prerequisiteId, index) => {
                  const course = courses.find(
                    (course) => course._id === prerequisiteId
                  );
                  return course ? (
                    <Tooltip key={index} title={course.name}>
                      <span>
                        {course.code}
                        {index < row.prerequisites.length - 1 && " - "}
                      </span>
                    </Tooltip>
                  ) : null;
                })
              ) : (
                <span> - </span>
              )}
            </TableCell>
            <TableCell
              align="center"
              style={{ backgroundColor: getRowBackgroundColor(row.status) }}
            >
              {mode === "view" ? (
                <Tooltip title={"Ver más"}>
                  <IconButton
                    onClick={() => handleNavigate(row.code)}
                    sx={{ padding: 0 }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip
                  title={
                    row.status === "pending"
                      ? "Pendiente"
                      : row.status === "in_progress"
                      ? "Cursando"
                      : "Aprobada"
                  }
                >
                  <IconButton
                    onClick={() => toggleStatus(row.code)}
                    sx={{ padding: 0 }}
                  >
                    {row.status === "pending" ? (
                      <CloseIcon />
                    ) : row.status === "in_progress" ? (
                      <AlarmIcon />
                    ) : (
                      <DoneIcon />
                    )}
                  </IconButton>
                </Tooltip>
              )}
            </TableCell>
          </>
        );
      default:
        return null;
    }
  };

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
    setEditingProffessorIndex(null);
    setEditingScheduleIndex(null);
  };

  // guardar datos ingresados en variables
  // pagina 1
  const [code, setCode] = React.useState("");
  const handleChangeCode = (event) => {
    setCode(event.target.value);
  };
  const [name, setName] = React.useState("");
  const handleChangeName = (event) => {
    setName(event.target.value);
  };
  const [status, setStatus] = React.useState("pending");
  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
  };
  const [workload, setWorkload] = React.useState("");
  const handleChangeWorkload = (event) => {
    setWorkload(event.target.value);
  };
  const [prerequisites, setPrerequisites] = React.useState([]);
  const handleChangePrerequisites = (event, value) => {
    console.log("value: ", value);

    // guardar solo las IDs de las materias seleccionadas
    const updatedPrerequisites = value.map((course) => course._id);
    setPrerequisites(updatedPrerequisites);
  };
  const [type, setType] = React.useState("mandatory");
  const handleChangeType = (event, newType) => {
    setType(newType);
  };
  const [year, setYear] = React.useState(1);
  const handleChangeYear = (event, newYear) => {
    setYear(newYear);
  };
  const [semester, setSemester] = React.useState(1);
  const handleChangeSemester = (event, newSemester) => {
    setSemester(newSemester);
  };
  // pagina 2
  const [commission, setCommission] = React.useState("");
  const handleChangeCommission = (event) => {
    setCommission(event.target.value);
  };
  const [building, setBuilding] = React.useState("");
  const handleChangeBuilding = (event) => {
    setBuilding(event.target.value);
  };
  const [classroom, setClassroom] = React.useState("");
  const handleChangeClassroom = (event) => {
    setClassroom(event.target.value);
  };
  const [grade, setGrade] = React.useState("");
  const handleChangeGrade = (event) => {
    setGrade(event.target.value);
  };
  const [modality, setModality] = React.useState("presential");
  const handleChangeModality = (event, newValue) => {
    setModality(newValue);
  };
  const [observations, setObservations] = React.useState("");
  const handleChangeObservations = (event, newValue) => {
    setObservations(newValue);
  };

  // crear color aleatorio para la materia
  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
  };

  // guardar datos
  const handleSave = async () => {
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

    // validar si el código ya existe
    const codeExists = courses.some((course) => course.code === code);
    if (codeExists) {
      showAlert("El código ya existe", "error");
      return; // salir
    }

    const newCourse = {
      code,
      name,
      workload,
      status,
      prerequisites,
      year,
      semester,
      type,
      commission,
      building,
      classroom,
      grade,
      modality,
      observations,
      professors,
      schedules,
      user: user.id,
      color: getRandomColor(),
    };

    // eliminar campos vacios
    const filteredCourse = Object.fromEntries(
      Object.entries(newCourse).filter(([_, value]) => value !== "")
    );

    console.log("filteredCourse: ", filteredCourse);

    try {
      await createCourseRequest(filteredCourse);

      // si no hubo errores, continuar con la lógica
      showAlert("Materia Creada", "success", <DoneIcon />);
      resetFields();
      handleCloseDialog();
      setErrors({});
      setPage(1);
      fetchCourses();
    } catch (error) {
      console.error("error: ", error.response?.data?.message || error.message);
      showAlert("Error", "error");
    }
  };

  // resetear datos
  const resetFields = () => {
    setCode("");
    setName("");
    setWorkload("");
    setStatus("pending");
    setPrerequisites([]);
    setYear(1);
    setSemester(1);
    setType("mandatory");
    setCommission("");
    setBuilding("");
    setClassroom("");
    setGrade("");
    setModality("presential");
    setObservations("");
    setProfessors([]);
    setSchedules([]);
  };

  // paginado del dialog
  const [page, setPage] = React.useState(1);
  const handleNext = () => {
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

    // si no hay errores, limpia el estado de errores y avanza
    setErrors({});
    setPage(2);
  };
  const handleBack = () => {
    setPage(1); // retrocede a pagina 1
  };

  // manejo de errores
  const [errors, setErrors] = React.useState({});

  // profesores
  const [professors, setProfessors] = React.useState([
    {
      name: "Martin Palermo",
      email: "mp9@example.com",
      observations: "el titan",
    },
    {
      name: "Juan Roman Riquelme",
      email: "jrr10@example.com",
      observations: "el ultimo 10",
    },
  ]);
  // que profesor estoy editando
  const [editingProffessorIndex, setEditingProffessorIndex] =
    React.useState(null);
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
    setEditingProffessorIndex(null);
  };
  // eliminar profesor
  const deleteProfessor = (index) => {
    const updatedProfessors = professors.filter((_, i) => i !== index);
    setProfessors(updatedProfessors);
  };

  // horarios
  const [schedules, setSchedules] = React.useState([
    {
      startTime: "14:00",
      endTime: "17:00",
      day: "monday",
      modality: "presential",
    },
  ]);
  // que horario estoy editando
  const [editingScheduleIndex, setEditingScheduleIndex] = React.useState(null);
  // agregar horario
  const addSchedule = () => {
    const newSchedule = {
      startTime: "",
      endTime: "",
      day: "",
      modality: "presential",
    };
    setSchedules([...schedules, newSchedule]);
    setEditingScheduleIndex(schedules.length); // nuevo horario en modo edición
  };
  // editar horario
  const updateScheduleField = (index, field, value) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index][field] = value;
    setSchedules(updatedSchedules);
  };
  // guardar horario
  const saveSchedule = (index) => {
    setEditingScheduleIndex(null); // salir de modo edición
  };
  // eliminar horario
  const deleteSchedule = (index) => {
    const updatedSchedules = schedules.filter((_, i) => i !== index);
    setSchedules(updatedSchedules);
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

  // traer materias del contexto
  const { courses, setCourses, user } = useAuth(); // extraer materias del contexto

  // crear las filas (materias y separadores)
  const generateRows = (courses) => {
    const rows = [];
    let filteredCourses = [];

    // PRIMER AÑO
    rows.push(
      { type: "year", label: "Primer Año" },
      { type: "semester", label: "1º Cuatrimestre" }
    );

    filteredCourses = courses.filter(
      (course) => course.year === 1 && course.semester === 1
    ); // 1 año, 1c
    rows.push(...filteredCourses, {
      type: "semester",
      label: "2º Cuatrimestre",
    });

    filteredCourses = courses.filter(
      (course) => course.year === 1 && course.semester === 2
    ); // 1 año, 2c
    rows.push(
      ...filteredCourses,
      { type: "year", label: "Segundo Año" },
      { type: "semester", label: "1º Cuatrimestre" }
    );

    // SEGUNDO AÑO
    filteredCourses = courses.filter(
      (course) => course.year === 2 && course.semester === 1
    ); // 2 año, 1c
    rows.push(...filteredCourses, {
      type: "semester",
      label: "2º Cuatrimestre",
    });

    filteredCourses = courses.filter(
      (course) => course.year === 2 && course.semester === 2
    ); // 2 año, 2c
    rows.push(
      ...filteredCourses,
      { type: "year", label: "Tercer Año" },
      { type: "semester", label: "1º Cuatrimestre" }
    );

    // TERCER AÑO
    filteredCourses = courses.filter(
      (course) => course.year === 3 && course.semester === 1
    ); // 3 año, 1c
    rows.push(...filteredCourses, {
      type: "semester",
      label: "2º Cuatrimestre",
    });

    filteredCourses = courses.filter(
      (course) => course.year === 3 && course.semester === 2
    ); // 3 año, 2c
    rows.push(
      ...filteredCourses,
      { type: "title", label: "Título Intermedio" },
      { type: "year", label: "Cuarto Año" },
      { type: "semester", label: "1º Cuatrimestre" }
    );

    // CUARTO AÑO
    filteredCourses = courses.filter(
      (course) => course.year === 4 && course.semester === 1
    ); // 4 año, 1c
    rows.push(...filteredCourses, {
      type: "semester",
      label: "2º Cuatrimestre",
    });

    filteredCourses = courses.filter(
      (course) => course.year === 4 && course.semester === 2
    ); // 4 año, 2c
    rows.push(
      ...filteredCourses,
      { type: "year", label: "Quinto Año" },
      { type: "semester", label: "1º Cuatrimestre" }
    );

    // QUINTO AÑO
    filteredCourses = courses.filter(
      (course) => course.year === 5 && course.semester === 1
    ); // 5 año, 1c
    rows.push(...filteredCourses, {
      type: "semester",
      label: "2º Cuatrimestre",
    });

    filteredCourses = courses.filter(
      (course) => course.year === 5 && course.semester === 2
    ); // 5 año, 2c
    rows.push(...filteredCourses);

    return rows;
  };
  const rowsFromCourses = generateRows(courses);

  // estado para las filas
  const [rows, setRows] = React.useState(rowsFromCourses);

  // trar courses
  const fetchCourses = async () => {
    try {
      const response = await getCoursesRequest(user.id);
      setCourses(response.data);
    } catch (error) {
      console.error("Error al cargar los courses:", error);
    }
  };

  React.useEffect(() => {
    fetchCourses();
  }, [user]);

  // que se actualicen las filas
  React.useEffect(() => {
    setRows(generateRows(courses));
  }, [courses]);

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginBottom={2.5}
      >
        <h1 style={{ margin: 0 }}>Materias</h1>
        <Box display="flex" alignItems="center">
          {mode !== "view" && (
            <Tooltip title="Agregar Materia">
              <IconButton onClick={handleOpenDialog} sx={{ marginRight: 1.5 }}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={mode === "view" ? "Editar" : "Visualizar"}>
            <IconButton onClick={toggleMode}>
              {mode === "view" ? <EditIcon /> : <VisibilityIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <StyledPaper>
        <TableVirtuoso
          data={rows}
          components={VirtuosoTableComponents}
          fixedHeaderContent={() => (
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.dataKey}
                  variant="head"
                  align={column.align}
                  style={{ width: column.width }}
                  sx={{ backgroundColor: "#282829", color: "white" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          )}
          itemContent={(index, row) => rowContent(index, row, mode)}
        />
      </StyledPaper>
      {/* dialog de agregar materia*/}
      <Dialog
        open={dialogAdd}
        onClose={handleCloseDialog}
        sx={{
          "& .MuiDialog-paper": { width: "50%", maxWidth: "none" },
        }}
      >
        <DialogTitle>Agregar Nueva Materia</DialogTitle>

        <DialogContent sx={{ paddingBottom: 1 }}>
          <Grid container spacing={2}>
            {/* fila 1: código - nombre */}
            <Grid container size={12} sx={{ marginTop: 0.7 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Código"
                  name="code"
                  fullWidth
                  autoComplete="off"
                  value={code}
                  onChange={handleChangeCode}
                  error={!!errors.code}
                  helperText={errors.code}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField
                  label="Nombre"
                  name="name"
                  fullWidth
                  autoComplete="off"
                  value={name}
                  onChange={handleChangeName}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
            </Grid>

            {/* fila 2: carga horaria - estado */}
            <Grid container size={12}>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth error={!!errors.workload}>
                  <InputLabel>Carga Horaria</InputLabel>
                  <Select
                    value={workload}
                    label="Carga Horaria"
                    onChange={handleChangeWorkload}
                  >
                    {Array.from({ length: 16 }, (_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {i + 1}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.workload && (
                    <FormHelperText color={"red"}>
                      {errors.workload}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <ToggleButtonGroup
                  value={modality}
                  exclusive
                  onChange={handleChangeModality}
                  fullWidth={true}
                  sx={{ height: "100%" }}
                >
                  <ToggleButton value={"presential"}>Presencial</ToggleButton>
                  <ToggleButton value={"virtual"}>Virtual</ToggleButton>
                  <ToggleButton value={"mixed"}>Mixta</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Grid>

            {/* fila 3: correlativas */}
            <Grid size={12}>
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
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Correlativas"
                    placeholder="Materia"
                  />
                )}
              />
            </Grid>
            {/* fila 4: año - cuatrimestre - tipo */}
            <Grid container size={12}>
              <Grid size={{ xs: 12, sm: 12, md: 8, lg: 5 }}>
                <Typography gutterBottom>Año</Typography>
                <ToggleButtonGroup
                  value={year}
                  exclusive
                  onChange={handleChangeYear}
                  fullWidth={true}
                >
                  <ToggleButton value={1}>1º</ToggleButton>
                  <ToggleButton value={2}>2º</ToggleButton>
                  <ToggleButton value={3}>3º</ToggleButton>
                  <ToggleButton value={4}>4º</ToggleButton>
                  <ToggleButton value={5}>5º</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2 }}>
                <Typography gutterBottom>Cuatrimestre</Typography>
                <ToggleButtonGroup
                  value={semester}
                  exclusive
                  onChange={handleChangeSemester}
                  fullWidth={true}
                >
                  <ToggleButton value={1}>
                    <OneIcon />
                  </ToggleButton>
                  <ToggleButton value={2}>
                    <TwoIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, lg: 5 }}>
                <Typography gutterBottom>Tipo</Typography>
                <ToggleButtonGroup
                  value={type}
                  exclusive
                  onChange={handleChangeType}
                  fullWidth={true}
                >
                  <ToggleButton value="mandatory">Obligatoria</ToggleButton>
                  <ToggleButton value="optional">Optativa</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            marginX: 2,
            marginY: 1,
          }}
        >
          <Button onClick={handleCloseDialog} variant="contained" color="error">
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleSave} // guarda los cambios
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default CoursesPage;
