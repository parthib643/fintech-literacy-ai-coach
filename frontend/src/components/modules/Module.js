import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

const Module = () => {
  const { moduleId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [module, setModule] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  
  // Mock content sections for demonstration
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        setLoading(true);
        // Fetch module details
        const moduleResponse = await api.get(`/modules/${moduleId}`);
        setModule(moduleResponse.data);
        
        // Create sections from module content
        // In a real app, this would come from the API
        if (moduleResponse.data.content) {
          // For demo purposes, split content into sections
          const contentSections = moduleResponse.data.content.split('\n\n')
            .filter(section => section.trim() !== '')
            .map((section, index) => ({
              id: index + 1,
              title: `Section ${index + 1}`,
              content: section
            }));
          setSections(contentSections);
        }

        // Fetch user progress for this module
        if (user && user._id) {
          try {
            const progressResponse = await api.get(`/progress/${user._id}`);
            const moduleProgress = progressResponse.data.find(p => p.module._id === moduleId);
            setUserProgress(moduleProgress);
            
            // If module is in progress, set current step accordingly
            if (moduleProgress && moduleProgress.currentSection) {
              setCurrentStep(moduleProgress.currentSection - 1);
            }
          } catch (progressError) {
            console.error('Error fetching progress:', progressError);
            // Continue even if progress fetch fails
          }
        }
      } catch (err) {
        console.error('Error fetching module data:', err);
        setError('Failed to load module data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchModuleData();
  }, [moduleId, user]);

  const updateProgress = async (status, section = null) => {
    if (!user || !user._id) return;
    
    try {
      const progressData = {
        userId: user._id,
        moduleId,
        status,
        ...(section && { currentSection: section })
      };
      
      await api.post('/progress/update', progressData);
      
      // Update local progress state
      setUserProgress(prev => ({
        ...prev,
        status,
        ...(section && { currentSection: section })
      }));
    } catch (err) {
      console.error('Error updating progress:', err);
      setError('Failed to update progress. Please try again.');
    }
  };

  const handleNext = () => {
    if (currentStep < sections.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      updateProgress('in progress', nextStep + 1);
    } else {
      // Last section completed
      updateProgress('completed');
      // Show assessment option
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartAssessment = () => {
    navigate(`/assessment/${moduleId}`);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!module) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Module not found. Please return to the dashboard and try again.
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBackToDashboard}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">{module.title}</Typography>
          <Chip label={module.level} color="primary" />
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {module.description}
        </Typography>
        
        {/* Progress Stepper */}
        <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 4 }}>
          {sections.map((section, index) => (
            <Step key={section.id}>
              <StepLabel>{section.title}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {/* Section Content */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {sections[currentStep]?.title}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1">
              {sections[currentStep]?.content}
            </Typography>
          </CardContent>
        </Card>
        
        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          {currentStep < sections.length - 1 ? (
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={handleNext}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              endIcon={<AssessmentIcon />}
              onClick={handleStartAssessment}
            >
              Take Assessment
            </Button>
          )}
        </Box>
      </Paper>
      
      <Button 
        variant="outlined" 
        startIcon={<ArrowBackIcon />} 
        onClick={handleBackToDashboard}
      >
        Back to Dashboard
      </Button>
    </Container>
  );
};

export default Module;