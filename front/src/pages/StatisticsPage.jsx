import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import {
  Box,
  Card,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import HubIcon from "@mui/icons-material/Hub";
import SchoolIcon from "@mui/icons-material/SchoolRounded";
import WhatshotIcon from "@mui/icons-material/WhatshotRounded";
import { useAuth } from "../context/AuthContext";
import { LineChart } from "@mui/x-charts/LineChart";

function StatisticsPage() {
  // extraer datos del contexto
  const { user, courses, periods, optionalSlots, loading } = useAuth();

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

  // promedio por año
  const getAveragePerYear = (periods) => {
    const yearData = {};

    periods.forEach(({ year, courses }) => {
      const validGrades = courses
        .map((c) => c.grade)
        .filter((grade) => grade !== null && grade !== undefined);

      if (validGrades.length > 0) {
        const avg =
          validGrades.reduce((sum, g) => sum + g, 0) / validGrades.length;
        yearData[year] = avg;
      }
    });

    return yearData;
  };
  const averages = getAveragePerYear(periods);
  const years = Object.keys(averages);
  const avgValues = Object.values(averages);

  // status de las materias
  const getCourseCounts = (periods) => {
    const counts = { approved: 0, promoted: 0, disapproved: 0 };

    periods.forEach(({ courses }) => {
      courses.forEach(({ courseId }) => {
        const status = getStatus(courseId);
        if (counts[status] !== undefined) {
          counts[status]++;
        }
      });
    });

    console.log(counts);
    return counts;
  };
  const courseCounts = getCourseCounts(periods);

  // promedio total
  const getTotalAverage = (periods) => {
    let totalGrades = [];
    periods.forEach(({ courses }) => {
      const validGrades = courses
        .map((c) => c.grade)
        .filter(
          (grade) =>
            grade !== null && grade !== undefined && grade >= 1 && grade <= 10
        );

      totalGrades = totalGrades.concat(validGrades);
    });
    if (totalGrades.length > 0) {
      const totalAvg =
        totalGrades.reduce((sum, grade) => sum + grade, 0) / totalGrades.length;

      return totalAvg.toFixed(2);
    }
    return 0;
  };
  const totalAverage = getTotalAverage(periods);

  // linearprogress de titulos
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
    }

    // porcentaje del titulo intermedio
    const percentage123 = Math.round(
      (approvedCount123 / totalCourses123) * 100
    );
    // agregar el resultado para los 3 primeros años
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

  // courses aprobadas/cursadas por period
  const getCoursesStatsPerPeriod = (periods) => {
    let index = 0;
    return periods.map((period) => {
      const totalCourses = period.courses.length;
      const approvedCourses = period.courses.filter(
        (course) => course.status === "promoted" || course.status === "approved"
      ).length;

      const result = {
        label: `${period.year} (${period.semester === 1 ? "1c" : "2c"})`, // Generar la etiqueta dentro de la función
        totalCourses,
        approvedCourses,
        index, // Índice único para cada semestre
      };

      index += 1; // Incrementar índice para el siguiente semestre

      return result;
    });
  };
  const coursesStats = getCoursesStatsPerPeriod(periods);

  return (
    <div>
      <h1>Estadisticas</h1>
      <Grid container spacing={2} marginBottom={10}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ borderRadius: 2 }}>
            <Typography variant="h5" marginLeft={3} marginTop={2}>
              Promedio por año
            </Typography>
            <BarChart
              xAxis={[{ scaleType: "band", data: years }]}
              series={[{ data: avgValues, label: "Promedio" }]}
              borderRadius={7}
              height={300}
              slotProps={{
                legend: { hidden: true },
              }}
            />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ borderRadius: 2 }}>
            <Typography variant="h5" marginLeft={3} marginTop={2}>
              Materias cursadas
            </Typography>
            <PieChart
              series={[
                {
                  data: [
                    {
                      id: 0,
                      value: courseCounts.promoted,
                      label: "Promocionadas",
                    },
                    { id: 1, value: courseCounts.approved, label: "Aprobadas" },
                    {
                      id: 2,
                      value: courseCounts.disapproved,
                      label: "Desaprobadas",
                    },
                  ],
                  innerRadius: 20,
                  outerRadius: 130,
                  paddingAngle: 3,
                  cornerRadius: 7,
                  highlightScope: { fade: "global", highlight: "item" },
                  faded: {
                    innerRadius: 10,
                    additionalRadius: -10,
                    color: "gray",
                  },
                },
              ]}
              height={300}
              slotProps={{
                legend: {
                  direction: "column",
                  position: {
                    horizontal: "right",
                    vertical: "top",
                  },
                  itemGap: 5,
                },
              }}
            />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ borderRadius: 2, height: "100%" }}>
            <Stack margin={3}>
              {/* promedio total */}
              <Typography variant="h5" sx={{ mb: 1 }}>
                Promedio Total
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <WhatshotIcon fontSize={"medium"} sx={{ marginRight: 1 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Tooltip title={`Promedio total: ${totalAverage}`}>
                    <LinearProgress
                      variant="determinate"
                      value={totalAverage * 10}
                      color="success"
                      sx={{ height: 20, borderRadius: 5 }}
                    />
                  </Tooltip>
                </Box>
                <Typography
                  sx={{ width: 50, textAlign: "center", marginLeft: 1 }}
                  variant="h6"
                >
                  {totalAverage}
                </Typography>
              </Box>

              {/* ingeniero informatico */}
              <Typography variant="h5" sx={{ mb: 1, mt: 4 }}>
                Ingeniero Informatico
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <SchoolIcon fontSize={"medium"} sx={{ marginRight: 1 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Tooltip title={approvalData[12345]?.text}>
                    <LinearProgress
                      variant="determinate"
                      value={approvalData[12345]?.percentage}
                      sx={{ height: 20, borderRadius: 5 }}
                    />
                  </Tooltip>
                </Box>
                <Typography
                  sx={{ width: 50, textAlign: "center", marginLeft: 1 }}
                  variant="h6"
                >
                  {approvalData[12345]?.percentage}%
                </Typography>
              </Box>

              {/* analsita programador */}
              <Typography variant="h5" sx={{ mb: 1, mt: 4 }}>
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
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ borderRadius: 2 }}>
            <Typography variant="h5" marginLeft={3} marginTop={2}>
              Materias cursadas por cuatrimestre
            </Typography>
            <LineChart
              sx={{ marginBottom: 0 }}
              xAxis={[
                {
                  data: coursesStats.map((stat) => stat.label),
                  scaleType: "point",
                },
              ]}
              series={[
                {
                  data: coursesStats.map((stat) => stat.approvedCourses),
                  label: "Aprobadas",
                },
                {
                  data: coursesStats.map((stat) => stat.totalCourses),
                  label: "Cursadas",
                },
              ]}
              height={300}
              slotProps={{
                legend: {
                  direction: "column",
                  position: { vertical: "top", horizontal: "right" },
                  itemGap: 5,
                },
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default StatisticsPage;
