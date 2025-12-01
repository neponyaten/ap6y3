import React from 'react';
import { Box, Typography, Chip, Slider, FormControlLabel, Switch, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

const AdvancedFilters = ({
  categories = [],
  selectedCategories = [],
  onCategoryChange,
  difficultyLevels = ['beginner', 'intermediate', 'advanced'],
  selectedDifficulties = [],
  onDifficultyChange,
  showAdvancedFilters = false,
  onToggleAdvancedFilters,
  onResetFilters,
}) => {
  const handleCategoryClick = (category) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const handleDifficultyClick = (difficulty) => {
    if (selectedDifficulties.includes(difficulty)) {
      onDifficultyChange(selectedDifficulties.filter(d => d !== difficulty));
    } else {
      onDifficultyChange([...selectedDifficulties, difficulty]);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'Начальный';
      case 'intermediate': return 'Средний';
      case 'advanced': return 'Продвинутый';
      default: return difficulty;
    }
  };

  return (
    <Box className="advanced-filters">
      <Box className="filters-header">
        <Button
          fullWidth
          startIcon={<FilterListIcon />}
          onClick={onToggleAdvancedFilters}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          {showAdvancedFilters ? 'Скрыть продвинутые фильтры' : 'Показать продвинутые фильтры'}
        </Button>
      </Box>

      {showAdvancedFilters && (
        <Box className="filters-content">
          {/* Категории */}
          <Box className="filter-section">
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Категории
            </Typography>
            <Box className="chips-container">
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => handleCategoryClick(category)}
                  color={selectedCategories.includes(category) ? 'primary' : 'default'}
                  variant={selectedCategories.includes(category) ? 'filled' : 'outlined'}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Box>

          {/* Уровень сложности */}
          <Box className="filter-section">
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Уровень сложности
            </Typography>
            <Box className="chips-container">
              {difficultyLevels.map((difficulty) => (
                <Chip
                  key={difficulty}
                  label={getDifficultyLabel(difficulty)}
                  onClick={() => handleDifficultyClick(difficulty)}
                  color={getDifficultyColor(difficulty)}
                  variant={selectedDifficulties.includes(difficulty) ? 'filled' : 'outlined'}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Box>

          {/* Дополнительные опции */}
          <Box className="filter-section">
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Дополнительно
            </Typography>
            <Box className="options-container">
              <FormControlLabel
                control={<Switch size="small" />}
                label="Только с ресурсами"
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                control={<Switch size="small" />}
                label="С установленными сроками"
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                control={<Switch size="small" />}
                label="С заметками"
              />
            </Box>
          </Box>

          {/* Кнопка сброса */}
          {(selectedCategories.length > 0 || selectedDifficulties.length > 0) && (
            <Box className="reset-section">
              <Button
                startIcon={<ClearIcon />}
                onClick={onResetFilters}
                variant="text"
                color="inherit"
                fullWidth
              >
                Сбросить все фильтры
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AdvancedFilters;