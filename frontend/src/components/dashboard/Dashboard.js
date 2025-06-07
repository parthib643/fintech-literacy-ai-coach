<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";

import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";

import ModuleList from "../modules/ModuleList";
import Progress from "./Progress";
import Achievements from "./Achievements";
=======
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import ModuleList from '../modules/ModuleList';
import Progress from './Progress';
import Achievements from './Achievements';
import Chatbot from '../chatbot/Chatbot';

>>>>>>> 052683b17a13223c8c36efcf732792deee9cc67d
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Fintech Literacy AI Coach
          </Typography>

          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircleIcon />
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>My account</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="open AI assistant"
            onClick={() => setAiDrawerOpen(true)}
            sx={{ ml: 1 }}
          >
            <SmartToyIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        {drawer}
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
          <Alert severity="error" sx={{ mb: 2 }}>
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
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 4 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                  Welcome, {user?.name || "Learner"}!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Continue your journey to financial literacy mastery.
                </Typography>
              </Paper>
            </Box>

            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  aria-label="dashboard tabs"
                  variant="fullWidth"
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
                      <Paper
                        sx={{
                          p: 3,
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                        }}
                      >
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
                    <Paper
                      sx={{ p: 3, display: "flex", flexDirection: "column" }}
                    >
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
                            <Card
                              sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
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
