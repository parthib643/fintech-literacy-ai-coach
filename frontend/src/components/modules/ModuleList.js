import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  LinearProgress,
  CircularProgress,
  Alert
} from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  Lock as LockIcon,
} from "@mui/icons-material";

// Helper function to get color by level
const getLevelColor = (level) => {
  switch (level) {
    case 'Beginner':
      return 'success';
    case 'Intermediate':
      return 'primary';
    case 'Advanced':
      return 'error';
    default:
      return 'default';
  }
};

const cardWidth = 367; // Use a fixed width for all cards

const ModuleList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add these handlers to fix the error
  const handleStartModule = (moduleId) => {
    navigate(`/modules/${moduleId}`);
  };

  const handleContinueModule = (moduleId) => {
    navigate(`/modules/${moduleId}`);
  };

  useEffect(() => {
    const fetchModulesAndProgress = async () => {
      try {
        setLoading(true);

        // Fetch all modules
        const modulesResponse = await api.get("/modules");
        setModules(modulesResponse.data);

        // Fetch user progress if logged in
        if (user && user._id) {
          try {
            const progressResponse = await api.get(`/progress/${user._id}`);

            // Convert progress array to object with moduleId as key for easier lookup
            const progressMap = {};
            progressResponse.data.forEach((item) => {
              progressMap[item.module._id] = item;
            });

            setProgress(progressMap);
          } catch (progressError) {
            console.error("Error fetching progress:", progressError);
            // Continue even if progress fetch fails
          }
        }
      } catch (err) {
        console.error("Error fetching modules:", err);
        setError("Failed to load modules. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchModulesAndProgress();
  }, [user]);

  const getModuleStatus = (moduleId) => {
    if (!user) return "locked";

    const moduleProgress = progress[moduleId];

    if (!moduleProgress) {
      // Check if this is the first module or if previous module is completed
      const moduleIndex = modules.findIndex((m) => m._id === moduleId);

      if (moduleIndex === 0) return "available";

      const prevModuleId = modules[moduleIndex - 1]?._id;
      if (prevModuleId && progress[prevModuleId]?.status === "completed") {
        return "available";
      }

      return "locked";
    }

    return moduleProgress.status;
  };

  const getProgressPercentage = (moduleId) => {
    const moduleProgress = progress[moduleId];

    if (!moduleProgress) return 0;

    if (moduleProgress.status === "completed") return 100;

    if (
      moduleProgress.status === "in progress" &&
      moduleProgress.currentSection
    ) {
      // Find the module to get total sections
      const module = modules.find((m) => m._id === moduleId);
      if (module && module.totalSections) {
        return Math.round(
          (moduleProgress.currentSection / module.totalSections) * 100
        );
      }

      // If totalSections is not available, use a default value
      return Math.round((moduleProgress.currentSection / 5) * 100);
    }

    return 0;
  };

  const handleModuleClick = (moduleId, status) => {
    if (status === "locked") {
      return; // Do nothing for locked modules
    }

    navigate(`/module/${moduleId}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (modules.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <SchoolIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No modules available yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, color: "#fff" }}>
        Learning Modules
      </Typography>
      <Grid container spacing={3}>
        {modules.map((module) => {
          const status = getModuleStatus(module._id);
          const progressPercentage = getProgressPercentage(module._id);
          return (
            <Grid item xs={12} sm={6} md={4} key={module._id}>
              <Card
                sx={{
                  width: cardWidth,
                  minWidth: cardWidth,
                  maxWidth: cardWidth,
                  borderRadius: 3,
                  color: "#fff",
                  boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.15)',
                  background: "rgba(30, 30, 60, 0.85)",
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  position: 'relative',
                  opacity: status === 'locked' ? 0.7 : 1,
                  cursor: status === 'locked' ? 'not-allowed' : 'pointer',
                  transition: 'box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: status !== 'locked' ? '0 12px 24px rgba(108,99,255,0.35)' : undefined,
                  }
                }}
                onClick={() => {
                  if (status === 'locked') return;
                  if (status === 'not started' || status === 'available') handleStartModule(module._id);
                  else handleContinueModule(module._id);
                }}
              >
                {status === "locked" && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      zIndex: 1,
                      borderRadius: 3
                    }}
                  >
                    <LockIcon sx={{ fontSize: 40, color: "text.secondary" }} />
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="div" sx={{ color: "#fff" }}>
                      {module.title}
                    </Typography>
                    <Chip
                      label={module.level}
                      size="small"
                      color={getLevelColor(module.level)}
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2, color: "#bbb" }}>
                    {module.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={status === 'completed' ? <CheckCircleIcon /> : null}
                      label={
                        status === 'completed'
                          ? 'Completed'
                          : status === 'in progress'
                          ? 'In Progress'
                          : status === 'available'
                          ? 'Not Started'
                          : 'Locked'
                      }
                      color={
                        status === 'completed'
                          ? 'success'
                          : status === 'in progress'
                          ? 'primary'
                          : status === 'available'
                          ? 'default'
                          : 'default'
                      }
                      size="small"
                      sx={{
                        background: status === 'available' ? '#181b2a' : undefined,
                        color: status === 'available' ? '#fff' : undefined,
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                  {status === 'in progress' && (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress variant="determinate" value={progressPercentage} sx={{ height: 8, borderRadius: 5 }} />
                      <Typography variant="caption" color="#bbb" sx={{ mt: 0.5, display: 'block' }}>
                        {progressPercentage}% complete
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                {status !== 'locked' && (
                  <CardActions sx={{ justifyContent: 'flex-start', px: 2, pb: 2, pt: 0 }}>
                    <Button
                      size="small"
                      startIcon={
                        status === 'completed' ? <CheckCircleIcon /> : <PlayArrowIcon />
                      }
                      sx={{
                        background: 'linear-gradient(90deg, #f96d00 0%, #6c63ff 100%)',
                        color: "#fff",
                        fontWeight: 700,
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        boxShadow: '0 4px 16px rgba(108,99,255,0.25)',
                        transition: 'transform 0.2s cubic-bezier(.4,2,.6,1), box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-6px) scale(1.04)',
                          boxShadow: '0 12px 24px rgba(108,99,255,0.35)',
                        },
                        width: 'auto',
                        minWidth: '80px',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        marginLeft: 0
                      }}
                    >
                      {status === 'completed'
                        ? 'Review'
                        : status === 'in progress'
                        ? 'Continue'
                        : 'Start'}
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ModuleList;
