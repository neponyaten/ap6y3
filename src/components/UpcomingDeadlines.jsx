import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, IconButton } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const UpcomingDeadlines = ({ deadlines = [], onRemoveDeadline }) => {
  // Форматируем дату
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Просрочено';
    } else if (diffDays === 0) {
      return 'Сегодня';
    } else if (diffDays === 1) {
      return 'Завтра';
    } else if (diffDays < 7) {
      return `Через ${diffDays} дней`;
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
      });
    }
  };

  // Получаем цвет для срока
  const getDeadlineColor = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'error';
    if (diffDays <= 3) return 'warning';
    if (diffDays <= 7) return 'info';
    return 'success';
  };

  // Получаем иконку для срока
  const getDeadlineIcon = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return <WarningIcon />;
    if (diffDays <= 3) return <WarningIcon />;
    return <EventIcon />;
  };

  // Сортируем дедлайны по дате (сначала ближайшие)
  const sortedDeadlines = [...deadlines].sort((a, b) => {
    const dateA = new Date(a.deadline);
    const dateB = new Date(b.deadline);
    return dateA - dateB;
  });

  return (
    <Box className="upcoming-deadlines">
      <Box className="deadlines-header">
        <EventIcon sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight={600}>
          Предстоящие сроки
        </Typography>
        {deadlines.length > 0 && (
          <Chip
            label={`${deadlines.length}`}
            size="small"
            color="primary"
            sx={{ ml: 'auto' }}
          />
        )}
      </Box>

      {sortedDeadlines.length > 0 ? (
        <List className="deadlines-list" dense>
          {sortedDeadlines.map((deadline) => {
            const color = getDeadlineColor(deadline.deadline);
            const icon = getDeadlineIcon(deadline.deadline);
            const formattedDate = formatDate(deadline.deadline);

            return (
              <ListItem
                key={deadline.id || deadline.techId}
                className="deadline-item"
                secondaryAction={
                  onRemoveDeadline && (
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => onRemoveDeadline(deadline.techId)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: `${color}.light`,
                      color: `${color}.main`,
                    }}
                  >
                    {icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" component="span" fontWeight={500}>
                      {deadline.technology?.title || 'Неизвестная технология'}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.875rem' }} />
                      <Typography variant="caption" color="text.secondary">
                        {formattedDate}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Box className="no-deadlines">
          <EventIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="body2" color="text.secondary" align="center">
            Нет установленных сроков
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center">
            Установите сроки для технологий, чтобы отслеживать прогресс
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default UpcomingDeadlines;