import { useState, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

// Mock API сервис для имитации реального API
const mockApiService = {
  async fetchTechnologies() {
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      success: true,
      data: [
        {
          id: 1,
          title: 'Figma & Прототипирование',
          description: 'Основы работы с Figma, создание wireframes, прототипов и дизайн-систем для веб-интерфейсов.',
          category: 'design',
          difficulty: 'beginner',
          resources: [
            'https://help.figma.com/hc/ru',
            'https://www.figma.com/resources/learn-design/'
          ],
          status: 'not-started',
          notes: ''
        },
        {
          id: 2,
          title: 'Adobe Creative Suite',
          description: 'Изучение Photoshop, Illustrator и XD для создания графики и дизайна веб-сайтов.',
          category: 'design',
          difficulty: 'intermediate',
          resources: [
            'https://helpx.adobe.com/ru/creative-cloud/tutorials-explore.html',
            'https://www.adobe.com/ru/creativecloud/business/teams.html'
          ],
          status: 'not-started',
          notes: ''
        },
        {
          id: 3,
          title: 'Tailwind CSS',
          description: 'Утилитарный CSS-фреймворк для быстрой разработки современных интерфейсов.',
          category: 'frontend',
          difficulty: 'intermediate',
          resources: [
            'https://tailwindcss.com/docs',
            'https://tailwindui.com/components'
          ],
          status: 'not-started',
          notes: ''
        },
        {
          id: 4,
          title: 'Next.js 14+',
          description: 'React-фреймворк с поддержкой серверных компонентов, App Router и оптимизацией производительности.',
          category: 'frontend',
          difficulty: 'intermediate',
          resources: [
            'https://nextjs.org/docs',
            'https://nextjs.org/learn'
          ],
          status: 'not-started',
          notes: ''
        },
        {
          id: 5,
          title: 'TypeScript',
          description: 'Типизированное надмножество JavaScript для масштабируемых приложений.',
          category: 'language',
          difficulty: 'intermediate',
          resources: [
            'https://www.typescriptlang.org/docs/',
            'https://www.typescriptlang.org/play'
          ],
          status: 'not-started',
          notes: ''
        },
        {
          id: 6,
          title: 'Framer Motion',
          description: 'Библиотека анимаций для React с поддержкой spring-физики и жестов.',
          category: 'animation',
          difficulty: 'intermediate',
          resources: [
            'https://www.framer.com/motion/',
            'https://www.framer.com/motion/examples/'
          ],
          status: 'not-started',
          notes: ''
        }
      ]
    };
  },

  async searchTechnologies(query) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const allTechs = [
      {
        id: 7,
        title: 'Three.js',
        description: 'JavaScript библиотека для создания 3D графики в браузере',
        category: '3d',
        difficulty: 'advanced',
        resources: ['https://threejs.org']
      },
      {
        id: 8,
        title: 'Storybook',
        description: 'Инструмент для разработки UI компонентов в изоляции',
        category: 'testing',
        difficulty: 'intermediate',
        resources: ['https://storybook.js.org']
      },
      {
        id: 9,
        title: 'Sass/SCSS',
        description: 'Препроцессор CSS с поддержкой переменных, миксинов и вложенностей',
        category: 'styling',
        difficulty: 'beginner',
        resources: ['https://sass-lang.com']
      },
      {
        id: 10,
        title: 'GSAP',
        description: 'Мощная библиотека анимации для JavaScript',
        category: 'animation',
        difficulty: 'intermediate',
        resources: ['https://greensock.com/gsap/']
      },
      {
        id: 11,
        title: 'Webpack/Vite',
        description: 'Современные сборщики модулей для JavaScript',
        category: 'build',
        difficulty: 'advanced',
        resources: ['https://vitejs.dev', 'https://webpack.js.org']
      }
    ];

    const filtered = allTechs.filter(tech => 
      tech.title.toLowerCase().includes(query.toLowerCase()) ||
      tech.description.toLowerCase().includes(query.toLowerCase()) ||
      tech.category.toLowerCase().includes(query.toLowerCase())
    );

    return {
      success: true,
      data: filtered
    };
  },

  async fetchAdditionalResources(techId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const resourcesMap = {
      1: ['https://www.youtube.com/c/DesignCourse', 'https://www.designbetter.co/'],
      2: ['https://www.behance.net/', 'https://dribbble.com/'],
      3: ['https://www.youtube.com/c/TailwindLabs', 'https://tailwindcomponents.com/'],
      4: ['https://nextjs.org/examples', 'https://github.com/vercel/next.js'],
      5: ['https://www.typescript-training.com/', 'https://github.com/total-typescript'],
      6: ['https://www.framer.com/templates/', 'https://www.framer.com/developers/'],
      7: ['https://threejs-journey.com/', 'https://github.com/mrdoob/three.js/'],
      8: ['https://storybook.js.org/tutorials/', 'https://github.com/storybookjs/storybook'],
      9: ['https://www.sassmeister.com/', 'https://github.com/sass/sass'],
      10: ['https://greensock.com/learning/', 'https://codepen.io/GreenSock/'],
      11: ['https://vitejs.dev/guide/', 'https://webpack.js.org/concepts/']
    };

    return {
      success: true,
      data: resourcesMap[techId] || []
    };
  }
};

