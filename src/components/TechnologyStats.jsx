import React from 'react';
import { Box, Typography, Grid, LinearProgress, Paper } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CategoryIcon from '@mui/icons-material/Category';
import SchoolIcon from '@mui/icons-material/School';
import ScheduleIcon from '@mui/icons-material/Schedule';

const TechnologyStats = ({ technologies = [], stats = {} }) => {
  // Рассчитываем статистику по категориям
  const categoryStats = technologies.reduce((acc, tech) => {
    acc[tech.category] = (acc[tech.category] || 0) + 1;
    return acc;
  }, {});

  const topCategory = Object.entries(categoryStats).sort((a, b) => b[1] - a[1])[0];

  // Рассчитываем статистику по сложности
  const difficultyStats = technologies.reduce((acc, tech) => {
    acc[tech.difficulty] = (acc[tech.difficulty] || 0) + 1;
    return acc;
  }, {});

  // Рассчитываем средний прогресс
  const avgProgress = technologies.length > 0
    ? Math.round((stats.completed / technologies.length) * 100)
    : 0;

  return (
    <Box className="technology-stats">
      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <TrendingUpIcon sx={{ mr: 1 }} />
        Статистика изучения
      </Typography>

      <Grid container spacing={2}>
        {/* Общий прогресс */}
        <Grid item xs={12}>
          <Paper elevation={0} className="stat-card">
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Общий прогресс
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ flexGrow: 1, mr: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={avgProgress}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Typography variant="h6" fontWeight={700}>
                {avgProgress}%
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Популярная категория */}
        <Grid item xs={6}>
          <Paper elevation={0} className="stat-card">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CategoryIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2" color="text.secondary">
                Популярная категория
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight={700}>
              {topCategory ? topCategory[0] : 'Нет данных'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {topCategory ? `${topCategory[1]} технологий` : ''}
            </Typography>
          </Paper>
        </Grid>

        {/* Распределение по сложности */}
        <Grid item xs={6}>
          <Paper elevation={0} className="stat-card">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SchoolIcon fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
              <Typography variant="body2" color="text.secondary">
                Средняя сложность
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight={700}>
              {technologies.length > 0 ? 'Средний' : 'Нет данных'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {Object.keys(difficultyStats).length > 0 
                ? `${Object.keys(difficultyStats).length} уровней` 
                : ''
              }
            </Typography>
          </Paper>
        </Grid>

        {/* Активные сроки */}
        <Grid item xs={12}>
          <Paper elevation={0} className="stat-card">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ScheduleIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
              <Typography variant="body2" color="text.secondary">
                Активные сроки
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={700}>
                {stats.inProgress || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                в процессе изучения
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TechnologyStats;