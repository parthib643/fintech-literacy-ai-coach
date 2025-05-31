import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Tooltip,
  Paper
} from '@mui/material';
import {
  EmojiEvents as EmojiEventsIcon,
  Lock as LockIcon
} from '@mui/icons-material';

const Achievements = () => {
  const { user } = useAuth();
  
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user || !user._id) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/users/${user._id}/achievements`);
        setAchievements(response.data);
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setError('Failed to load achievements. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  // Mock achievements for demonstration
  const allAchievements = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first module',
      icon: '🏆',
      unlocked: false
    },
    {
      id: '2',
      title: 'Knowledge Seeker',
      description: 'Complete 3 modules',
      icon: '📚',
      unlocked: false
    },
    {
      id: '3',
      title: 'Perfect Score',
      description: 'Get 100% on an assessment',
      icon: '🎯',
      unlocked: false
    },
    {
      id: '4',
      title: 'Finance Novice',
      description: 'Complete all beginner modules',
      icon: '💰',
      unlocked: false
    },
    {
      id: '5',
      title: 'Finance Expert',
      description: 'Complete all intermediate modules',
      icon: '📈',
      unlocked: false
    },
    {
      id: '6',
      title: 'Finance Master',
      description: 'Complete all advanced modules',
      icon: '🏛️',
      unlocked: false
    }
  ];

  // Mark achievements as unlocked based on user's achievements
  const displayAchievements = allAchievements.map(achievement => {
    const userAchievement = achievements.find(a => a.title === achievement.title);
    return {
      ...achievement,
      unlocked: !!userAchievement,
      dateEarned: userAchievement?.dateEarned
    };
  });

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

  const unlockedCount = displayAchievements.filter(a => a.unlocked).length;

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <EmojiEventsIcon sx={{ color: 'gold', mr: 1 }} />
        <Typography variant="h5">Achievements</Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        You've unlocked {unlockedCount} out of {displayAchievements.length} achievements.
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={2}>
        {displayAchievements.map((achievement) => (
          <Grid item xs={12} sm={6} md={4} key={achievement.id}>
            <Tooltip 
              title={!achievement.unlocked ? 'Keep learning to unlock this achievement!' : ''}
              arrow
              placement="top"
            >
              <Card 
                variant="outlined"
                sx={{
                  height: '100%',
                  opacity: achievement.unlocked ? 1 : 0.6,
                  position: 'relative',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: achievement.unlocked ? 'scale(1.03)' : 'none',
                    boxShadow: achievement.unlocked ? 2 : 0
                  }
                }}
              >
                {!achievement.unlocked && (
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
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      zIndex: 1
                    }}
                  >
                    <LockIcon sx={{ fontSize: 30, color: 'text.secondary' }} />
                  </Box>
                )}
                
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Typography variant="h2" component="div" sx={{ mb: 1 }}>
                      {achievement.icon}
                    </Typography>
                    
                    <Typography variant="h6" component="div" gutterBottom>
                      {achievement.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      {achievement.description}
                    </Typography>
                    
                    {achievement.unlocked && achievement.dateEarned && (
                      <Typography variant="caption" color="success.main" sx={{ mt: 2, display: 'block' }}>
                        Earned on {new Date(achievement.dateEarned).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default Achievements;