import { useAuth } from "../context/AuthContext";
import LoadingX from "../components/LoadingX";
import { PieChart } from "@mui/x-charts/PieChart";
import Grid from "@mui/material/Grid2";
import { Box, LinearProgress, Stack, Tooltip, Typography } from "@mui/material";
import HubIcon from "@mui/icons-material/Hub";

const HomePage = () => {
  const { user, courses, plans, loading } = useAuth(); // extraer usuario del contexto

  // cuentas para los graficos
  // total
  const approvedCount = courses.filter(
    (course) => course.status === "approved"
  ).length;
  const totalCourses = courses.length;
  const pendingCount = totalCourses - approvedCount;

  // 1 año
  const approvedPercentage1 =
    (courses.filter((course) => course.year == 1 && course.status == "approved")
      .length /
      courses.filter((course) => course.year == 1).length) *
      100 || 0;

  // 2 año
  const approvedPercentage2 =
    (courses.filter((course) => course.year == 2 && course.status == "approved")
      .length /
      courses.filter((course) => course.year == 2).length) *
      100 || 0;

  // 3 año
  const approvedPercentage3 =
    (courses.filter((course) => course.year == 3 && course.status == "approved")
      .length /
      courses.filter((course) => course.year == 3).length) *
      100 || 0;

  // 4 año
  const approvedPercentage4 =
    (courses.filter((course) => course.year == 4 && course.status == "approved")
      .length /
      courses.filter((course) => course.year == 4).length) *
      100 || 0;

  // 5 año
  const approvedPercentage5 =
    (courses.filter((course) => course.year == 5 && course.status == "approved")
      .length /
      courses.filter((course) => course.year == 5).length) *
      100 || 0;

  // titulo intermedio
  const approvedPercentage123 =
    (courses.filter(
      (course) => [1, 2, 3].includes(course.year) && course.status == "approved"
    ).length /
      courses.filter((course) => [1, 2, 3].includes(course.year)).length) *
      100 || 0;

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
                  {approvedCount} / {pendingCount}
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
                            course.year == 1 && course.status == "approved"
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
                            course.year == 3 && course.status == "approved"
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
                            course.year == 4 && course.status == "approved"
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
                            course.year == 5 && course.status == "approved"
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
                          course.status == "approved"
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