function useTechnologiesApi() {
  const [technologies, setTechnologies] = useLocalStorage('technologies', []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Загрузка технологий из API
  const fetchTechnologies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await mockApiService.fetchTechnologies();
      
      if (response.success) {
        // Объединяем с существующими технологиями, избегая дубликатов
        setTechnologies(prev => {
          const existingIds = new Set(prev.map(tech => tech.id));
          const newTechs = response.data.filter(tech => !existingIds.has(tech.id));
          return [...prev, ...newTechs];
        });
      }
      
    } catch (err) {
      setError('Не удалось загрузить технологии из API');
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  // Поиск технологий
  const searchTechnologies = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await mockApiService.searchTechnologies(query);
      
      if (response.success) {
        setSearchResults(response.data);
      }
    } catch (err) {
      console.error('Ошибка поиска:', err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Добавление технологии из поиска
  const addTechnology = async (techData) => {
    try {
      const newTech = {
        ...techData,
        id: Date.now(),
        status: 'not-started',
        notes: '',
        createdAt: new Date().toISOString()
      };
      
      setTechnologies(prev => {
        const exists = prev.find(tech => tech.title === techData.title);
        return exists ? prev : [...prev, newTech];
      });
      
      return newTech;
    } catch (err) {
      throw new Error('Не удалось добавить технологию');
    }
  };

  // Загрузка дополнительных ресурсов
  const fetchAdditionalResources = async (techId) => {
    try {
      const response = await mockApiService.fetchAdditionalResources(techId);
      
      if (response.success) {
        setTechnologies(prev =>
          prev.map(tech =>
            tech.id === techId
              ? { 
                  ...tech, 
                  resources: [...(tech.resources || []), ...response.data] 
                }
              : tech
          )
        );
        
        return response.data;
      }
    } catch (err) {
      console.error('Ошибка загрузки ресурсов:', err);
      throw err;
    }
  };

  // Импорт roadmap
  const importRoadmap = async (roadmapData) => {
    try {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTechnologies = roadmapData.map(tech => ({
        ...tech,
        id: Date.now() + Math.random(),
        status: 'not-started',
        notes: ''
      }));
      
      setTechnologies(prev => [...prev, ...newTechnologies]);
      
      return newTechnologies;
    } catch (err) {
      setError('Ошибка импорта дорожной карты');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Локальные операции (обновление статуса, заметок)
  const updateStatus = (techId, newStatus) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, status: newStatus } : tech
      )
    );
  };

  const updateNotes = (techId, newNotes) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  const markAllAsCompleted = () => {
    setTechnologies(prev =>
      prev.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  const resetAllStatuses = () => {
    setTechnologies(prev =>
      prev.map(tech => ({ ...tech, status: 'not-started' }))
    );
  };

  // Вычисление прогресса
  const calculateProgress = () => {
    if (technologies.length === 0) return 0;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / technologies.length) * 100);
  };

  // Статистика
  const getStats = () => {
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;
    const notStarted = technologies.filter(tech => tech.status === 'not-started').length;
    
    const categories = technologies.map(tech => tech.category);
    const categoryCount = categories.reduce((acc, category) => {
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    
    const favoriteCategory = Object.keys(categoryCount).reduce((a, b) => 
      categoryCount[a] > categoryCount[b] ? a : 'Нет данных'
    , 'Нет данных');

    return {
      total: technologies.length,
      completed,
      inProgress,
      notStarted,
      favoriteCategory,
      completionRate: calculateProgress()
    };
  };

  return {
    technologies,
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
    progress: calculateProgress(),
    stats: getStats()
  };
}

export default useTechnologiesApi;