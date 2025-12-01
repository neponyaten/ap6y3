import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Fab, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import useTechnologiesApi from './hooks/useTechnologiesApi';
import useTechnologyDeadlines from './hooks/useTechnologyDeadlines';
import useNotifications from './hooks/useNotifications';
import createAppTheme from './theme/theme';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import SearchBar from './components/SearchBar';
import FilterTabs from './components/FilterTabs';
import ThemeToggle from './components/ThemeToggle';
import UserStats from './components/UserStats';
import TechnologySearch from './components/TechnologySearch';
import RoadmapImporter from './components/RoadmapImporter';
import DataManager from './components/DataManager';
import NotificationSnackbar from './components/NotificationSnackbar';
import AdvancedFilters from './components/AdvancedFilters';
import RecentActivity from './components/RecentActivity';
import TechnologyStats from './components/TechnologyStats';
import UpcomingDeadlines from './components/UpcomingDeadlines';
import './App.css';

const App = () => {
  const { 
    technologies,
    setTechnologies,
    loading,
    error,
    searchResults,
    searchLoading,
    fetchTechnologies,
    searchTechnologies,
    addTechnology,
    fetchAdditionalResources,
    importRoadmap,
    updateStatus,
    updateNotes,
    markAllAsCompleted,
    resetAllStatuses,
    progress,
    stats
  } = useTechnologiesApi()

  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [sortBy, setSortBy] = useState('date-added')
  const [showSearchPanel, setShowSearchPanel] = useState(false)
  const [showActionsMenu, setShowActionsMenu] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedDifficulties, setSelectedDifficulties] = useState([])
  const [showResourcesOnly, setShowResourcesOnly] = useState(false)
  const [showDeadlinesOnly, setShowDeadlinesOnly] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' или 'list'

  // Добавляем хук для уведомлений
  const {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications
  } = useNotifications();

  // Добавляем хук для сроков
  const {
    deadlines,
    errors: deadlineErrors,
    setDeadline,
    removeDeadline,
    getDeadline,
    getError: getDeadlineError,
    getUpcomingDeadlines,
    isOverdue
  } = useTechnologyDeadlines();

  // Создаем MUI тему
  const muiTheme = createAppTheme(isDarkTheme);

  // Инициализация темы
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDarkTheme(savedTheme === 'dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkTheme(prefersDark)
    }
  }, [])

  // Применение темы
  useEffect(() => {
    const theme = isDarkTheme ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [isDarkTheme])

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
  }

  const randomNextTechnology = () => {
    const notStartedTech = technologies.filter(tech => tech.status === 'not-started')
    if (notStartedTech.length === 0) return
    
    const randomTech = notStartedTech[Math.floor(Math.random() * notStartedTech.length)]
    updateStatus(randomTech.id, 'in-progress')
    addNotification(`Технология "${randomTech.title}" переведена в процесс изучения`, 'info');
  }

  const sortTechnologies = (techs) => {
    switch(sortBy) {
      case 'name':
        return [...techs].sort((a, b) => a.title.localeCompare(b.title))
      case 'difficulty':
        const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 }
        return [...techs].sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])
      case 'status':
        const statusOrder = { 'not-started': 1, 'in-progress': 2, 'completed': 3 }
        return [...techs].sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
      case 'date-added':
      default:
        return techs // оставляем исходный порядок
    }
  }

  const filteredTechnologies = sortTechnologies(
    technologies.filter(tech => {
      // Базовые фильтры
      const statusMatch = activeFilter === 'all' || tech.status === activeFilter
      const searchMatch = searchQuery === '' || 
        tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.category.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Фильтры категорий
      const categoryMatch = selectedCategories.length === 0 || 
        selectedCategories.includes(tech.category)
      
      // Фильтры сложности
      const difficultyMatch = selectedDifficulties.length === 0 || 
        selectedDifficulties.includes(tech.difficulty)
      
      // Дополнительные фильтры
      const resourcesMatch = !showResourcesOnly || (tech.resources && tech.resources.length > 0)
      const deadlinesMatch = !showDeadlinesOnly || getDeadline(tech.id)
      
      return statusMatch && searchMatch && categoryMatch && difficultyMatch && resourcesMatch && deadlinesMatch
    })
  )

  const handleAddTechnologyFromSearch = async (techData) => {
    try {
      await addTechnology(techData)
      addNotification(`Технология "${techData.title}" успешно добавлена`, 'success');
      setShowSearchPanel(false);
    } catch (err) {
      addNotification('Ошибка при добавлении технологии', 'error');
    }
  }

  const handleFetchResources = async (techId) => {
    try {
      await fetchAdditionalResources(techId)
      addNotification('Дополнительные ресурсы загружены', 'success');
    } catch (err) {
      addNotification('Ошибка при загрузке дополнительных ресурсов', 'error');
    }
  }

  const handleImportData = (importedTechnologies) => {
    setTechnologies(prev => {
      const existingIds = new Set(prev.map(tech => tech.id));
      const newTechs = importedTechnologies.filter(tech => !existingIds.has(tech.id));
      return [...prev, ...newTechs];
    });
    addNotification(`Импортировано ${importedTechnologies.length} технологий`, 'success');
  };

  const handleClearData = () => {
    setTechnologies([]);
    addNotification('Все данные очищены', 'warning');
  };

  const handleMarkAllCompleted = () => {
    markAllAsCompleted();
    addNotification('Все технологии отмечены как изученные', 'success');
  };

  const handleResetAllStatuses = () => {
    resetAllStatuses();
    addNotification('Статусы всех технологий сброшены', 'info');
  };

  const handleSetDeadline = (techId, deadline) => {
    const success = setDeadline(techId, deadline);
    if (success) {
      addNotification('Срок изучения установлен', 'success');
    }
    return success;
  };

  const handleRemoveDeadline = (techId) => {
    removeDeadline(techId);
    addNotification('Срок изучения удален', 'info');
  };

  const handleResetAllFilters = () => {
    setSearchQuery('');
    setActiveFilter('all');
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setShowResourcesOnly(false);
    setShowDeadlinesOnly(false);
    addNotification('Все фильтры сброшены', 'info');
  };

  const speedDialActions = [
    { icon: <AddIcon />, name: 'Добавить технологию', action: () => setShowSearchPanel(true) },
    { icon: <RefreshIcon />, name: 'Обновить данные', action: fetchTechnologies },
    { icon: <FileDownloadIcon />, name: 'Экспорт данных', action: () => {/* TODO: имплементация */} },
    { icon: <FileUploadIcon />, name: 'Импорт roadmap', action: () => {/* TODO: имплементация */} },
    { 
      icon: viewMode === 'grid' ? '☰' : '⊞', 
      name: viewMode === 'grid' ? 'Список' : 'Сетка', 
      action: () => setViewMode(viewMode === 'grid' ? 'list' : 'grid') 
    },
  ];

  const categories = [...new Set(technologies.map(tech => tech.category))];
  const difficultyLevels = ['beginner', 'intermediate', 'advanced'];

  const getUpcomingDeadlinesList = () => {
    return getUpcomingDeadlines().map(deadline => ({
      ...deadline,
      technology: technologies.find(tech => tech.id === deadline.techId)
    })).filter(item => item.technology)
  }

  if (loading && technologies.length === 0) {
    return (
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <div className="app-loading">
          <div className="spinner"></div>
          <p>Загрузка технологий...</p>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className="app">
        <div className="app-header">
          <ProgressHeader technologies={technologies} progress={progress} stats={stats} />
          <div className="header-controls">
            <ThemeToggle isDarkTheme={isDarkTheme} onToggle={toggleTheme} />
            <button 
              className="header-action-button"
              onClick={() => setShowSearchPanel(!showSearchPanel)}
            >
              <SearchIcon />
              <span>Поиск технологий</span>
            </button>
          </div>
        </div>
        
        {/* Панель расширенного поиска */}
        {showSearchPanel && (
          <div className="search-panel-overlay">
            <div className="search-panel">
              <TechnologySearch
                onSearch={searchTechnologies}
                searchResults={searchResults}
                searchLoading={searchLoading}
                onAddTechnology={handleAddTechnologyFromSearch}
                onClose={() => setShowSearchPanel(false)}
              />
            </div>
          </div>
        )}
        
        <div className="main-content">
          {/* ЛЕВАЯ КОЛОНКА */}
          <div className="sidebar">
            <UserStats stats={stats} />
            
            {/* Быстрые действия */}
            <QuickActions 
              onMarkAllCompleted={handleMarkAllCompleted}
              onResetAll={handleResetAllStatuses}
              onRandomNext={randomNextTechnology}
              technologies={technologies}
            />
            
            {/* Продвинутые фильтры */}
            <AdvancedFilters
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryChange={setSelectedCategories}
              difficultyLevels={difficultyLevels}
              selectedDifficulties={selectedDifficulties}
              onDifficultyChange={setSelectedDifficulties}
              showAdvancedFilters={showAdvancedFilters}
              onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
              showResourcesOnly={showResourcesOnly}
              onShowResourcesOnlyChange={setShowResourcesOnly}
              showDeadlinesOnly={showDeadlinesOnly}
              onShowDeadlinesOnlyChange={setShowDeadlinesOnly}
              onResetFilters={handleResetAllFilters}
            />
            
            {/* Предстоящие сроки */}
            <UpcomingDeadlines 
              deadlines={getUpcomingDeadlinesList()}
              onRemoveDeadline={handleRemoveDeadline}
            />

            {/* Управление данными */}
            <DataManager
              technologies={technologies}
              onImportData={handleImportData}
              onClearData={handleClearData}
              compact={true}
            />
            
            <div className="api-section">
              <button 
                onClick={fetchTechnologies}
                disabled={loading}
                className="api-button"
              >
                {loading ? 'Загрузка...' : 'Загрузить из API'}
              </button>
            </div>
          </div>
          
          {/* ПРАВАЯ КОЛОНКА */}
          <div className="content">
            {/* Верхняя панель с поиском и фильтрами */}
            <div className="content-header">
              <div className="header-main">
                <SearchBar 
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  resultsCount={filteredTechnologies.length}
                  totalCount={technologies.length}
                  placeholder="Поиск по технологиям..."
                  onFocus={() => setShowSearchPanel(true)}
                />
                
                <div className="header-actions">
                  <button 
                    className="action-button"
                    onClick={() => setShowSearchPanel(true)}
                  >
                    <AddIcon />
                    <span>Добавить</span>
                  </button>
                  
                  <button 
                    className="action-button"
                    onClick={fetchTechnologies}
                    disabled={loading}
                  >
                    <RefreshIcon />
                    <span>Обновить</span>
                  </button>

                  <div className="view-toggle">
                    <button 
                      className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => setViewMode('grid')}
                    >
                      ⊞
                    </button>
                    <button 
                      className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => setViewMode('list')}
                    >
                      ☰
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="controls-row">
                <div className="filters-section">
                  <FilterTabs 
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    technologies={technologies}
                  />
                  
                  <button 
                    className="filter-toggle-button"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  >
                    <FilterListIcon />
                    <span>{showAdvancedFilters ? 'Скрыть фильтры' : 'Больше фильтров'}</span>
                  </button>
                </div>
                
                <div className="sort-section">
                  <div className="sort-label">
                    <SortIcon />
                    <span>Сортировка:</span>
                  </div>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="date-added">По дате добавления</option>
                    <option value="name">По названию</option>
                    <option value="difficulty">По сложности</option>
                    <option value="status">По статусу</option>
                  </select>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="error-message">
                <div className="error-content">
                  <span className="error-text">{error}</span>
                  <button onClick={fetchTechnologies} className="retry-button">
                    Попробовать снова
                  </button>
                </div>
              </div>
            )}
            
            {/* Основной контент с карточками */}
            <div className="technologies-container">
              <div className={`technologies-${viewMode}`}>
                {filteredTechnologies.length === 0 ? (
                  <div className="no-results">
                    <div className="no-results-icon">🔍</div>
                    <h3>Ничего не найдено</h3>
                    <p>Попробуйте изменить поисковый запрос или выбрать другой фильтр</p>
                    <div className="no-results-actions">
                      <button 
                        onClick={handleResetAllFilters}
                        className="reset-filters-button"
                      >
                        Сбросить все фильтры
                      </button>
                      <button 
                        onClick={() => setShowSearchPanel(true)}
                        className="add-technology-button"
                      >
                        Добавить технологию
                      </button>
                    </div>
                  </div>
                ) : (
                  filteredTechnologies.map(tech => (
                    <TechnologyCard
                      key={tech.id}
                      technology={tech}
                      onStatusChange={updateStatus}
                      onNotesChange={updateNotes}
                      onFetchResources={handleFetchResources}
                      onSetDeadline={handleSetDeadline}
                      onRemoveDeadline={handleRemoveDeadline}
                      deadline={getDeadline(tech.id)}
                      deadlineError={getDeadlineError(tech.id)}
                      isOverdue={isOverdue(tech.id)}
                      viewMode={viewMode}
                    />
                  ))
                )}
              </div>
              
              {/* Правая боковая панель */}
              <div className="content-sidebar">
                <TechnologyStats 
                  technologies={technologies}
                  stats={stats}
                />
                
                <RecentActivity 
                  technologies={technologies}
                  deadlines={deadlines}
                />
                
                <RoadmapImporter 
                  onImport={importRoadmap}
                  loading={loading}
                />
              </div>

              {/* Floating Action Button */}
              <Fab 
                color="primary" 
                className="floating-action-button"
                onClick={() => setShowActionsMenu(!showActionsMenu)}
              >
                <SpeedDialIcon />
              </Fab>
              
              {/* Speed Dial Menu */}
              {showActionsMenu && (
                <SpeedDial
                  ariaLabel="Быстрые действия"
                  className="speed-dial-menu"
                  icon={<SpeedDialIcon />}
                  direction="up"
                  open={showActionsMenu}
                  onClose={() => setShowActionsMenu(false)}
                >
                  {speedDialActions.map((action) => (
                    <SpeedDialAction
                      key={action.name}
                      icon={action.icon}
                      tooltipTitle={action.name}
                      onClick={action.action}
                    />
                  ))}
                </SpeedDial>
              )}
            </div>
          </div>
        </div>

        {/* Компонент уведомлений */}
        <NotificationSnackbar
          notifications={notifications}
          onRemoveNotification={removeNotification}
        />
      </div>
    </ThemeProvider>
  )
}

export default App