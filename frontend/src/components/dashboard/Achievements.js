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
    <Paper
      sx={{
        p: 3,
        mt: 3,
        background: "rgba(30, 30, 60, 0.85)",
        borderRadius: 3,
        color: "#fff",
        boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.15)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <EmojiEventsIcon sx={{ color: '#FFD700', mr: 1, fontSize: 32 }} />
        <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700 }}>
          Achievements
        </Typography>
      </Box>
      
      <Typography variant="body2" sx={{ mb: 3, color: "#bbb" }}>
        You've unlocked {unlockedCount} out of {displayAchievements.length} achievements.
      </Typography>
      
      <Divider sx={{ mb: 3, background: "#393e6e" }} />
      
      <Grid container spacing={3}>
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
                  background: "rgba(44, 44, 84, 0.95)",
                  borderRadius: 3,
                  color: "#fff",
                  boxShadow: achievement.unlocked ? '0 8px 32px 0 rgba(108,99,255,0.15)' : 'none',
                  border: achievement.unlocked ? '1.5px solid #6c63ff' : '1.5px solid #393e6e',
                  transition: 'transform 0.2s, box-shadow 0.2s, border 0.2s',
                  '&:hover': {
                    transform: achievement.unlocked ? 'scale(1.03)' : 'none',
                    boxShadow: achievement.unlocked ? '0 12px 24px rgba(108,99,255,0.35)' : 'none',
                    border: achievement.unlocked ? '1.5px solid #f96d00' : '1.5px solid #393e6e'
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
                      backgroundColor: 'rgba(0, 0, 0, 0.08)',
                      zIndex: 1,
                      borderRadius: 3
                    }}
                  >
                    <LockIcon sx={{ fontSize: 30, color: '#393e6e' }} />
                  </Box>
                )}
                
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Typography variant="h2" component="div" sx={{ mb: 1 }}>
                      {achievement.icon}
                    </Typography>
                    
                    <Typography variant="h6" component="div" gutterBottom sx={{ color: "#fff", fontWeight: 700 }}>
                      {achievement.title}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ color: "#bbb" }}>
                      {achievement.description}
                    </Typography>
                    
                    {achievement.unlocked && achievement.dateEarned && (
                      <Typography variant="caption" color="#10A37F" sx={{ mt: 2, display: 'block' }}>
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