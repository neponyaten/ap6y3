import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const RecentActivity = ({ technologies = [], deadlines = [] }) => {
  // Генерируем тестовые данные активности
  const activities = [
    {
      id: 1,
      type: 'completed',
      title: 'React Basics',
      time: '2 часа назад',
      icon: <CheckCircleIcon />,
      color: 'success',
    },
    {
      id: 2,
      type: 'in-progress',
      title: 'TypeScript Advanced',
      time: 'Вчера',
      icon: <AccessTimeIcon />,
      color: 'warning',
    },
    {
      id: 3,
      type: 'note',
      title: 'JavaScript ES6+',
      time: '2 дня назад',
      icon: <EditNoteIcon />,
      color: 'info',
    },
    {
      id: 4,
      type: 'deadline',
      title: 'Next.js 14',
      time: 'Завтра',
      icon: <CalendarTodayIcon />,
      color: 'error',
    },
  ];

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'completed':
        return `Изучена технология "${activity.title}"`;
      case 'in-progress':
        return `Начато изучение "${activity.title}"`;
      case 'note':
        return `Добавлена заметка к "${activity.title}"`;
      case 'deadline':
        return `Срок изучения "${activity.title}"`;
      default:
        return `Действие с "${activity.title}"`;
    }
  };

  return (
    <Box className="recent-activity">
      <Box className="activity-header">
        <HistoryIcon sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight={600}>
          Недавняя активность
        </Typography>
      </Box>

      <List className="activity-list" dense>
        {activities.map((activity) => (
          <ListItem key={activity.id} className="activity-item">
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: `${activity.color}.light`,
                  color: `${activity.color}.main`,
                }}
              >
                {activity.icon}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="body2" component="span">
                  {getActivityText(activity)}
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="text.secondary">
                  {activity.time}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>

      {activities.length === 0 && (
        <Box className="no-activity">
          <Typography variant="body2" color="text.secondary" align="center">
            Активность отсутствует
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default RecentActivity;