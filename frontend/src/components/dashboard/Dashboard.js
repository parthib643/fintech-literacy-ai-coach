import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import ModuleList from '../modules/ModuleList';
import Progress from './Progress';
import Achievements from './Achievements';
import LockIcon from '@mui/icons-material/Lock';
import SendIcon from '@mui/icons-material/Send';

import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Chip,
  Divider,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tab,
  Tabs,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  School as SchoolIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  Dashboard as DashboardIcon,
  EmojiEvents as EmojiEventsIcon,
  TrendingUp as TrendingUpIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

// Daily financial literacy questions (can be moved to backend later)
const dailyQuestions = [
  {
    question: "What is the difference between a savings account and a checking account?",
    choices: [
      "Savings accounts earn interest, checking accounts are for daily transactions.",
      "Checking accounts earn more interest than savings accounts.",
      "Savings accounts are only for businesses.",
      "There is no difference.",
    ],
    correct: 0,
  },
  {
    question: "Why is it important to have an emergency fund?",
    choices: [
      "To buy luxury items whenever you want.",
      "To cover unexpected expenses without going into debt.",
      "To invest in the stock market.",
      "To pay regular monthly bills.",
    ],
    correct: 1,
  },
  {
    question: "What does 'compound interest' mean?",
    choices: [
      "Interest calculated only on the initial amount.",
      "Interest earned on both the initial amount and previously earned interest.",
      "Interest that decreases over time.",
      "Interest paid only at the end of the year.",
    ],
    correct: 1,
  },
  {
    question: "How can budgeting help you manage your finances?",
    choices: [
      "By tracking income and expenses to control spending.",
      "By increasing your salary automatically.",
      "By eliminating all expenses.",
      "By making you pay more taxes.",
    ],
    correct: 0,
  },
  {
    question: "What is a credit score and why does it matter?",
    choices: [
      "A number showing your income level.",
      "A number representing your creditworthiness, affecting loan approvals.",
      "A score given to your bank account.",
      "A score for your investment portfolio.",
    ],
    correct: 1,
  },
  {
    question: "What are the risks and benefits of investing in stocks?",
    choices: [
      "Stocks are always safe and guarantee returns.",
      "Stocks can offer high returns but also carry risk of loss.",
      "Stocks never lose value.",
      "Stocks are only for the wealthy.",
    ],
    correct: 1,
  },
  {
    question: "What is the 50/30/20 rule in personal finance?",
    choices: [
      "50% savings, 30% rent, 20% fun.",
      "50% needs, 30% wants, 20% savings.",
      "50% investments, 30% shopping, 20% bills.",
      "50% taxes, 30% food, 20% travel.",
    ],
    correct: 1,
  },
];

// Get today's question based on date
const getTodayQuestion = () => {
  const today = new Date();
  // Use UTC midnight to ensure question changes at 12:00 am
  const startOfDay = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );
  // Calculate days since a fixed date (e.g., Jan 1, 2024)
  const baseDate = new Date(Date.UTC(2024, 0, 1));
  const diffDays = Math.floor((startOfDay - baseDate) / (1000 * 60 * 60 * 24));
  const idx =
    ((diffDays % dailyQuestions.length) + dailyQuestions.length) %
    dailyQuestions.length;
  return dailyQuestions[idx];
};

const staticDashboardBg = {
  minHeight: '100vh',
  width: '100vw',
  background: '#232946',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: -1,
};

const levelOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 };
const sortModulesByLevel = (modules) => {
  return [...modules].sort((a, b) => {
    const aLevel = levelOrder[a.level] || 99;
    const bLevel = levelOrder[b.level] || 99;
    return aLevel - bLevel;
  });
};

const AIIcon = (props) => (
  <svg
    width={props.fontSize === "medium" ? 36 : 28}
    height={props.fontSize === "medium" ? 36 : 28}
    viewBox="0 0 32 32"
    fill="none"
    {...props}
  >
    <circle cx="16" cy="16" r="14" stroke="#fff" strokeWidth="2"/>
    <text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fff" fontFamily="Arial">AI</text>
  </svg>
);

const MIN_CHATBOT_WIDTH = 320;
const MAX_CHATBOT_WIDTH = 700;

