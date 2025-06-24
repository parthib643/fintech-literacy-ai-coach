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

        if (assessmentResponse.data?.questions) {
          const initialAnswers = {};
          assessmentResponse.data.questions.forEach((_, index) => {
            initialAnswers[index] = null;
          });
          setAnswers(initialAnswers);
        }
      } catch (err) {
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
      if (String(answers[index]) === String(question.correctAnswer)) {
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

    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    setShowResults(true);

    try {
      const submissionData = {
        userId: user._id,
        moduleId,
        answers: assessment.questions.map((q, index) => ({
          questionId: q._id,
          selectedAnswer: answers[index]?.toString()
        })),
        score: calculatedScore.percentage
      };

     const response = await api.post('/submit', submissionData);

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
      setError(`Failed to submit assessment: ${err?.response?.data?.message || err.message || 'Unknown error'}`);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleRetakeAssessment = () => {
    setCurrentQuestion(0);
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
        <Alert severity="error">Assessment not found. Please return to the dashboard and try again.</Alert>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleBackToDashboard} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

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
            <Typography>You answered {score.correct} out of {score.total} questions correctly.</Typography>
            <LinearProgress
              variant="determinate"
              value={score.percentage}
              color={score.percentage >= 70 ? 'success' : 'error'}
              sx={{ mt: 2, mb: 2, height: 10, borderRadius: 5 }}
            />
            {score.percentage >= 70 ? (
              <Alert severity="success" sx={{ mt: 2 }}>Congratulations! You have passed this assessment.</Alert>
            ) : (
              <Alert severity="warning" sx={{ mt: 2 }}>
                You need at least 70% to pass. Please review and try again.
              </Alert>
            )}
          </Box>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>Question Review</Typography>
          {assessment.questions.map((question, index) => {
            const selected = String(answers[index]);
            const correct = String(question.correctAnswer);
            const isCorrect = selected === correct;

            return (
              <Card
                key={index}
                variant="outlined"
                sx={{ mb: 2, bgcolor: isCorrect ? 'success.50' : 'error.50' }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isCorrect ? (
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
                      <strong>Your answer:</strong> {question.options[parseInt(selected)] ?? 'Not answered'}
                    </Typography>
                    
                      <Typography variant="body2" >
                        <strong >Correct answer:</strong> {" "}
                        {Number.isInteger(Number(question.correctAnswer)) && question.options[Number(question.correctAnswer)] !== undefined
                          ? question.options[Number(question.correctAnswer)]
                          : 'Invalid correctAnswer index'}
                      </Typography>
                    
                  </Box>
                </CardContent>
              </Card>
            );
          })}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBackToDashboard}>
              Back to Dashboard
            </Button>
            {score.percentage < 70 && (
              <Button variant="contained" onClick={handleRetakeAssessment}>
                Retake Assessment
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4">Assessment</Typography>
          <Typography variant="h6">{module.title}</Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={((currentQuestion + 1) / assessment.questions.length) * 100}
          sx={{ mb: 3, height: 8, borderRadius: 5 }}
        />
        <Typography variant="body2" sx={{ mb: 3 }}>
          Question {currentQuestion + 1} of {assessment.questions.length}
        </Typography>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6">{assessment.questions[currentQuestion].questionText}</Typography>
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel>Select your answer:</FormLabel>
              <RadioGroup
                name={`question-${currentQuestion}`}
                value={answers[currentQuestion]?.toString() || ''}
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={handlePrevious} disabled={currentQuestion === 0}>
            Previous
          </Button>
          {currentQuestion < assessment.questions.length - 1 ? (
            <Button variant="contained" onClick={handleNext} disabled={answers[currentQuestion] === null}>
              Next
            </Button>
          ) : (
            <Button variant="contained" color="success" onClick={handleSubmit} disabled={Object.values(answers).some(a => a === null)}>
              Submit Assessment
            </Button>
          )}
        </Box>
      </Paper>

      <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBackToDashboard}>
        Back to Dashboard
      </Button>

      <Dialog open={achievementDialog} onClose={handleCloseAchievementDialog}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmojiEventsIcon sx={{ color: 'gold', mr: 1, fontSize: 30 }} />
            Achievement Unlocked!
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Congratulations! You've earned a new achievement:</DialogContentText>
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
