import { useAuth } from "../context/AuthContext";
import LoadingX from "../components/LoadingX";
import { PieChart } from "@mui/x-charts/PieChart";
import Grid from "@mui/material/Grid2";
import { Box, LinearProgress, Stack, Tooltip, Typography } from "@mui/material";
import HubIcon from "@mui/icons-material/Hub";

const HomePage = () => {
  // extraer datos del contexto
  const { user, courses, periods, loading, optionalSlots } = useAuth();

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

  // cuentas para los graficos
  // total de materias (obligatorias + extracurriculares + optionalSlots)
  const totalCourses =
    courses.filter(
      (course) => course.type === "mandatory" || course.type === "extraescolar"
    ).length + optionalSlots.length;
  // total aprobadas (obligatorias + extracurriculares)
  const mandatoryApprovedCount = courses.filter(
    (course) =>
      (getStatus(course._id) === "approved" ||
        getStatus(course._id) === "promoted") &&
      course.type !== "optional"
  ).length;
  // total aprobadas (opcionales)
  const optionalApprovedCount = Math.min(
    optionalSlots.length,
    courses.filter(
      (course) =>
        (getStatus(course._id) === "approved" ||
          getStatus(course._id) === "promoted") &&
        course.type === "optional"
    ).length
  );
  const approvedCount = mandatoryApprovedCount + optionalApprovedCount;
  const pendingCount = totalCourses - approvedCount;

  // porcentaje y texto de los linearprogress
  const getApprovalDetails = () => {
    // lista de opcionales aprobadas
    const approvedOptionalCourses = courses.filter(
      (course) =>
        course.type === "optional" &&
        (getStatus(course._id) === "approved" ||
          getStatus(course._id) === "promoted")
    );

    let result = {};

    // para titulo intermedio
    let approvedCount123 = 0;
    let totalCourses123 = 0;

    // para titulo final
    let approvedCountFinal = 0;
    let totalCoursesFinal = 0;

    // recorremos los 5 años
    for (let year = 1; year <= 5; year++) {
      // total de materias y slots por año
      const totalCourses = [
        ...courses.filter((course) => course.year === year),
        ...optionalSlots.filter((slot) => slot.year === year),
      ].length;

      // materias aprobadas en el año
      let mandatoryApprovedCoursesCount = courses.filter(
        (course) =>
          course.year === year &&
          (getStatus(course._id) === "approved" ||
            getStatus(course._id) === "promoted")
      ).length;

      // slots en el año
      let slotsCount = optionalSlots.filter(
        (slot) => slot.year === year
      ).length;

      // aprobadas totales
      let approvedCount = mandatoryApprovedCoursesCount;

      for (
        let i = 0;
        i < slotsCount && approvedOptionalCourses.length > 0;
        i++
      ) {
        // si hay opcionales aprobadas:
        if (approvedOptionalCourses.length > 0) {
          approvedOptionalCourses.shift(); // eliminamos una
          approvedCount++; // incrementamos la cuenta total
        }
      }

      // si el año es 1, 2 o 3, sumar para titulo intermedio
      if (year <= 3) {
        totalCourses123 += totalCourses;
        approvedCount123 += approvedCount;
      }

      // sumar en los 5 años, para el titulo final
      totalCoursesFinal += totalCourses;
      approvedCountFinal += approvedCount;

      // resultados
      result[year] = {
        text: `${approvedCount}/${totalCourses} Aprobadas`,
        percentage: Math.round((approvedCount / totalCourses) * 100),
      };
    }

    // porcentaje del titulo intermedio
    const percentage123 = Math.round(
      (approvedCount123 / totalCourses123) * 100
    );
    // agregar el resultado del titulo intermedio
    result[123] = {
      text: `${approvedCount123}/${totalCourses123} Aprobadas`,
      percentage: percentage123,
    };

    // porcentaje del titulo final
    const percentageFinal = Math.round(
      (approvedCountFinal / totalCoursesFinal) * 100
    );
    // agregar el resultado para los 5 años
    result[12345] = {
      text: `${approvedCountFinal}/${totalCoursesFinal} Aprobadas`,
      percentage: percentageFinal,
    };

    return result;
  };
  const approvalData = getApprovalDetails();

  return (
    <>
      {loading ? (
        <LoadingX />
      ) : (
        <div>
          <h1 style={{ marginBottom: 40 }}>Ingenieria en Informatica</h1>
          {/* piechart */}
          <Grid container spacing={2} marginX={10} marginBottom={10}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h4" sx={{ textAlign: "center", mb: 2.5 }}>
                  Progreso Total
                </Typography>
                <PieChart
                  series={[
                    {
                      data: [
                        {
                          id: 0,
                          value: approvedCount,
                          label: "Aprobadas",
                        },
                        {
                          id: 1,
                          value: totalCourses - approvedCount,
                          label: "Pendientes",
                        },
                      ],
                      innerRadius: 50,
                      outerRadius: 200,
                      paddingAngle: 3,
                      cornerRadius: 7,
                    },
                  ]}
                  width={500}
                  height={380}
                  slotProps={{
                    legend: { hidden: true },
                  }}
                  sx={{ paddingLeft: 10 }}
                />
                <Typography variant="h3" sx={{ textAlign: "center", mt: 4 }}>
                  {approvalData[12345]?.percentage}%
                </Typography>
              </Box>
            </Grid>

            {/* porcentaje por año */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <Typography variant="h4" sx={{ textAlign: "center", mb: 4 }}>
                Progreso por Año
              </Typography>

              <Stack sx={{ width: "100%" }} spacing={4}>
                {[1, 2, 3, 4, 5].map((year) => (
                  <Box
                    sx={{ display: "flex", alignItems: "center" }}
                    key={year}
                  >
                    <Typography
                      sx={{ width: 20, textAlign: "center", marginRight: 1 }}
                      variant="h6"
                    >
                      {year}º
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                      <Tooltip title={approvalData[year]?.text || "No data"}>
                        <LinearProgress
                          variant="determinate"
                          value={approvalData[year]?.percentage || 0}
                          sx={{ height: 20, borderRadius: 5 }}
                        />
                      </Tooltip>
                    </Box>
                    <Typography
                      sx={{ width: 50, textAlign: "center", marginLeft: 1 }}
                      variant="h6"
                    >
                      {approvalData[year]?.percentage || 0}%
                    </Typography>
                  </Box>
                ))}
              </Stack>

              {/* titulo intermedio */}
              <Typography
                variant="h4"
                sx={{ textAlign: "center", mb: 4, mt: 8 }}
              >
                Analista Programador
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <HubIcon fontSize={"medium"} sx={{ marginRight: 1 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Tooltip title={approvalData[123]?.text}>
                    <LinearProgress
                      variant="determinate"
                      value={approvalData[123]?.percentage}
                      color="secondary"
                      sx={{ height: 20, borderRadius: 5 }}
                    />
                  </Tooltip>
                </Box>
                <Typography
                  sx={{ width: 50, textAlign: "center", marginLeft: 1 }}
                  variant="h6"
                >
                  {approvalData[123]?.percentage}%
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </div>
      )}
    </>
  );
};

export default HomePage;
