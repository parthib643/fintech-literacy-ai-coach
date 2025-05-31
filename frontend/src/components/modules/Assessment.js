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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  EmojiEvents as EmojiEventsIcon
} from '@mui/icons-material';

const Assessment = () => {
  const { moduleId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState(null);
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [achievementDialog, setAchievementDialog] = useState(false);
  const [achievement, setAchievement] = useState(null);

  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        setLoading(true);
        
        // Fetch module details first
        const moduleResponse = await api.get(`/modules/${moduleId}`);
        setModule(moduleResponse.data);
        
        // Fetch assessment for this module
        const assessmentResponse = await api.get(`/assessment/${moduleId}`);
        setAssessment(assessmentResponse.data);
        
        // Initialize answers object
        if (assessmentResponse.data && assessmentResponse.data.questions) {
          const initialAnswers = {};
          assessmentResponse.data.questions.forEach((_, index) => {
            initialAnswers[index] = null;
          });
          setAnswers(initialAnswers);
        }
      } catch (err) {
        console.error('Error fetching assessment data:', err);
        setError('Failed to load assessment. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [moduleId]);

  const handleAnswerChange = (event) => {
    setAnswers({
      ...answers,
      [currentQuestion]: event.target.value
    });
  };

  const handleNext = () => {
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    assessment.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    return {
      correct: correctAnswers,
      total: assessment.questions.length,
      percentage: Math.round((correctAnswers / assessment.questions.length) * 100)
    };
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unanswered = Object.values(answers).filter(answer => answer === null).length;
    if (unanswered > 0) {
      setError(`Please answer all questions. ${unanswered} question(s) remaining.`);
      return;
    }
    
    setSubmitted(true);
    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    setShowResults(true);
    
    try {
      // Submit assessment results
      const submissionData = {
        userId: user._id,
        moduleId,
        answers: Object.values(answers),
        score: calculatedScore.percentage
      };
      
      const response = await api.post('/submissions/create', submissionData);
      
      // Check if user earned an achievement
      if (response.data.achievement) {
        setAchievement(response.data.achievement);
        setAchievementDialog(true);
      }
      
      // Update module progress to completed
      await api.post('/progress/update', {
        userId: user._id,
        moduleId,
        status: 'completed'
      });
    } catch (err) {
      console.error('Error submitting assessment:', err);
      setError('Failed to submit assessment. Your answers are saved locally.');
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleRetakeAssessment = () => {
    // Reset assessment state
    setCurrentQuestion(0);
    setSubmitted(false);
    setScore(null);
    setShowResults(false);
    
    // Reset answers
    const initialAnswers = {};
    assessment.questions.forEach((_, index) => {
      initialAnswers[index] = null;
    });
    setAnswers(initialAnswers);
  };

  const handleCloseAchievementDialog = () => {
    setAchievementDialog(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!assessment || !module) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Assessment not found. Please return to the dashboard and try again.
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

  // Results view
  if (showResults) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>Assessment Results</Typography>
          <Typography variant="h6" gutterBottom>{module.title}</Typography>
          
          <Box sx={{ my: 4, textAlign: 'center' }}>
            <Typography variant="h3" color={score.percentage >= 70 ? 'success.main' : 'error.main'}>
              {score.percentage}%
            </Typography>
            <Typography variant="body1">
              You answered {score.correct} out of {score.total} questions correctly.
            </Typography>
            
            <LinearProgress 
              variant="determinate" 
              value={score.percentage} 
              color={score.percentage >= 70 ? 'success' : 'error'}
              sx={{ mt: 2, mb: 2, height: 10, borderRadius: 5 }}
            />
            
            {score.percentage >= 70 ? (
              <Alert severity="success" sx={{ mt: 2 }}>
                Congratulations! You have passed this assessment.
              </Alert>
            ) : (
              <Alert severity="warning" sx={{ mt: 2 }}>
                You need at least 70% to pass this assessment. Please review the module content and try again.
              </Alert>
            )}
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>Question Review</Typography>
          
          {assessment.questions.map((question, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 2, bgcolor: answers[index] === question.correctAnswer ? 'success.50' : 'error.50' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {answers[index] === question.correctAnswer ? (
                    <CheckIcon color="success" sx={{ mr: 1 }} />
                  ) : (
                    <CloseIcon color="error" sx={{ mr: 1 }} />
                  )}
                  <Typography variant="body1">
                    <strong>Question {index + 1}:</strong> {question.questionText}
                  </Typography>
                </Box>
                
                <Box sx={{ ml: 4, mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Your answer:</strong> {question.options[answers[index]]}
                  </Typography>
                  {answers[index] !== question.correctAnswer && (
                    <Typography variant="body2" color="success.main">
                      <strong>Correct answer:</strong> {question.options[question.correctAnswer]}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBackIcon />} 
              onClick={handleBackToDashboard}
            >
              Back to Dashboard
            </Button>
            
            {score.percentage < 70 && (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleRetakeAssessment}
              >
                Retake Assessment
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    );
  }

  // Assessment taking view
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Assessment</Typography>
          <Typography variant="h6">{module.title}</Typography>
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={(currentQuestion + 1) / assessment.questions.length * 100} 
          sx={{ mb: 3, height: 8, borderRadius: 5 }}
        />
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Question {currentQuestion + 1} of {assessment.questions.length}
        </Typography>
        
        {/* Current Question */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {assessment.questions[currentQuestion].questionText}
            </Typography>
            
            <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
              <FormLabel component="legend">Select your answer:</FormLabel>
              <RadioGroup
                name={`question-${currentQuestion}`}
                value={answers[currentQuestion] || ''}
                onChange={handleAnswerChange}
              >
                {assessment.questions[currentQuestion].options.map((option, index) => (
                  <FormControlLabel 
                    key={index} 
                    value={index.toString()} 
                    control={<Radio />} 
                    label={option} 
                    sx={{ mt: 1 }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
        
        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          {currentQuestion < assessment.questions.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={answers[currentQuestion] === null}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              disabled={Object.values(answers).some(answer => answer === null)}
            >
              Submit Assessment
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
      
      {/* Achievement Dialog */}
      <Dialog
        open={achievementDialog}
        onClose={handleCloseAchievementDialog}
        aria-labelledby="achievement-dialog-title"
      >
        <DialogTitle id="achievement-dialog-title">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmojiEventsIcon sx={{ color: 'gold', mr: 1, fontSize: 30 }} />
            Achievement Unlocked!
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Congratulations! You've earned a new achievement:
          </DialogContentText>
          {achievement && (
            <Box sx={{ textAlign: 'center', my: 2 }}>
              <Typography variant="h5" color="primary">{achievement.title}</Typography>
              <Typography variant="body1">{achievement.description}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAchievementDialog} color="primary" autoFocus>
            Awesome!
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Assessment;