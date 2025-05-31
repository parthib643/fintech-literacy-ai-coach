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
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TrendingUpIcon sx={{ color: 'primary.main', mr: 1 }} />
        <Typography variant="h5">Your Learning Progress</Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* Progress Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative', display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
            <CircularProgress 
              variant="determinate" 
              value={stats.overallProgress} 
              size={180} 
              thickness={5} 
              sx={{ color: stats.overallProgress === 100 ? 'success.main' : 'primary.main' }}
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
              <Typography variant="h4" component="div" color="text.primary">
                {stats.overallProgress}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overall Progress
              </Typography>
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Progress Summary</Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Completed</Typography>
                  <Typography variant="body2">{stats.completed} of {stats.totalModules}</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.completed / stats.totalModules) * 100} 
                  sx={{ height: 8, borderRadius: 5, bgcolor: 'success.light', '& .MuiLinearProgress-bar': { bgcolor: 'success.main' } }}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">In Progress</Typography>
                  <Typography variant="body2">{stats.inProgress} of {stats.totalModules}</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.inProgress / stats.totalModules) * 100} 
                  sx={{ height: 8, borderRadius: 5, bgcolor: 'primary.light', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }}
                />
              </Box>
              
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Not Started</Typography>
                  <Typography variant="body2">{stats.notStarted} of {stats.totalModules}</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.notStarted / stats.totalModules) * 100} 
                  sx={{ height: 8, borderRadius: 5, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: 'grey.500' } }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Learning Path Timeline */}
      <Typography variant="h6" gutterBottom>Your Learning Path</Typography>
      
      {modules.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
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
                      bgcolor: status === 'completed' ? 'success.main' : status === 'in progress' ? 'primary.main' : 'grey.400',
                      color: 'white'
                    }}
                  >
                    {status === 'completed' ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                  </Box>
                  {index < modules.length - 1 && (
                    <Divider orientation="vertical" flexItem sx={{ height: 50, my: 1 }} />
                  )}
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{module.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {module.description}
                      </Typography>
                      
                      {status === 'in progress' && (
                        <Box sx={{ mt: 2 }}>
                          <LinearProgress variant="determinate" value={progressPercentage} />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            {progressPercentage}% complete
                          </Typography>
                        </Box>
                      )}
                      
                      {status === 'completed' && (
                        <Typography variant="body2" color="success.main" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
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