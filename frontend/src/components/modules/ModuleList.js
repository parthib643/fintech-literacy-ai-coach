import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
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
  Alert,
  Divider
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Check as CheckIcon,
  School as SchoolIcon,
  Lock as LockIcon
} from '@mui/icons-material';

const ModuleList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchModulesAndProgress = async () => {
      try {
        setLoading(true);
        
        // Fetch all modules
        const modulesResponse = await api.get('/modules');
        setModules(modulesResponse.data);
        
        // Fetch user progress if logged in
        if (user && user._id) {
          try {
            const progressResponse = await api.get(`/progress/${user._id}`);
            
            // Convert progress array to object with moduleId as key for easier lookup
            const progressMap = {};
            progressResponse.data.forEach(item => {
              progressMap[item.module._id] = item;
            });
            
            setProgress(progressMap);
          } catch (progressError) {
            console.error('Error fetching progress:', progressError);
            // Continue even if progress fetch fails
          }
        }
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError('Failed to load modules. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchModulesAndProgress();
  }, [user]);

  const getModuleStatus = (moduleId) => {
    if (!user) return 'locked';
    
    const moduleProgress = progress[moduleId];
    
    if (!moduleProgress) {
      // Check if this is the first module or if previous module is completed
      const moduleIndex = modules.findIndex(m => m._id === moduleId);
      
      if (moduleIndex === 0) return 'available';
      
      const prevModuleId = modules[moduleIndex - 1]?._id;
      if (prevModuleId && progress[prevModuleId]?.status === 'completed') {
        return 'available';
      }
      
      return 'locked';
    }
    
    return moduleProgress.status;
  };

  const getProgressPercentage = (moduleId) => {
    const moduleProgress = progress[moduleId];
    
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

  const handleModuleClick = (moduleId, status) => {
    if (status === 'locked') {
      return; // Do nothing for locked modules
    }
    
    navigate(`/modules/${moduleId}`);
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

  if (modules.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No modules available yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Learning Modules
      </Typography>
      
      <Grid container spacing={3}>
        {modules.map((module) => {
          const status = getModuleStatus(module._id);
          const progressPercentage = getProgressPercentage(module._id);
          
          return (
            <Grid item xs={12} md={6} key={module._id}>
              <Card 
                variant="outlined"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  opacity: status === 'locked' ? 0.7 : 1,
                  '&:hover': {
                    boxShadow: status !== 'locked' ? 3 : 0,
                    cursor: status !== 'locked' ? 'pointer' : 'default'
                  }
                }}
                onClick={() => handleModuleClick(module._id, status)}
              >
                {status === 'locked' && (
                  <Box 
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      zIndex: 1
                    }}
                  >
                    <LockIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                  </Box>
                )}
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="div">
                      {module.title}
                    </Typography>
                    <Chip 
                      label={module.level} 
                      size="small" 
                      color={module.level === 'Beginner' ? 'success' : module.level === 'Intermediate' ? 'primary' : 'secondary'}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {module.description}
                  </Typography>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {module.estimatedTime || '15-20 min'}
                    </Typography>
                    
                    <Chip 
                      icon={status === 'completed' ? <CheckIcon /> : null}
                      label={status === 'completed' ? 'Completed' : status === 'in progress' ? 'In Progress' : 'Not Started'}
                      size="small"
                      color={status === 'completed' ? 'success' : status === 'in progress' ? 'primary' : 'default'}
                      variant={status === 'locked' ? 'outlined' : 'filled'}
                    />
                  </Box>
                  
                  {status === 'in progress' && (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress variant="determinate" value={progressPercentage} />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {progressPercentage}% complete
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                
                {status !== 'locked' && (
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={status === 'completed' ? <CheckIcon /> : <PlayArrowIcon />}
                      color={status === 'completed' ? 'success' : 'primary'}
                    >
                      {status === 'completed' ? 'Review' : status === 'in progress' ? 'Continue' : 'Start'}
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