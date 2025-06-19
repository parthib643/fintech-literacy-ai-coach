import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";

import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";

import ModuleList from "../modules/ModuleList";
import Progress from "./Progress";
import Achievements from "./Achievements";
import Chatbot from "../chatbot/Chatbot";

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
  Menu,
  MenuItem,
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
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  EmojiEvents as EmojiEventsIcon,
  TrendingUp as TrendingUpIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
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

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState([]);
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    {
      from: "bot",
      text: "Hi! I am your AI assistant. How can I help you today?",
    },
  ]);
  const [aiInput, setAiInput] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const [openDailyTask, setOpenDailyTask] = useState(true);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch modules
        const modulesResponse = await api.get("/modules");
        setModules(modulesResponse.data);

        // Fetch user progress
        if (user && user._id) {
          const progressResponse = await api.get(`/progress/${user._id}`);
          setProgress(progressResponse.data);

          // Fetch learning path
          const pathResponse = await api.get(`/paths/${user._id}`);
          setPath(pathResponse.data);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getModuleStatus = (moduleId) => {
    const moduleProgress = progress.find((p) => p.module._id === moduleId);
    return moduleProgress ? moduleProgress.status : "not started";
  };

  const handleStartModule = (moduleId) => {
    navigate(`/module/${moduleId}`);
  };

  const handleContinueModule = (moduleId) => {
    navigate(`/module/${moduleId}`);
  };

  const sendAiMessage = () => {
    if (!aiInput.trim()) return;

    const newMessages = [...aiMessages, { from: "user", text: aiInput }];
    setAiMessages(newMessages);
    setAiInput("");

    // Simulate AI response
    setTimeout(() => {
      setAiMessages([
        ...newMessages,
        { from: "bot", text: `You said: ${aiInput}` },
      ]);
    }, 1000);
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

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
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
  };

  const handleChoiceSelect = (idx) => {
    setSelectedChoice(idx);
    setShowFeedback(true);
  };

  useEffect(() => {
    setSelectedChoice(null);
    setShowFeedback(false);
  }, [getTodayQuestion().question]);

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          sx={{ width: 80, height: 80, mb: 2, bgcolor: "primary.main" }}
          alt={user?.name || "User"}
          className="floating-avatar"
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </Avatar>
        <Typography variant="h6">{user?.name || "User"}</Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.email || ""}
        </Typography>
      </Box>

      <Divider />

      <List>
        <ListItem
          button
          onClick={() => setActiveTab(0)}
          selected={activeTab === 0}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Overview" />
        </ListItem>

        <ListItem
          button
          onClick={() => setActiveTab(1)}
          selected={activeTab === 1}
        >
          <ListItemIcon>
            <SchoolIcon />
          </ListItemIcon>
          <ListItemText primary="Modules" />
        </ListItem>

        <ListItem
          button
          onClick={() => setActiveTab(2)}
          selected={activeTab === 2}
        >
          <ListItemIcon>
            <TrendingUpIcon />
          </ListItemIcon>
          <ListItemText primary="Progress" />
        </ListItem>

        <ListItem
          button
          onClick={() => setActiveTab(3)}
          selected={activeTab === 3}
        >
          <ListItemIcon>
            <EmojiEventsIcon />
          </ListItemIcon>
          <ListItemText primary="Achievements" />
        </ListItem>
      </List>

      <Divider />

      <List>
        <ListItem button>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>

        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  // Daily task handlers
  const handleTaskAction = () => {
    // Task handling logic here
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Define daily task dialog component
  const dailyTaskDialog = (
    <Dialog
      open={openDailyTask}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1,
          background: "linear-gradient(to bottom, #ffffff, #f5f5fa)",
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <EmojiEventsIcon color="secondary" />
        Daily Financial Challenge
      </DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          {getTodayQuestion().question}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {getTodayQuestion().choices.map((choice, idx) => {
            let color = "primary";
            let customStyles = {};
            if (showFeedback) {
              if (selectedChoice === idx) {
                if (selectedChoice === getTodayQuestion().correct) {
                  color = "success";
                  customStyles = {
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    boxShadow: "0 0 0 4px #a5d6a7",
                    borderColor: "#388e3c",
                  };
                } else {
                  color = "error";
                  customStyles = {
                    backgroundColor: "#f44336",
                    color: "#fff",
                    boxShadow: "0 0 0 4px #ef9a9a",
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
            sx={{ mt: 3, p: 2, borderRadius: 1 }}
            color={
              selectedChoice === getTodayQuestion().correct
                ? "success.main"
                : "error.main"
            }
            bgcolor={
              selectedChoice === getTodayQuestion().correct
                ? "success.light"
                : "error.light"
            }
          >
            {selectedChoice === getTodayQuestion().correct
              ? "🎉 Correct! Well done."
              : `❌ Incorrect. The correct answer is: "${
                  getTodayQuestion().choices[getTodayQuestion().correct]
                }"`}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        {!showFeedback && (
          <Button onClick={handleSkipTask} color="inherit">
            Skip for Now
          </Button>
        )}
        {showFeedback && (
          <Button
            onClick={() => setOpenDailyTask(false)}
            color="primary"
            variant="contained"
          >
            Continue to Dashboard
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {dailyTaskDialog}
      <AppBar position="static" className="MuiAppBar-root" elevation={0}>
        <Toolbar className="MuiToolbar-root">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontSize: "1.5rem",
              fontWeight: 600,
            }}
          >
            Fintech Literacy AI Coach
          </Typography>

          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
          >
            <AccountCircleIcon />
          </IconButton>

          <IconButton
            size="large"
            edge="end"
            aria-label="open AI assistant"
            onClick={() => setAiDrawerOpen(true)}
            sx={{ ml: 1 }}
          >
            <SmartToyIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 250 }} role="presentation">
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{ width: 80, height: 80, mb: 2, bgcolor: "primary.main" }}
              alt={user?.name || "User"}
              className="floating-avatar"
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Avatar>
            <Typography variant="h6">{user?.name || "User"}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email || ""}
            </Typography>
          </Box>

          <Divider />

          <List>
            <ListItem
              button
              onClick={() => setActiveTab(0)}
              selected={activeTab === 0}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Overview" />
            </ListItem>

            <ListItem
              button
              onClick={() => setActiveTab(1)}
              selected={activeTab === 1}
            >
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Modules" />
            </ListItem>

            <ListItem
              button
              onClick={() => setActiveTab(2)}
              selected={activeTab === 2}
            >
              <ListItemIcon>
                <TrendingUpIcon />
              </ListItemIcon>
              <ListItemText primary="Progress" />
            </ListItem>

            <ListItem
              button
              onClick={() => setActiveTab(3)}
              selected={activeTab === 3}
            >
              <ListItemIcon>
                <EmojiEventsIcon />
              </ListItemIcon>
              <ListItemText primary="Achievements" />
            </ListItem>
          </List>

          <Divider />

          <List>
            <ListItem button>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>

            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Drawer
        anchor="right"
        open={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
      >
        <Box
          sx={{
            width: 350,
            p: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" gutterBottom>
            AI Assistant
          </Typography>

          <Box sx={{ flexGrow: 1, overflowY: "auto", mb: 2 }}>
            {aiMessages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  mb: 1,
                  textAlign: msg.from === "user" ? "right" : "left",
                }}
              >
                <Chip
                  label={msg.text}
                  color={msg.from === "user" ? "primary" : "default"}
                  variant="outlined"
                  sx={{ maxWidth: "80%" }}
                />
              </Box>
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Ask something..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendAiMessage();
              }}
            />
            <IconButton color="primary" onClick={sendAiMessage}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Drawer>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} className="fade-in">
            {error}
          </Alert>
        )}

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <CircularProgress className="MuiCircularProgress-root" />
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 4 }} className="fade-in">
              <Paper sx={{ p: 3 }} className="MuiPaper-root">
                <Typography variant="h4" gutterBottom>
                  Welcome, {user?.name || "Learner"}!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Continue your journey to financial literacy mastery.
                </Typography>
              </Paper>
            </Box>

            <Box sx={{ width: "100%" }} className="fade-in">
              <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  aria-label="dashboard tabs"
                  variant="fullWidth"
                  className="MuiTabs-root"
                >
                  <Tab icon={<DashboardIcon />} label="Overview" />
                  <Tab icon={<SchoolIcon />} label="Modules" />
                  <Tab icon={<TrendingUpIcon />} label="Progress" />
                  <Tab icon={<EmojiEventsIcon />} label="Achievements" />
                </Tabs>
              </Box>

              {/* Overview Tab */}
              {activeTab === 0 && (
                <Grid container spacing={3}>
                  {/* Learning Path */}
                  {path && (
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 3 }} className="MuiPaper-root scale-up">
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <TimelineIcon sx={{ mr: 1 }} color="primary" />
                          <Typography variant="h6">
                            Your Learning Path
                          </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="h5" sx={{ mb: 1 }}>
                          {path.suggestedPath}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          Based on your progress and assessment results
                        </Typography>
                        <Box>
                          <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Next Steps:
                          </Typography>
                          <ul style={{ paddingLeft: "20px" }}>
                            {path.nextSteps.map((step, index) => (
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
                    <Paper sx={{ p: 3 }} className="MuiPaper-root scale-up">
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <SchoolIcon sx={{ mr: 1 }} color="primary" />
                        <Typography variant="h6">Your Progress</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h4">
                              {modules.length}
                            </Typography>
                            <Typography variant="body2">
                              Total Modules
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h4">
                              {
                                progress.filter(
                                  (p) => p.status === "in progress"
                                ).length
                              }
                            </Typography>
                            <Typography variant="body2">In Progress</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h4">
                              {
                                progress.filter((p) => p.status === "completed")
                                  .length
                              }
                            </Typography>
                            <Typography variant="body2">Completed</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>

                  {/* Available Modules */}
                  <Grid item xs={12}>
                    <Chatbot />
                  </Grid>
                  {/* Available Modules */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Available Modules
                    </Typography>
                    <Grid container spacing={3}>
                      {modules.map((module) => {
                        const status = getModuleStatus(module._id);
                        return (
                          <Grid item xs={12} sm={6} md={4} key={module._id}>
                            <Card className="MuiCard-root card-animate">
                              <CardContent sx={{ flexGrow: 1 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    mb: 1,
                                  }}
                                >
                                  <Typography variant="h6" component="div">
                                    {module.title}
                                  </Typography>
                                  <Chip
                                    label={module.level}
                                    size="small"
                                    color={getLevelColor(module.level)}
                                  />
                                </Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 2 }}
                                >
                                  {module.description}
                                </Typography>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Chip
                                    icon={
                                      status === "completed" ? (
                                        <CheckCircleIcon />
                                      ) : null
                                    }
                                    label={
                                      status.charAt(0).toUpperCase() +
                                      status.slice(1)
                                    }
                                    color={
                                      status === "completed"
                                        ? "success"
                                        : status === "in progress"
                                        ? "primary"
                                        : "default"
                                    }
                                    size="small"
                                  />
                                </Box>
                              </CardContent>
                              <CardActions>
                                {status === "not started" ? (
                                  <Button
                                    size="small"
                                    startIcon={<PlayArrowIcon />}
                                    onClick={() =>
                                      handleStartModule(module._id)
                                    }
                                  >
                                    Start
                                  </Button>
                                ) : status === "in progress" ? (
                                  <Button
                                    size="small"
                                    color="primary"
                                    onClick={() =>
                                      handleContinueModule(module._id)
                                    }
                                  >
                                    Continue
                                  </Button>
                                ) : (
                                  <Button
                                    size="small"
                                    color="success"
                                    onClick={() =>
                                      handleContinueModule(module._id)
                                    }
                                  >
                                    Review
                                  </Button>
                                )}
                              </CardActions>
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
  );
};

export default Dashboard;
