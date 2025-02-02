import { useAuth } from "../context/AuthContext";
import LoadingX from "../components/LoadingX";
import { PieChart } from "@mui/x-charts/PieChart";
import Grid from "@mui/material/Grid2";
import { Box, LinearProgress, Stack, Tooltip, Typography } from "@mui/material";
import HubIcon from "@mui/icons-material/Hub";

const HomePage = () => {
  // extraer datos del contexto
  const { user, courses, periods, loading } = useAuth();

  // buscar entre los periods el status
  const getStatus = (courseId) => {
    for (let i = periods.length - 1; i >= 0; i--) {
      const period = periods[i];
      const course = period.courses.find((c) => c.courseId === courseId);

      if (course) {
        if (course.courseId === "679eba2451b17bc19946f800") {
        }
        return course.status;
      }
    }

    return "pending"; // default
  };

  // cuentas para los graficos
  // total
  const approvedCount = courses.filter(
    (course) =>
      getStatus(course._id) === "approved" ||
      getStatus(course._id) === "promoted"
  ).length;
  const totalCourses = courses.length;
  const pendingCount = totalCourses - approvedCount;

  // calcular porcentaje
  const calculateApprovedPercentage = (year) => {
    const total = courses.filter((course) => course.year == year).length;
    if (total === 0) return 0;

    const approved = courses.filter(
      (course) =>
        course.year == year &&
        (getStatus(course._id) === "approved" ||
          getStatus(course._id) === "promoted")
    ).length;

    return Math.round((approved / total) * 100);
  };

  // calcular porcentaje de cada año
  const approvedPercentage1 = calculateApprovedPercentage(1);
  const approvedPercentage2 = calculateApprovedPercentage(2);
  const approvedPercentage3 = calculateApprovedPercentage(3);
  const approvedPercentage4 = calculateApprovedPercentage(4);
  const approvedPercentage5 = calculateApprovedPercentage(5);

  // titulo intermedio
  const approvedPercentage123 =
    Math.round(
      (courses.filter(
        (course) =>
          ([1, 2, 3].includes(course.year) &&
            getStatus(course._id) == "approved") ||
          getStatus(course._id) === "promoted"
      ).length /
        courses.filter((course) => [1, 2, 3].includes(course.year)).length) *
        100
    ) || 0;

  return (
    <>
      {loading ? (
        <LoadingX />
      ) : (
        <div>
          <h1 style={{ marginBottom: 40 }}>Ingenieria en Informatica</h1>
          {/* piechart */}
          <Grid container spacing={2} marginX={10}>
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
                  {approvedCount} / {pendingCount + approvedCount}
                </Typography>
              </Box>
            </Grid>

            {/* porcentaje por año */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <Typography variant="h4" sx={{ textAlign: "center", mb: 4 }}>
                Progreso por Año
              </Typography>
              <Stack sx={{ width: "100%" }} spacing={4}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{ width: 20, textAlign: "center", marginRight: 1 }}
                    variant="h6"
                  >
                    1º
                  </Typography>
                  <Box sx={{ flexGrow: 1 }}>
                    <Tooltip
                      title={`${
                        courses.filter(
                          (course) =>
                            course.year == 1 &&
                            (getStatus(course._id) === "approved" ||
                              getStatus(course._id) === "promoted")
                        ).length
                      }/${
                        courses.filter((course) => course.year == 1).length
                      } Aprobadas`}
                    >
                      <LinearProgress
                        variant="determinate"
                        value={approvedPercentage1}
                        sx={{ height: 20, borderRadius: 5 }}
                      />
                    </Tooltip>
                  </Box>
                  <Typography
                    sx={{ width: 50, textAlign: "center", marginLeft: 1 }}
                    variant="h6"
                  >
                    {approvedPercentage1}%
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{ width: 20, textAlign: "center", marginRight: 1 }}
                    variant="h6"
                  >
                    2º
                  </Typography>
                  <Box sx={{ flexGrow: 1 }}>
                    <Tooltip
                      title={`${
                        courses.filter(
                          (course) =>
                            course.year == 2 && course.status == "approved"
                        ).length
                      }/${
                        courses.filter((course) => course.year == 2).length
                      } Aprobadas`}
                    >
                      <LinearProgress
                        variant="determinate"
                        value={approvedPercentage2}
                        sx={{ height: 20, borderRadius: 5 }}
                      />
                    </Tooltip>
                  </Box>
                  <Typography
                    sx={{ width: 50, textAlign: "center", marginLeft: 1 }}
                    variant="h6"
                  >
                    {approvedPercentage2}%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{ width: 20, textAlign: "center", marginRight: 1 }}
                    variant="h6"
                  >
                    3º
                  </Typography>
                  <Box sx={{ flexGrow: 1 }}>
                    <Tooltip
                      title={`${
                        courses.filter(
                          (course) =>
                            course.year == 3 &&
                            (getStatus(course._id) === "approved" ||
                              getStatus(course._id) === "promoted")
                        ).length
                      }/${
                        courses.filter((course) => course.year == 3).length
                      } Aprobadas`}
                    >
                      <LinearProgress
                        variant="determinate"
                        value={approvedPercentage3}
                        sx={{ height: 20, borderRadius: 5 }}
                      />
                    </Tooltip>
                  </Box>
                  <Typography
                    sx={{ width: 50, textAlign: "center", marginLeft: 1 }}
                    variant="h6"
                  >
                    {approvedPercentage3}%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{ width: 20, textAlign: "center", marginRight: 1 }}
                    variant="h6"
                  >
                    4º
                  </Typography>
                  <Box sx={{ flexGrow: 1 }}>
                    <Tooltip
                      title={`${
                        courses.filter(
                          (course) =>
                            course.year == 4 &&
                            (getStatus(course._id) === "approved" ||
                              getStatus(course._id) === "promoted")
                        ).length
                      }/${
                        courses.filter((course) => course.year == 4).length
                      } Aprobadas`}
                    >
                      <LinearProgress
                        variant="determinate"
                        value={approvedPercentage4}
                        sx={{ height: 20, borderRadius: 5 }}
                      />
                    </Tooltip>
                  </Box>
                  <Typography
                    sx={{ width: 50, textAlign: "center", marginLeft: 1 }}
                    variant="h6"
                  >
                    {approvedPercentage4}%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{ width: 20, textAlign: "center", marginRight: 1 }}
                    variant="h6"
                  >
                    5º
                  </Typography>
                  <Box sx={{ flexGrow: 1 }}>
                    <Tooltip
                      title={`${
                        courses.filter(
                          (course) =>
                            course.year == 5 &&
                            (getStatus(course._id) === "approved" ||
                              getStatus(course._id) === "promoted")
                        ).length
                      }/${
                        courses.filter((course) => course.year == 5).length
                      } Aprobadas`}
                    >
                      <LinearProgress
                        variant="determinate"
                        value={approvedPercentage5}
                        sx={{ height: 20, borderRadius: 5 }}
                      />
                    </Tooltip>
                  </Box>
                  <Typography
                    sx={{ width: 50, textAlign: "center", marginLeft: 1 }}
                    variant="h6"
                  >
                    {approvedPercentage5}%
                  </Typography>
                </Box>
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
                  <Tooltip
                    title={`${
                      courses.filter(
                        (course) =>
                          [1, 2, 3].includes(course.year) &&
                          (getStatus(course._id) === "approved" ||
                            getStatus(course._id) === "promoted")
                      ).length
                    }/${
                      courses.filter((course) =>
                        [1, 2, 3].includes(course.year)
                      ).length
                    } Aprobadas`}
                  >
                    <LinearProgress
                      variant="determinate"
                      value={approvedPercentage123}
                      color="secondary"
                      sx={{ height: 20, borderRadius: 5 }}
                    />
                  </Tooltip>
                </Box>
                <Typography
                  sx={{ width: 50, textAlign: "center", marginLeft: 1 }}
                  variant="h6"
                >
                  {approvedPercentage123}%
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
