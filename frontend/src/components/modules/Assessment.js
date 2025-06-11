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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
        const moduleResponse = await api.get(`/modules/${moduleId}`);
        setModule(moduleResponse.data);
        const assessmentResponse = await api.get(`/assessment/${moduleId}`);
        setAssessment(assessmentResponse.data);

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
      if (answers[index] === question.correctAnswer.toString()) {
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
      // Format answers with questionId and selectedAnswer
      const formattedAnswers = assessment.questions.map((question, index) => ({
        questionId: question._id,
        selectedAnswer: answers[index]
      }));

      const submissionData = {
        userId: user._id,
        moduleId,
        answers: formattedAnswers,
        score: calculatedScore.percentage
      };

      const response = await api.post('/submissions/create', submissionData);

      if (response.data.achievement) {
        setAchievement(response.data.achievement);
        setAchievementDialog(true);
      }

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
    setCurrentQuestion(0);
    setSubmitted(false);
    setScore(null);
    setShowResults(false);
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

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {module.title} - Assessment
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!showResults ? (
          <>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                Question {currentQuestion + 1} of {assessment.questions.length}
              </FormLabel>
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                {assessment.questions[currentQuestion].questionText}
              </Typography>
              <RadioGroup
                name={`question-${currentQuestion}`}
                value={answers[currentQuestion] || ''}
                onChange={handleAnswerChange}
              >
                {assessment.questions[currentQuestion].options.map((option, idx) => (
                  <FormControlLabel
                    key={idx}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button variant="outlined" onClick={handlePrevious} disabled={currentQuestion === 0}>
                Previous
              </Button>
              {currentQuestion < assessment.questions.length - 1 ? (
                <Button variant="contained" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button variant="contained" color="success" onClick={handleSubmit}>
                  Submit
                </Button>
              )}
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Results
            </Typography>
            <Typography>
              Score: {score.correct} out of {score.total} (
              {score.percentage}%)
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Button variant="outlined" onClick={handleRetakeAssessment} sx={{ mr: 2 }}>
                Retake
              </Button>
              <Button variant="contained" onClick={handleBackToDashboard}>
                Back to Dashboard
              </Button>
            </Box>
          </>
        )}
      </Paper>

      <Dialog open={achievementDialog} onClose={handleCloseAchievementDialog}>
        <DialogTitle>🎉 New Achievement!</DialogTitle>
        <DialogContent>
          <Typography>
            You've unlocked: <strong>{achievement?.name}</strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAchievementDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Assessment;