// Chatbot methodology as a custom hook
const useChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await axios.post("http://localhost:5000/api/ai/chat", {
        message: input,
      });

      setMessages([
        ...newMessages,
        { from: "bot", text: res.data.response || "No reply" },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { from: "bot", text: "Error: Could not connect to AI." },
      ]);
    }
  };

  return { messages, input, setInput, handleSend };
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState([]);
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Chatbot drawer state
  const [chatbotDrawerOpen, setChatbotDrawerOpen] = useState(false);
  const [chatbotDrawerWidth, setChatbotDrawerWidth] = useState(420);
  const resizingRef = useRef(false);
  const chatEndRef = useRef(null);

  // Chatbot logic from Chatbot.js
  const { messages: chatMessages, input: chatInput, setInput: setChatInput, handleSend } = useChatbot();

  const [openDailyTask, setOpenDailyTask] = useState(true);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Check if daily task should be shown
  useEffect(() => {
    const lastShownDate = localStorage.getItem('lastDailyTaskDate');
    const today = new Date().toDateString();
    
    if (lastShownDate !== today) {
      setOpenDailyTask(true);
    }
  }, []);

  useEffect(() => {
    if (!user || !user._id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const modulesResponse = await api.get("/modules");
        setModules(modulesResponse.data);
      } catch (err) {
        setError("Failed to load modules.");
      }

      try {
        const progressResponse = await api.get(`/progress/${user._id}`);
        setProgress(progressResponse.data);
      } catch (err) {
        setError('Failed to load progress.');
      }

      try {
        const pathResponse = await api.get(`/paths/${user._id}`);
        setPath(pathResponse.data);
      } catch (err) {
        setError('Failed to load learning path.');
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleStartModule = (moduleId) => {
    navigate(`/module/${moduleId}`);
  };

  const handleContinueModule = (moduleId) => {
    navigate(`/module/${moduleId}`);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner":
        return "success";
      case "Intermediate":
        return "primary";
      case "Advanced":
        return "error";
      default:
        return "default";
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSkipTask = () => {
    setOpenDailyTask(false);
    setSelectedChoice(null);
    setShowFeedback(false);
    // Store today's date in localStorage
    localStorage.setItem('lastDailyTaskDate', new Date().toDateString());
  };

  const handleChoiceSelect = (idx) => {
    setSelectedChoice(idx);
    setShowFeedback(true);
  };

  const handleCloseDailyTask = () => {
    setOpenDailyTask(false);
    localStorage.setItem('lastDailyTaskDate', new Date().toDateString());
  };

  // For useEffect dependency: extract today's question
  const todayQuestion = getTodayQuestion().question;

  useEffect(() => {
    setSelectedChoice(null);
    setShowFeedback(false);
  }, [todayQuestion]);

  // Drawer resizing logic (mouse only)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!resizingRef.current) return;
      const clientX = e.clientX;
      const newWidth = Math.min(
        Math.max(window.innerWidth - clientX, MIN_CHATBOT_WIDTH),
        MAX_CHATBOT_WIDTH
      );
      setChatbotDrawerWidth(newWidth);
    };

    const handleMouseUp = () => {
      resizingRef.current = false;
      document.body.style.cursor = "";
    };

    if (resizingRef.current) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
    };
  }, [chatbotDrawerOpen]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Chatbot drawer component
  const drawer = (
    <Box
      sx={{
        width: 250,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #232946 0%, #27187E 100%)',
        color: '#fff',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        borderRight: '2px solid #6c63ff',
      }}
      role="presentation"
    >
      <Avatar 
        sx={{
          width: 80,
          height: 80,
          mb: 2,
          bgcolor: 'primary.main',
          fontSize: 48,
          color: '#fff',
          boxShadow: '0 2px 12px #6c63ff55',
          display: 'flex',
          mx: 'auto',
          mt: 2,
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          lineHeight: '80px',
          fontWeight: 700,
          textTransform: 'uppercase',
          overflow: 'hidden',
          p: 0,
        }}
        alt={user?.name || 'User'}
      >
        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
      </Avatar>
      <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, textAlign: 'center' }}>
        {user?.name || 'User'}
      </Typography>
      <Typography variant="body2" sx={{ color: "#bbb", textAlign: 'center', mb: 2 }}>
        {user?.email || ''}
      </Typography>
      
      <List sx={{ flexGrow: 1 }}>
        <ListItem button
          sx={{
            borderRadius: 2,
            mb: 1,
            background: 'transparent',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(90deg, #6c63ff 0%, #f96d00 100%)',
              color: '#fff'
            }
          }}>
          <ListItemIcon>
            <PersonIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Profile" sx={{ color: "#fff" }} />
        </ListItem>
        <ListItem button onClick={() => setActiveTab(0)} selected={activeTab === 0}
          sx={{
            borderRadius: 2,
            mb: 1,
            background: activeTab === 0 ? 'linear-gradient(90deg, #f96d00 0%, #6c63ff 100%)' : 'transparent',
            color: activeTab === 0 ? '#fff' : '#fff',
            '&:hover': {
              background: 'linear-gradient(90deg, #f96d00 0%, #6c63ff 100%)',
              color: '#fff'
            }
          }}>
          <ListItemIcon>
            <DashboardIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Overview" sx={{ color: "#fff" }} />
        </ListItem>
        <ListItem button onClick={() => setActiveTab(1)} selected={activeTab === 1}
          sx={{
            borderRadius: 2,
            mb: 1,
            background: activeTab === 1 ? 'linear-gradient(90deg, #f96d00 0%, #6c63ff 100%)' : 'transparent',
            color: activeTab === 1 ? '#fff' : '#fff',
            '&:hover': {
              background: 'linear-gradient(90deg, #f96d00 0%, #6c63ff 100%)',
              color: '#fff'
            }
          }}>
          <ListItemIcon>
            <SchoolIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Modules" sx={{ color: "#fff" }} />
        </ListItem>
        <ListItem button onClick={() => setActiveTab(2)} selected={activeTab === 2}
          sx={{
            borderRadius: 2,
            mb: 1,
            background: activeTab === 2 ? 'linear-gradient(90deg, #f96d00 0%, #6c63ff 100%)' : 'transparent',
            color: activeTab === 2 ? '#fff' : '#fff',
            '&:hover': {
              background: 'linear-gradient(90deg, #f96d00 0%, #6c63ff 100%)',
              color: '#fff'
            }
          }}>
          <ListItemIcon>
            <TrendingUpIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Progress" sx={{ color: "#fff" }} />
        </ListItem>
        <ListItem button onClick={() => setActiveTab(3)} selected={activeTab === 3}
          sx={{
            borderRadius: 2,
            mb: 1,
            background: activeTab === 3 ? 'linear-gradient(90deg, #f96d00 0%, #6c63ff 100%)' : 'transparent',
            color: activeTab === 3 ? '#fff' : '#fff',
            '&:hover': {
              background: 'linear-gradient(90deg, #f96d00 0%, #6c63ff 100%)',
              color: '#fff'
            }
          }}>
          <ListItemIcon>
            <EmojiEventsIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Achievements" sx={{ color: "#fff" }} />
        </ListItem>
        <ListItem button
          sx={{
            borderRadius: 2,
            mb: 1,
            background: 'transparent',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(90deg, #6c63ff 0%, #f96d00 100%)',
              color: '#fff'
            }
          }}>
          <ListItemIcon>
            <SettingsIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Settings" sx={{ color: "#fff" }} />
        </ListItem>
      </List>
      <Box sx={{ mt: 'auto', mb: 2 }}>
        <List>
          <ListItem button onClick={handleLogout}
            sx={{
              borderRadius: 2,
              background: 'transparent',
              color: '#fff',
              '&:hover': {
                background: 'linear-gradient(90deg, #6c63ff 0%, #f96d00 100%)',
                color: '#fff'
              }
            }}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: "#fff" }} />
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  // Add this helper function to get locked/available/completed/in progress status for dashboard modules
  const getDashboardModuleStatus = (moduleId) => {
    if (!user) return 'locked';
    const moduleProgress = progress.find(p => p.module._id === moduleId);
    if (!moduleProgress) {
      const sortedModules = sortModulesByLevel(modules);
      const moduleIndex = sortedModules.findIndex(m => m._id === moduleId);
      if (moduleIndex === 0) return 'available';
      const prevModuleId = sortedModules[moduleIndex - 1]?._id;
      const prevProgress = progress.find(p => p.module._id === prevModuleId);
      if (prevModuleId && prevProgress?.status === 'completed') {
        return 'available';
      }
      return 'locked';
    }
    return moduleProgress.status;
  };

  if (loading) {
    return (
      <>
        <div style={staticDashboardBg} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  // Daily task dialog component
  const dailyTaskDialog = (
    <Dialog
      open={openDailyTask}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
          background: "rgba(30, 30, 60, 0.95)",
          color: "#fff",
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: '#fff' }}>
        <EmojiEventsIcon color="secondary" />
        Daily Financial Challenge
      </DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" sx={{ mb: 3, color: '#fff' }}>
          {getTodayQuestion().question}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {getTodayQuestion().choices.map((choice, idx) => {
            let color = "primary";
            let customStyles = {
              background: 'rgba(44,44,84,0.85)',
              color: '#fff',
              borderColor: '#393e6e',
            };
            if (showFeedback) {
              if (selectedChoice === idx) {
                if (selectedChoice === getTodayQuestion().correct) {
                  color = "success";
                  customStyles = {
                    background: "#2e7d32",
                    color: "#fff",
                    boxShadow: "0 0 0 4px #388e3c55",
                    borderColor: "#388e3c",
                  };
                } else {
                  color = "error";
                  customStyles = {
                    background: "#b71c1c",
                    color: "#fff",
                    boxShadow: "0 0 0 4px #b71c1c55",
                    borderColor: "#b71c1c",
                  };
                }
              }
            }
            return (
              <Button
                key={idx}
                variant={selectedChoice === idx ? "contained" : "outlined"}
                color={color}
                onClick={() => handleChoiceSelect(idx)}
                sx={{
                  py: 1,
                  textAlign: "left",
                  transition: "box-shadow 0.2s",
                  ...customStyles,
                }}
                disabled={showFeedback}
              >
                {choice}
              </Button>
            );
          })}
        </Box>
        {showFeedback && (
          <Typography
            variant="body1"
            sx={{ mt: 3, p: 2, borderRadius: 2, color: '#fff', background: selectedChoice === getTodayQuestion().correct ? '#2e7d32' : '#b71c1c' }}
          >
            {selectedChoice === getTodayQuestion().correct
              ? "🎉 Correct! Well done."
              : `❌ Incorrect. The correct answer is: ${getTodayQuestion().choices[getTodayQuestion().correct]}`}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        {!showFeedback && (
          <Button onClick={handleSkipTask} color="inherit" sx={{ color: '#bbb' }}>
            Skip for Now
          </Button>
        )}
        {showFeedback && (
          <Button
            onClick={handleCloseDailyTask}
            color="primary"
            variant="contained"
            sx={{ background: 'linear-gradient(90deg, #f96d00 0%, #6c63ff 100%)', color: '#fff' }}
          >
            Continue to Dashboard
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <div style={staticDashboardBg} />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        {dailyTaskDialog}
        <AppBar position="static" sx={{ background: "#27187E" }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <Avatar 
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: 'primary.main',
                  fontSize: 20,
                  color: '#fff',
                  boxShadow: '0 2px 12px #6c63ff55',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  overflow: 'hidden',
                  p: 0,
                }}
                alt={user?.name || 'User'}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Fintech Literacy AI Coach
            </Typography>
            <IconButton
              color="inherit"
              aria-label="open chatbot drawer"
              edge="end"
              onClick={() => setChatbotDrawerOpen(true)}
              sx={{ ml: 2 }}
            >
              <AIIcon fontSize="large" />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          PaperProps={{
            sx: {
              background: "#27187E",
              color: "#fff"
            }
          }}
        >
          {drawer}
        </Drawer>
        {/* Chatbot Drawer */}
        <Drawer
          anchor="right"
          open={chatbotDrawerOpen}
          onClose={() => setChatbotDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: chatbotDrawerWidth,
              position: "fixed",
              right: 0,
              left: "auto",
              top: 0,
              bottom: 0,
              transition: "width 0.15s cubic-bezier(.4,2,.6,1)",
              userSelect: resizingRef.current ? "none" : "auto",
              background: "linear-gradient(180deg, #232946 0%, #27187E 100%)",
              color: "#fff",
              borderLeft: "2px solid #6c63ff",
              display: "flex",
              flexDirection: "column",
              p: 0,
            },
          }}
        >
          {/* Draggable handle on the left edge */}
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 16,
              cursor: "col-resize",
              zIndex: 10,
              "&:hover": { background: "#393e6e44" },
              transition: "background 0.2s",
            }}
            onMouseDown={() => {
              resizingRef.current = true;
            }}
          />
          {/* --- Drawer Content (chat UI) --- */}
          <Box sx={{ p: 2, borderBottom: '1px solid #393e6e', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>
              AI Assistant
            </Typography>
          </Box>
          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            background: 'transparent',
            px: 0,
            py: 0,
            height: '100%',
            overflow: 'hidden'
          }}>
            <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 2 }}>
              {chatMessages.length === 0 ? (
                <Typography sx={{ color: "#bbb", mt: 2 }}>
                  💬 Start a conversation with your AI Assistant!
                </Typography>
              ) : (
                chatMessages.map((msg, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      textAlign: msg.from === "user" ? "right" : "left",
                      mb: 1,
                      px: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        display: "inline-block",
                        background: msg.from === "user" ? "#f96d00" : "#393e6e",
                        color: "#fff",
                        borderRadius: 2,
                        p: 1,
                      }}
                    >
                      {msg.text}
                    </Typography>
                  </Box>
                ))
              )}
              <div ref={chatEndRef} />
            </Box>
            <Box sx={{ display: "flex", p: 2, borderTop: "1px solid #393e6e", background: "rgba(30,30,60,0.85)" }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Message AI Assistant..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                sx={{
                  input: { color: "#fff" },
                  bgcolor: "rgba(44,44,84,0.85)",
                  borderRadius: 2,
                  mr: 1
                }}
              />
              <IconButton
                onClick={handleSend}
                sx={{
                  background: 'linear-gradient(90deg, #f96d00 0%, #6c63ff 100%)',
                  color: "#fff",
                  borderRadius: 2,
                  ml: 1,
                  '&:hover': { background: 'linear-gradient(90deg, #6c63ff 0%, #f96d00 100%)' }
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Drawer>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box sx={{ mb: 4 }}>
                <Paper sx={{ p: 3, background: "rgba(30, 30, 60, 0.85)", borderRadius: 3, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', color: "#fff" }}>
                  <Typography variant="h4" gutterBottom>
                    Welcome, {user?.name || 'Learner'}!
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#bbb" }}>
                    Continue your journey to financial literacy mastery.
                  </Typography>
                </Paper>
              </Box>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                  <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange} 
                    aria-label="dashboard tabs"
                    variant="fullWidth"
                    textColor="inherit"
                    TabIndicatorProps={{ style: { background: "#f96d00" } }}
                  >
                    <Tab icon={<DashboardIcon />} label="Overview" sx={{ color: "#fff" }} />
                    <Tab icon={<SchoolIcon />} label="Modules" sx={{ color: "#fff" }} />
                    <Tab icon={<TrendingUpIcon />} label="Progress" sx={{ color: "#fff" }} />
                    <Tab icon={<EmojiEventsIcon />} label="Achievements" sx={{ color: "#fff" }} />
                  </Tabs>
                </Box>
                {/* Overview Tab */}
                {activeTab === 0 && (
                  <Grid container spacing={3}>
                    {/* Learning Path */}
                    {path && (
                      <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '87%', background: "rgba(30, 30, 60, 0.85)", borderRadius: 3, color: "#fff" }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <TimelineIcon sx={{ mr: 1 }} color="primary" />
                            <Typography variant="h6">Your Learning Path</Typography>
                          </Box>
                          <Divider sx={{ mb: 2, borderColor: "#444" }} />
                          <Typography variant="h5" sx={{ mb: 1 }}>
                            {path.suggestedPath}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2, color: "#bbb" }}>
                            Based on your progress and assessment results
                          </Typography>
                          <Box>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>Next Steps:</Typography>
                            <ul style={{ paddingLeft: '20px' }}>
                              {Array.isArray(path.nextSteps) && path.nextSteps.map((step, index) => (
                                <li key={index}>
                                  <Typography variant="body2">{step}</Typography>
                                </li>
                              ))}
                            </ul>
                          </Box>
                        </Paper>
                      </Grid>
                    )}
                    {/* Progress Summary */}
                    <Grid item xs={12} md={path ? 8 : 12}>
                      <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', background: "rgba(30, 30, 60, 0.85)", borderRadius: 3, color: "#fff" }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <TrendingUpIcon sx={{ mr: 1 }} color="primary" />
                          <Typography variant="h6">Your Progress</Typography>
                        </Box>
                        <Divider sx={{ mb: 2, borderColor: "#444" }} />
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h4">{modules.length}</Typography>
                              <Typography variant="body2">Total Modules</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h4">
                                {progress.filter(p => p.status === 'in progress').length}
                              </Typography>
                              <Typography variant="body2">In Progress</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h4">
                                {progress.filter(p => p.status === 'completed').length}
                              </Typography>
                              <Typography variant="body2">Completed</Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    {/* Available Modules */}
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2, color: "#fff" }}>
                        Available Modules
                      </Typography>
                      <Grid container spacing={3}>
                        {sortModulesByLevel(modules).map((module) => {
                          const status = getDashboardModuleStatus(module._id);
                          return (
                            <Grid item xs={12} sm={6} md={4} key={module._id}>
                              <Card
                                sx={{
                                  width: 367,
                                  height: 190,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  background: "rgba(30, 30, 60, 0.85)",
                                  borderRadius: 3,
                                  color: "#fff",
                                  boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.15)',
                                  justifyContent: 'space-between',
                                  position: 'relative',
                                  opacity: status === 'locked' ? 0.7 : 1,
                                  cursor: status === 'locked' ? 'not-allowed' : 'pointer',
                                  transition: 'box-shadow 0.2s',
                                  '&:hover': {
                                    boxShadow: status !== 'locked' ? '0 12px 24px rgba(108,99,255,0.35)' : undefined,
                                  }
                                }}
                                onClick={() => {
                                  if (status === 'locked') return;
                                  if (status === 'not started' || status === 'available') handleStartModule(module._id);
                                  else handleContinueModule(module._id);
                                }}
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
                                      zIndex: 1,
                                      borderRadius: 3
                                    }}
                                  >
                                    <LockIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                                  </Box>
                                )}
                                <CardContent sx={{ flexGrow: 1 }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Typography variant="h6" component="div" sx={{ color: "#fff" }}>
                                      {module.title}
                                    </Typography>
                                    <Chip
                                      label={module.level}
                                      size="small"
                                      color={getLevelColor(module.level)}
                                      sx={{ fontWeight: 700 }}
                                    />
                                  </Box>
                                  <Typography variant="body2" sx={{ mb: 2, color: "#bbb" }}>
                                    {module.description}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Chip
                                      icon={status === 'completed' ? <CheckCircleIcon /> : null}
                                      label={
                                        status === 'completed'
                                          ? 'Completed'
                                          : status === 'in progress'
                                          ? 'In Progress'
                                          : status === 'available'
                                          ? 'Not Started'
                                          : 'Locked'
                                      }
                                      color={
                                        status === 'completed'
                                          ? 'success'
                                          : status === 'in progress'
                                          ? 'primary'
                                          : status === 'available'
                                          ? 'default'
                                          : 'default'
                                      }
                                      size="small"
                                      sx={{
                                        background: status === 'available' ? '#181b2a' : undefined,
                                        color: status === 'available' ? '#fff' : undefined,
                                        fontWeight: 700,
                                      }}
                                    />
                                  </Box>
                                </CardContent>
                                {status !== 'locked' && (
                                  <CardActions sx={{ justifyContent: 'flex-start', px: 2, pb: 2 }}>
                                    <Button
                                      size="small"
                                      startIcon={
                                        status === 'completed' ? <CheckCircleIcon /> : <PlayArrowIcon />
                                      }
                                      sx={{
                                        background: 'linear-gradient(90deg, #f96d00 0%, #6c63ff 100%)',
                                        color: "#fff",
                                        fontWeight: 700,
                                        borderRadius: 2,
                                        px: 2,
                                        py: 1,
                                        boxShadow: '0 4px 16px rgba(108,99,255,0.25)',
                                        transition: 'transform 0.2s cubic-bezier(.4,2,.6,1), box-shadow 0.2s',
                                        '&:hover': {
                                          transform: 'translateY(-6px) scale(1.04)',
                                          boxShadow: '0 12px 24px rgba(108,99,255,0.35)',
                                        },
                                        width: 'auto',
                                        minWidth: '80px',
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        marginLeft: 0
                                      }}
                                    >
                                      {status === 'completed'
                                        ? 'Review'
                                        : status === 'in progress'
                                        ? 'Continue'
                                        : 'Start'}
                                    </Button>
                                  </CardActions>
                                )}
                              </Card>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                {/* Modules Tab */}
                {activeTab === 1 && <ModuleList />}
                {/* Progress Tab */}
                {activeTab === 2 && <Progress />}
                {/* Achievements Tab */}
                {activeTab === 3 && <Achievements />}
              </Box>
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
