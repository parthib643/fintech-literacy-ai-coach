import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';
import { Box, Typography, Paper, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const ModuleDetail = () => {
  const { moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [selected, setSelected] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState('');

  useEffect(() => {
    // Fetch module content and quiz
    const fetchModule = async () => {
      const res = await api.get(`/modules/${moduleId}`);
      setModule(res.data);
      setQuiz(res.data.quiz); // Assuming your API returns a quiz object
    };
    fetchModule();
  }, [moduleId]);

  const handleQuizSubmit = () => {
    setSubmitted(true);
    if (selected === quiz.correctAnswer) {
      setResult('Correct!');
    } else {
      setResult('Incorrect. Try again!');
    }
  };

  if (!module) return <div>Loading...</div>;

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>{module.title}</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>{module.description}</Typography>
        <Typography variant="subtitle1" color="textSecondary">Level: {module.level}</Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>{module.content}</Typography>
      </Paper>
      {quiz && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Quiz</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{quiz.question}</Typography>
          <RadioGroup value={selected} onChange={e => setSelected(e.target.value)}>
            {quiz.options.map((opt, idx) => (
              <FormControlLabel key={idx} value={opt} control={<Radio />} label={opt} />
            ))}
          </RadioGroup>
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleQuizSubmit} disabled={submitted}>
            Submit
          </Button>
          {submitted && <Typography sx={{ mt: 2 }}>{result}</Typography>}
        </Paper>
      )}
    </Box>
  );
};

export default ModuleDetail;