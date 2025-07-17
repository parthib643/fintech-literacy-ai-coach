import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  School as SchoolIcon
} from '@mui/icons-material';

const Progress = () => {
  const { user } = useAuth();
  
  const [progress, setProgress] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    totalModules: 0,
    overallProgress: 0
  });

  useEffect(() => {
    const fetchProgressAndModules = async () => {
      if (!user || !user._id) return;
      
      try {
        setLoading(true);
        
        // Fetch all modules
        const modulesResponse = await api.get('/modules');
        setModules(modulesResponse.data);
        
        // Fetch user progress
        const progressResponse = await api.get(`/progress/${user._id}`);
        setProgress(progressResponse.data);
        
        // Calculate statistics
        const totalModules = modulesResponse.data.length;
        const completedModules = progressResponse.data.filter(p => p.status === 'completed').length;
        const inProgressModules = progressResponse.data.filter(p => p.status === 'in progress').length;
        
        setStats({
          completed: completedModules,
          inProgress: inProgressModules,
          notStarted: totalModules - completedModules - inProgressModules,
          totalModules,
          overallProgress: Math.round((completedModules / totalModules) * 100)
        });
      } catch (err) {
        console.error('Error fetching progress data:', err);
        setError('Failed to load progress data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProgressAndModules();
  }, [user]);

  const getModuleStatus = (moduleId) => {
    const moduleProgress = progress.find(p => p.module._id === moduleId);
    return moduleProgress ? moduleProgress.status : 'not started';
  };

  const getProgressPercentage = (moduleId) => {
    const moduleProgress = progress.find(p => p.module._id === moduleId);
    
    if (!moduleProgress) return 0;
    
    if (moduleProgress.status === 'completed') return 100;
    
    if (moduleProgress.status === 'in progress' && moduleProgress.currentSection) {
      // Find the module to get total sections
      const module = modules.find(m => m._id === moduleId);
      if (module && module.totalSections) {
        return Math.round((moduleProgress.currentSection / module.totalSections) * 100);
      }
      
      // If totalSections is not available, use a default value
      return Math.round((moduleProgress.currentSection / 5) * 100);
    }
    
    return 0;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper
      sx={{
        p: 3,
        background: "rgba(30, 30, 60, 0.85)",
        borderRadius: 3,
        color: "#fff",
        boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.15)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TrendingUpIcon sx={{ color: '#6c63ff', mr: 1, fontSize: 32 }} />
        <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700 }}>
          Your Learning Progress
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3, background: "#393e6e" }} />
      
      {/* Progress Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative', display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
            <CircularProgress 
              variant="determinate" 
              value={stats.overallProgress} 
              size={180} 
              thickness={5} 
              sx={{ color: stats.overallProgress === 100 ? '#10A37F' : '#6c63ff', background: 'transparent' }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}
            >
              <Typography variant="h4" component="div" sx={{ color: "#fff", fontWeight: 700 }}>
                {stats.overallProgress}%
              </Typography>
              <Typography variant="body2" sx={{ color: "#bbb" }}>
                Overall Progress
              </Typography>
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              background: "rgba(44, 44, 84, 0.95)",
              borderRadius: 3,
              color: "#fff",
              boxShadow: '0 4px 24px 0 rgba(108,99,255,0.10)',
              border: '1.5px solid #393e6e'
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "#fff", fontWeight: 700 }}>Progress Summary</Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: "#bbb" }}>Completed</Typography>
                  <Typography variant="body2" sx={{ color: "#bbb" }}>{stats.completed} of {stats.totalModules}</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.completed / stats.totalModules) * 100} 
                  sx={{ height: 8, borderRadius: 5, bgcolor: '#10A37F33', '& .MuiLinearProgress-bar': { bgcolor: '#10A37F' } }}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: "#bbb" }}>In Progress</Typography>
                  <Typography variant="body2" sx={{ color: "#bbb" }}>{stats.inProgress} of {stats.totalModules}</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.inProgress / stats.totalModules) * 100} 
                  sx={{ height: 8, borderRadius: 5, bgcolor: '#6c63ff33', '& .MuiLinearProgress-bar': { bgcolor: '#6c63ff' } }}
                />
              </Box>
              
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: "#bbb" }}>Not Started</Typography>
                  <Typography variant="body2" sx={{ color: "#bbb" }}>{stats.notStarted} of {stats.totalModules}</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.notStarted / stats.totalModules) * 100} 
                  sx={{ height: 8, borderRadius: 5, bgcolor: '#393e6e', '& .MuiLinearProgress-bar': { bgcolor: '#bbb' } }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Learning Path Timeline */}
      <Typography variant="h6" gutterBottom sx={{ color: "#fff", fontWeight: 700 }}>Your Learning Path</Typography>
      
      {modules.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <SchoolIcon sx={{ fontSize: 60, color: '#393e6e', mb: 2 }} />
          <Typography variant="body1" sx={{ color: "#bbb" }}>
            No modules available yet.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={2} sx={{ p: 0 }}>
          {modules.map((module, index) => {
            const status = getModuleStatus(module._id);
            const progressPercentage = getProgressPercentage(module._id);

            return (
              <Box key={module._id} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2 }}>
                  <Box 
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      bgcolor: status === 'completed' ? '#10A37F' : status === 'in progress' ? '#6c63ff' : '#393e6e',
                      color: 'white'
                    }}
                  >
                    {status === 'completed' ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                  </Box>
                  {index < modules.length - 1 && (
                    <Divider orientation="vertical" flexItem sx={{ height: 50, my: 1, background: "#393e6e" }} />
                  )}
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Card
                    variant="outlined"
                    sx={{
                      mb: 2,
                      background: "rgba(44, 44, 84, 0.95)",
                      borderRadius: 3,
                      color: "#fff",
                      boxShadow: '0 4px 24px 0 rgba(108,99,255,0.10)',
                      border: '1.5px solid #393e6e'
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>{module.title}</Typography>
                      <Typography variant="body2" sx={{ color: "#bbb", mb: 1 }}>
                        {module.description}
                      </Typography>
                      
                      {status === 'in progress' && (
                        <Box sx={{ mt: 2 }}>
                          <>
                            <LinearProgress
                              variant="determinate"
                              value={progressPercentage}
                              sx={{
                                height: 8,
                                borderRadius: 5,
                                bgcolor: '#6c63ff33',
                                '& .MuiLinearProgress-bar': { bgcolor: '#6c63ff' }
                              }}
                            />
                            <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: "#bbb" }}>
                              {progressPercentage}% complete
                            </Typography>
                          </>
                        </Box>
                      )}

                      {status === 'completed' && (
                        <Typography variant="body2" sx={{ mt: 1, display: 'flex', alignItems: 'center', color: "#10A37F" }}>
                          <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} /> Completed
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
};

export default Progress;