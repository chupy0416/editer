import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Plus, Trash2, Copy, Download, Upload, FileText, Image as ImageIcon, 
  Square, Circle, Type, ArrowRight, Star, ChevronLeft, ChevronRight, 
  ZoomIn, ZoomOut, RotateCcw, Undo2, Redo2, AlignLeft, AlignCenter, 
  AlignRight, AlignJustify, Bold, Italic, Underline, Strikethrough, Layout, 
  Palette, Sparkles, X, Maximize2, Layers, Move, ArrowUp, ArrowDown, 
  Grid, Eye, HelpCircle, Heart, MessageSquare, Shield, Box, Database, 
  Smile, Sun, Moon, Grid3X3, Sliders, ChevronDown
} from 'lucide-react';

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
};

const DEFAULT_SLIDE_WIDTH = 960;
const DEFAULT_SLIDE_HEIGHT = 540;

const THEMES = [
  { name: 'Minimalist Light', bgType: 'solid', bgColor: '#ffffff', textColor: '#0f172a', accentColor: '#3b82f6' },
  { name: 'Modern Dark', bgType: 'solid', bgColor: '#0f172a', textColor: '#f8fafc', accentColor: '#818cf8' },
  { name: 'Corporate Blue', bgType: 'gradient', bgGradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', textColor: '#ffffff', accentColor: '#38bdf8' },
  { name: 'Pastel Sunset', bgType: 'gradient', bgGradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', textColor: '#1e293b', accentColor: '#e11d48' },
  { name: 'Creative Neon', bgType: 'gradient', bgGradient: 'linear-gradient(135deg, #130cb7 0%, #52e5e7 100%)', textColor: '#ffffff', accentColor: '#f43f5e' }
];

const SHAPE_CATALOG = [
  { id: 'rect', label: '직사각형', category: '기본 도형' },
  { id: 'rounded-rect', label: '둥근 직사각형', category: '기본 도형' },
  { id: 'circle', label: '원 / 타원', category: '기본 도형' },
  { id: 'triangle', label: '삼각형', category: '기본 도형' },
  { id: 'right-triangle', label: '직각 삼각형', category: '기본 도형' },
  { id: 'diamond', label: '마름모', category: '기본 도형' },
  { id: 'parallelogram', label: '평행사변형', category: '기본 도형' },
  { id: 'pentagon', label: '오각형', category: '기본 도형' },
  { id: 'hexagon', label: '육각형', category: '기본 도형' },
  { id: 'octagon', label: '팔각형', category: '기본 도형' },
  { id: 'star', label: '별', category: '기본 도형' },
  { id: 'heart', label: '하트', category: '기본 도형' },

  { id: 'arrow-right', label: '오른쪽 화살표', category: '화살표 & 말풍선' },
  { id: 'arrow-left', label: '왼쪽 화살표', category: '화살표 & 말풍선' },
  { id: 'arrow-up-down', label: '양방향 화살표', category: '화살표 & 말풍선' },
  { id: 'speech-bubble', label: '말풍선', category: '화살표 & 말풍선' },
  { id: 'thought-bubble', label: '생각 말풍선', category: '화살표 & 말풍선' },
  { id: 'ribbon', label: '리본 / 배너', category: '화살표 & 말풍선' },

  { id: 'process-pill', label: '프로세스 알약', category: '플로우차트' },
  { id: 'cylinder', label: '원통 / 데이터베이스', category: '플로우차트' },
  { id: 'cube', label: '큐브', category: '플로우차트' }
];

export default function App() {
  const [libsLoaded, setLibsLoaded] = useState(false);
  const [slides, setSlides] = useState([
    {
      id: 'slide-1',
      bgType: 'gradient',
      bgColor: '#ffffff',
      bgGradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      elements: [
        {
          id: 'el-title-1',
          type: 'text',
          x: 100,
          y: 160,
          width: 760,
          height: 100,
          text: '웹 프레젠테이션 빌더',
          fontSize: 48,
          fontFamily: 'Inter',
          color: '#ffffff',
          bold: true,
          italic: false,
          underline: false,
          strikethrough: false,
          align: 'center',
          bgColor: 'transparent',
          lineHeight: 1.2,
          letterSpacing: 0,
          opacity: 1,
          shadow: true,
          rotation: 0
        },
        {
          id: 'el-sub-1',
          type: 'text',
          x: 160,
          y: 280,
          width: 640,
          height: 60,
          text: 'PowerPoint 스타일의 디자인, 도형 및 내보내기 도구',
          fontSize: 22,
          fontFamily: 'Inter',
          color: '#38bdf8',
          bold: false,
          italic: false,
          underline: false,
          strikethrough: false,
          align: 'center',
          bgColor: 'transparent',
          lineHeight: 1.4,
          letterSpacing: 1,
          opacity: 1,
          shadow: false,
          rotation: 0
        },
        {
          id: 'el-star-1',
          type: 'shape',
          shapeType: 'star',
          x: 430,
          y: 370,
          width: 100,
          height: 100,
          fillColor: '#f59e0b',
          borderColor: '#ffffff',
          borderWidth: 2,
          borderStyle: 'solid',
          opacity: 1,
          shadow: true,
          rotation: 0
        }
      ]
    }
  ]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [shapeMenuOpen, setShapeMenuOpen] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);
  const [presentationSlideIndex, setPresentationSlideIndex] = useState(0);
  const [laserPointer, setLaserPointer] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: 0, y: 0 });

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialElementPos, setInitialElementPos] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    Promise.all([
      loadScript('https://cdn.jsdelivr.net/gh/gitbrent/pptxgenjs@3.12.0/dist/pptxgen.bundle.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
    ])
      .then(() => setLibsLoaded(true))
      .catch((err) => console.error('External libraries failed to load:', err));
  }, []);

  const pushHistory = useCallback((newSlides) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(JSON.parse(JSON.stringify(newSlides)));
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  }, [history, historyIndex]);

  useEffect(() => {
    if (history.length === 0 && slides.length > 0) {
      setHistory([JSON.parse(JSON.stringify(slides))]);
      setHistoryIndex(0);
    }
  }, []);

  const currentSlide = slides[currentSlideIndex] || slides[0] || { elements: [] };
  const selectedElement = currentSlide?.elements?.find(el => el.id === selectedElementId);

  const updateCurrentSlideElements = (newElements, recordHistory = true) => {
    const updatedSlides = slides.map((slide, idx) => {
      if (idx === currentSlideIndex) {
        return { ...slide, elements: newElements };
      }
      return slide;
    });
    setSlides(updatedSlides);
    if (recordHistory) pushHistory(updatedSlides);
  };

  const updateCurrentSlideProps = (props) => {
    const updatedSlides = slides.map((slide, idx) => {
      if (idx === currentSlideIndex) {
        return { ...slide, ...props };
      }
      return slide;
    });
    setSlides(updatedSlides);
    pushHistory(updatedSlides);
  };

  const updateSelectedElement = (key, value) => {
    if (!selectedElementId) return;
    const newElements = currentSlide.elements.map(el => {
      if (el.id === selectedElementId) {
        return { ...el, [key]: value };
      }
      return el;
    });
    updateCurrentSlideElements(newElements);
  };

  const deleteSelectedElement = () => {
    if (!selectedElementId) return;
    const newElements = currentSlide.elements.filter(el => el.id !== selectedElementId);
    updateCurrentSlideElements(newElements);
    setSelectedElementId(null);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setSlides(JSON.parse(JSON.stringify(history[prevIndex])));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setSlides(JSON.parse(JSON.stringify(history[nextIndex])));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isPresenting) {
        if (e.key === 'ArrowRight' || e.key === 'Space') {
          setPresentationSlideIndex(prev => Math.min(prev + 1, slides.length - 1));
        } else if (e.key === 'ArrowLeft') {
          setPresentationSlideIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Escape') {
          setIsPresenting(false);
        }
        return;
      }

      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementId) {
          e.preventDefault();
          deleteSelectedElement();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresenting, selectedElementId, slides.length, historyIndex, history]);

  const addSlide = (layout = 'blank') => {
    let elements = [];
    if (layout === 'title') {
      elements = [
        {
          id: `el-${Date.now()}-1`,
          type: 'text',
          x: 120,
          y: 180,
          width: 720,
          height: 80,
          text: '슬라이드 제목 입력',
          fontSize: 40,
          fontFamily: 'Inter',
          color: '#0f172a',
          bold: true,
          align: 'center',
          bgColor: 'transparent',
          rotation: 0
        },
        {
          id: `el-${Date.now()}-2`,
          type: 'text',
          x: 180,
          y: 280,
          width: 600,
          height: 60,
          text: '부제목을 이곳에 작성하세요',
          fontSize: 20,
          fontFamily: 'Inter',
          color: '#64748b',
          align: 'center',
          bgColor: 'transparent',
          rotation: 0
        }
      ];
    } else if (layout === 'content') {
      elements = [
        {
          id: `el-${Date.now()}-1`,
          type: 'text',
          x: 60,
          y: 50,
          width: 840,
          height: 60,
          text: '주요 내용 제목',
          fontSize: 32,
          fontFamily: 'Inter',
          color: '#0f172a',
          bold: true,
          align: 'left',
          bgColor: 'transparent',
          rotation: 0
        },
        {
          id: `el-${Date.now()}-2`,
          type: 'text',
          x: 60,
          y: 130,
          width: 840,
          height: 350,
          text: '• 핵심 핵심 내용을 작성하세요.\n• 세부 설명 포인트를 개단식으로 나열합니다.\n• 발표 시 가독성을 높일 수 있습니다.',
          fontSize: 20,
          fontFamily: 'Inter',
          color: '#334155',
          align: 'left',
          bgColor: 'transparent',
          lineHeight: 1.6,
          rotation: 0
        }
      ];
    } else if (layout === 'two-column') {
      elements = [
        {
          id: `el-${Date.now()}-1`,
          type: 'text',
          x: 60,
          y: 50,
          width: 840,
          height: 60,
          text: '2단 비교 구성',
          fontSize: 32,
          fontFamily: 'Inter',
          color: '#0f172a',
          bold: true,
          align: 'left',
          bgColor: 'transparent',
          rotation: 0
        },
        {
          id: `el-${Date.now()}-2`,
          type: 'text',
          x: 60,
          y: 130,
          width: 400,
          height: 350,
          text: '좌측 파트\n- 특징 1\n- 특징 2\n- 특징 3',
          fontSize: 18,
          fontFamily: 'Inter',
          color: '#334155',
          align: 'left',
          bgColor: '#f8fafc',
          rotation: 0
        },
        {
          id: `el-${Date.now()}-3`,
          type: 'text',
          x: 500,
          y: 130,
          width: 400,
          height: 350,
          text: '우측 파트\n- 장점 A\n- 장점 B\n- 장점 C',
          fontSize: 18,
          fontFamily: 'Inter',
          color: '#334155',
          align: 'left',
          bgColor: '#f8fafc',
          rotation: 0
        }
      ];
    } else if (layout === 'quote') {
      elements = [
        {
          id: `el-${Date.now()}-1`,
          type: 'text',
          x: 100,
          y: 180,
          width: 760,
          height: 140,
          text: '"디자인은 단순히 어떻게 보이고 느끼는지에 대한 것이 아닙니다.\n디자인은 어떻게 기능하는지에 대한 것입니다."',
          fontSize: 26,
          fontFamily: 'Inter',
          color: '#4f46e5',
          bold: true,
          italic: true,
          align: 'center',
          bgColor: 'transparent',
          rotation: 0
        },
        {
          id: `el-${Date.now()}-2`,
          type: 'text',
          x: 280,
          y: 350,
          width: 400,
          height: 40,
          text: '- 스티브 잡스 (Steve Jobs)',
          fontSize: 18,
          fontFamily: 'Inter',
          color: '#64748b',
          align: 'center',
          bgColor: 'transparent',
          rotation: 0
        }
      ];
    }

    const newSlide = {
      id: `slide-${Date.now()}`,
      bgType: 'solid',
      bgColor: '#ffffff',
      bgGradient: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
      elements
    };

    const newSlides = [...slides];
    newSlides.splice(currentSlideIndex + 1, 0, newSlide);
    setSlides(newSlides);
    setCurrentSlideIndex(currentSlideIndex + 1);
    setSelectedElementId(null);
    pushHistory(newSlides);
  };

  const duplicateSlide = () => {
    const copy = JSON.parse(JSON.stringify(currentSlide));
    copy.id = `slide-${Date.now()}`;
    const newSlides = [...slides];
    newSlides.splice(currentSlideIndex + 1, 0, copy);
    setSlides(newSlides);
    setCurrentSlideIndex(currentSlideIndex + 1);
    pushHistory(newSlides);
  };

  const deleteSlide = (indexToDelete) => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((_, idx) => idx !== indexToDelete);
    setSlides(newSlides);
    const nextIdx = Math.min(currentSlideIndex, newSlides.length - 1);
    setCurrentSlideIndex(nextIdx);
    setSelectedElementId(null);
    pushHistory(newSlides);
  };

  const reorderSlides = (from, to) => {
    if (to < 0 || to >= slides.length) return;
    const newSlides = [...slides];
    const [moved] = newSlides.splice(from, 1);
    newSlides.splice(to, 0, moved);
    setSlides(newSlides);
    setCurrentSlideIndex(to);
    pushHistory(newSlides);
  };

  const applyTheme = (theme) => {
    const updatedSlides = slides.map((slide, idx) => {
      if (idx === currentSlideIndex) {
        return {
          ...slide,
          bgType: theme.bgType,
          bgColor: theme.bgColor || '#ffffff',
          bgGradient: theme.bgGradient || ''
        };
      }
      return slide;
    });
    setSlides(updatedSlides);
    pushHistory(updatedSlides);
  };

  const addTextElement = () => {
    const newEl = {
      id: `el-${Date.now()}`,
      type: 'text',
      x: DEFAULT_SLIDE_WIDTH / 2 - 150,
      y: DEFAULT_SLIDE_HEIGHT / 2 - 30,
      width: 300,
      height: 60,
      text: '텍스트를 입력하세요',
      fontSize: 24,
      fontFamily: 'Inter',
      color: '#0f172a',
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      align: 'left',
      bgColor: 'transparent',
      lineHeight: 1.4,
      letterSpacing: 0,
      opacity: 1,
      shadow: false,
      rotation: 0
    };
    updateCurrentSlideElements([...currentSlide.elements, newEl]);
    setSelectedElementId(newEl.id);
  };

  const addShapeElement = (shapeType) => {
    const newEl = {
      id: `el-${Date.now()}`,
      type: 'shape',
      shapeType,
      x: DEFAULT_SLIDE_WIDTH / 2 - 75,
      y: DEFAULT_SLIDE_HEIGHT / 2 - 75,
      width: 150,
      height: 150,
      fillColor: '#3b82f6',
      borderColor: '#1d4ed8',
      borderWidth: 2,
      borderStyle: 'solid',
      opacity: 1,
      shadow: false,
      rotation: 0
    };
    updateCurrentSlideElements([...currentSlide.elements, newEl]);
    setSelectedElementId(newEl.id);
    setShapeMenuOpen(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > 400) {
          h = (400 / w) * h;
          w = 400;
        }

        const newEl = {
          id: `el-${Date.now()}`,
          type: 'image',
          src: event.target.result,
          x: DEFAULT_SLIDE_WIDTH / 2 - w / 2,
          y: DEFAULT_SLIDE_HEIGHT / 2 - h / 2,
          width: Math.round(w),
          height: Math.round(h),
          opacity: 1,
          shadow: false,
          rotation: 0
        };
        updateCurrentSlideElements([...currentSlide.elements, newEl]);
        setSelectedElementId(newEl.id);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const moveLayer = (direction) => {
    if (!selectedElementId) return;
    const index = currentSlide.elements.findIndex(el => el.id === selectedElementId);
    if (index === -1) return;

    const newElements = [...currentSlide.elements];
    const [moved] = newElements.splice(index, 1);

    if (direction === 'front') newElements.push(moved);
    else if (direction === 'back') newElements.unshift(moved);
    else if (direction === 'forward') newElements.splice(Math.min(index + 1, newElements.length), 0, moved);
    else if (direction === 'backward') newElements.splice(Math.max(index - 1, 0), 0, moved);

    updateCurrentSlideElements(newElements);
  };

  const alignElement = (position) => {
    if (!selectedElementId || !selectedElement) return;

    let newX = selectedElement.x;
    let newY = selectedElement.y;

    if (position === 'left') newX = 20;
    else if (position === 'center') newX = (DEFAULT_SLIDE_WIDTH - selectedElement.width) / 2;
    else if (position === 'right') newX = DEFAULT_SLIDE_WIDTH - selectedElement.width - 20;
    else if (position === 'top') newY = 20;
    else if (position === 'middle') newY = (DEFAULT_SLIDE_HEIGHT - selectedElement.height) / 2;
    else if (position === 'bottom') newY = DEFAULT_SLIDE_HEIGHT - selectedElement.height - 20;

    const newElements = currentSlide.elements.map(el => {
      if (el.id === selectedElementId) {
        return { ...el, x: Math.round(newX), y: Math.round(newY) };
      }
      return el;
    });
    updateCurrentSlideElements(newElements);
  };

  const handleMouseDown = (e, element, handle = null) => {
    e.stopPropagation();
    setSelectedElementId(element.id);

    if (handle) {
      setIsResizing(true);
      setResizeHandle(handle);
    } else {
      setIsDragging(true);
    }

    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialElementPos({
      x: element.x,
      y: element.y,
      w: element.width,
      h: element.height
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging && !isResizing) return;
    if (!selectedElement) return;

    const dx = (e.clientX - dragStart.x) / zoom;
    const dy = (e.clientY - dragStart.y) / zoom;

    if (isDragging) {
      const newX = Math.round(initialElementPos.x + dx);
      const newY = Math.round(initialElementPos.y + dy);
      
      const newElements = currentSlide.elements.map(el => {
        if (el.id === selectedElement.id) {
          return { ...el, x: newX, y: newY };
        }
        return el;
      });
      updateCurrentSlideElements(newElements, false);
    } else if (isResizing) {
      let newW = initialElementPos.w;
      let newH = initialElementPos.h;
      let newX = initialElementPos.x;
      let newY = initialElementPos.y;

      if (resizeHandle.includes('e')) newW = Math.max(30, initialElementPos.w + dx);
      if (resizeHandle.includes('s')) newH = Math.max(30, initialElementPos.h + dy);
      if (resizeHandle.includes('w')) {
        const potentialW = initialElementPos.w - dx;
        if (potentialW > 30) {
          newW = potentialW;
          newX = initialElementPos.x + dx;
        }
      }
      if (resizeHandle.includes('n')) {
        const potentialH = initialElementPos.h - dy;
        if (potentialH > 30) {
          newH = potentialH;
          newY = initialElementPos.y + dy;
        }
      }

      const newElements = currentSlide.elements.map(el => {
        if (el.id === selectedElement.id) {
          return { 
            ...el, 
            x: Math.round(newX), 
            y: Math.round(newY), 
            width: Math.round(newW), 
            height: Math.round(newH) 
          };
        }
        return el;
      });
      updateCurrentSlideElements(newElements, false);
    }
  };

  const handleMouseUp = () => {
    if (isDragging || isResizing) {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
      pushHistory(slides);
    }
  };

  const exportToPPTX = () => {
    if (!window.PptxGenJS) {
      alert('PPTX export library is loading. Please try again in a few seconds.');
      return;
    }

    const pptx = new window.PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';

    slides.forEach((slide) => {
      const pptSlide = pptx.addSlide();

      if (slide.bgType === 'solid') {
        pptSlide.background = { color: slide.bgColor.replace('#', '') };
      } else {
        pptSlide.background = { color: 'F1F5F9' };
      }

      slide.elements.forEach((el) => {
        const scale = 10 / DEFAULT_SLIDE_WIDTH;
        const x = el.x * scale;
        const y = el.y * scale;
        const w = el.width * scale;
        const h = el.height * scale;

        if (el.type === 'text') {
          pptSlide.addText(el.text, {
            x, y, w, h,
            fontSize: el.fontSize * 0.75,
            fontFace: el.fontFamily,
            color: el.color.replace('#', ''),
            bold: el.bold,
            italic: el.italic,
            underline: el.underline,
            align: el.align,
            fill: el.bgColor !== 'transparent' ? { color: el.bgColor.replace('#', '') } : undefined
          });
        } else if (el.type === 'shape') {
          let shapeType = pptx.ShapeType.rect;
          if (el.shapeType === 'circle') shapeType = pptx.ShapeType.ellipse;
          if (el.shapeType === 'triangle') shapeType = pptx.ShapeType.triangle;
          if (el.shapeType === 'diamond') shapeType = pptx.ShapeType.diamond;
          if (el.shapeType === 'star') shapeType = pptx.ShapeType.star5;
          if (el.shapeType === 'arrow-right') shapeType = pptx.ShapeType.rightArrow;

          pptSlide.addShape(shapeType, {
            x, y, w, h,
            fill: { color: el.fillColor.replace('#', '') },
            line: { color: el.borderColor.replace('#', ''), width: el.borderWidth }
          });
        } else if (el.type === 'image') {
          pptSlide.addImage({
            data: el.src,
            x, y, w, h
          });
        }
      });
    });

    pptx.writeFile({ fileName: `presentation_${Date.now()}.pptx` });
  };

  const exportToPDF = async () => {
    if (!window.jspdf || !window.html2canvas) {
      alert('PDF export libraries are loading. Please try again.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [DEFAULT_SLIDE_WIDTH, DEFAULT_SLIDE_HEIGHT]
    });

    const activeSlideBackup = currentSlideIndex;

    for (let i = 0; i < slides.length; i++) {
      setCurrentSlideIndex(i);
      await new Promise(r => setTimeout(r, 150));

      if (canvasRef.current) {
        const canvas = await window.html2canvas(canvasRef.current, {
          scale: 2,
          useCORS: true,
          logging: false
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) pdf.addPage([DEFAULT_SLIDE_WIDTH, DEFAULT_SLIDE_HEIGHT], 'landscape');
        pdf.addImage(imgData, 'JPEG', 0, 0, DEFAULT_SLIDE_WIDTH, DEFAULT_SLIDE_HEIGHT);
      }
    }

    setCurrentSlideIndex(activeSlideBackup);
    pdf.save(`presentation_${Date.now()}.pdf`);
  };

  const saveProjectJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(slides, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `slide_project_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const loadProjectJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const loadedSlides = JSON.parse(event.target.result);
        if (Array.isArray(loadedSlides)) {
          setSlides(loadedSlides);
          setCurrentSlideIndex(0);
          setSelectedElementId(null);
          pushHistory(loadedSlides);
        } else {
          alert('올바르지 않은 프레젠테이션 파일입니다.');
        }
      } catch (err) {
        alert('JSON 파일 해석 실패.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const renderShapeSvg = (element) => {
    const fill = element.fillColor;
    const stroke = element.borderColor;
    const strokeWidth = element.borderWidth;
    const strokeDasharray = element.borderStyle === 'dashed' ? '6 4' : element.borderStyle === 'dotted' ? '2 3' : 'none';

    switch (element.shapeType) {
      case 'circle':
        return <ellipse cx="50%" cy="50%" rx="48%" ry="48%" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />;
      case 'rounded-rect':
        return <rect x="2%" y="2%" width="96%" height="96%" rx="16" ry="16" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />;
      case 'triangle':
        return <polygon points="50,2 98,98 2,98" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />;
      case 'right-triangle':
        return <polygon points="2,2 98,98 2,98" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />;
      case 'diamond':
        return <polygon points="50,2 98,50 50,98 2,50" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />;
      case 'parallelogram':
        return <polygon points="25,2 98,2 75,98 2,98" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />;
      case 'pentagon':
        return <polygon points="50,2 98,38 80,98 20,98 2,38" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />;
      case 'hexagon':
        return <polygon points="25,2 75,2 98,50 75,98 25,98 2,50" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />;
      case 'octagon':
        return <polygon points="30,2 70,2 98,30 98,70 70,98 30,98 2,70 2,30" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />;
      case 'star':
        return <polygon points="50,2 64,34 98,38 72,61 80,95 50,76 20,95 28,61 2,38 36,34" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />;
      case 'heart':
        return <path d="M50 88 C20 60, 2 40, 15 20 C25 5, 42 12, 50 25 C58 12, 75 5, 85 20 C98 40, 80 60, 50 88 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />;
      case 'arrow-right':
        return <polygon points="2,35 60,35 60,15 98,50 60,85 60,65 2,65" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />;
      case 'arrow-left':
        return <polygon points="98,35 40,35 40,15 2,50 40,85 40,65 98,65" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />;
      case 'arrow-up-down':
        return <polygon points="35,40 15,40 50,2 85,40 65,40 65,60 85,60 50,98 15,60 35,60" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />;
      case 'speech-bubble':
        return <path d="M5,10 Q5,5 10,5 L90,5 Q95,5 95,10 L95,65 Q95,70 90,70 L30,70 L10,90 L15,70 L10,70 Q5,70 5,65 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />;
      case 'thought-bubble':
        return <path d="M 20 50 A 20 20 0 0 1 40 20 A 25 25 0 0 1 80 30 A 20 20 0 0 1 90 60 A 20 20 0 0 1 60 85 A 20 20 0 0 1 30 80 A 15 15 0 0 1 20 50 Z M 20 90 A 5 5 0 1 1 20 80 A 5 5 0 1 1 20 90 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />;
      case 'ribbon':
        return <polygon points="2,15 20,50 2,85 98,85 80,50 98,15" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />;
      case 'process-pill':
        return <rect x="2%" y="2%" width="96%" height="96%" rx="45" ry="45" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />;
      case 'cylinder':
        return <path d="M 5,20 A 45,15 0 0,0 95,20 L 95,80 A 45,15 0 0,1 5,80 Z M 5,20 A 45,15 0 0,1 95,20 A 45,15 0 0,1 5,20 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />;
      case 'cube':
        return <polygon points="25,2 75,2 98,25 98,75 75,98 25,98 2,75 2,25" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />;
      case 'rect':
      default:
        return <rect x="2%" y="2%" width="96%" height="96%" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-900 text-slate-100 select-none overflow-hidden font-sans">
      
      {/* TOP HEADER */}
      <header className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 z-20 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center gap-2 font-bold text-lg text-indigo-400">
            <Sparkles className="w-6 h-6 text-indigo-500" />
            <span>Slide Craft Pro</span>
          </div>
          <span className="text-[11px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800 font-mono">PPT Web Studio</span>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center space-x-1 bg-slate-850 p-1 rounded-lg border border-slate-700">
          <button 
            onClick={addTextElement}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium hover:bg-slate-700 rounded transition text-slate-200"
          >
            <Type className="w-4 h-4 text-sky-400" />
            <span>텍스트</span>
          </button>
          <div className="h-4 w-[1px] bg-slate-700 mx-1" />
          
          <button 
            onClick={() => imageInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium hover:bg-slate-700 rounded transition text-slate-200"
          >
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <span>이미지</span>
          </button>
          <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          <div className="h-4 w-[1px] bg-slate-700 mx-1" />

          {/* Expanded Shape Library Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShapeMenuOpen(!shapeMenuOpen)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium hover:bg-slate-700 rounded transition text-amber-400"
            >
              <Square className="w-4 h-4" />
              <span>도형 목록</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {shapeMenuOpen && (
              <div className="absolute top-10 left-0 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-3 z-50 grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {['기본 도형', '화살표 & 말풍선', '플로우차트'].map(category => (
                  <div key={category} className="col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{category}</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {SHAPE_CATALOG.filter(s => s.category === category).map(shape => (
                        <button
                          key={shape.id}
                          onClick={() => addShapeElement(shape.id)}
                          className="flex items-center gap-2 p-1.5 text-xs text-slate-200 hover:bg-slate-700 rounded border border-slate-700 hover:border-indigo-500 text-left transition truncate"
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shrink-0" />
                          <span className="truncate">{shape.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Undo/Redo & Present & Export */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleUndo} 
            disabled={historyIndex <= 0}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 rounded transition"
            title="실행 취소 (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button 
            onClick={handleRedo} 
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 rounded transition"
            title="다시 실행 (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-slate-700 mx-1" />

          <button 
            onClick={() => {
              setPresentationSlideIndex(currentSlideIndex);
              setIsPresenting(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold shadow transition"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>슬라이드 쇼</span>
          </button>

          {/* Export Dropdown / Buttons */}
          <div className="flex items-center space-x-1 border-l border-slate-700 pl-2">
            <button
              onClick={exportToPPTX}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 rounded text-slate-200 transition"
              title="PPTX 로 내보내기"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PPTX</span>
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 rounded text-slate-200 transition"
              title="PDF 로 저장"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
            <button
              onClick={saveProjectJSON}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded"
              title="프로젝트 저장 (JSON)"
            >
              <Download className="w-4 h-4 text-sky-400" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded"
              title="프로젝트 불러오기 (JSON)"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
            </button>
            <input type="file" ref={fileInputRef} onChange={loadProjectJSON} accept=".json" className="hidden" />
          </div>
        </div>
      </header>

      {/* SECONDARY TOOLBAR: FORMATTING & LAYERS */}
      {selectedElement && (
        <div className="h-10 bg-slate-850 border-b border-slate-700 flex items-center px-4 space-x-3 text-xs z-10 shrink-0 overflow-x-auto">
          {selectedElement.type === 'text' && (
            <>
              <select
                value={selectedElement.fontFamily}
                onChange={(e) => updateSelectedElement('fontFamily', e.target.value)}
                className="bg-slate-700 text-slate-200 border border-slate-600 rounded px-2 py-1 focus:outline-none"
              >
                <option value="Inter">Inter</option>
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
              </select>

              <input
                type="number"
                value={selectedElement.fontSize}
                onChange={(e) => updateSelectedElement('fontSize', Number(e.target.value))}
                className="w-14 bg-slate-700 text-slate-200 border border-slate-600 rounded px-2 py-1 focus:outline-none"
                min="8" max="120"
              />

              <div className="h-4 w-[1px] bg-slate-700" />

              <button
                onClick={() => updateSelectedElement('bold', !selectedElement.bold)}
                className={`p-1 rounded ${selectedElement.bold ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => updateSelectedElement('italic', !selectedElement.italic)}
                className={`p-1 rounded ${selectedElement.italic ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => updateSelectedElement('underline', !selectedElement.underline)}
                className={`p-1 rounded ${selectedElement.underline ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
              >
                <Underline className="w-3.5 h-3.5" />
              </button>

              <div className="h-4 w-[1px] bg-slate-700" />

              <button
                onClick={() => updateSelectedElement('align', 'left')}
                className={`p-1 rounded ${selectedElement.align === 'left' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => updateSelectedElement('align', 'center')}
                className={`p-1 rounded ${selectedElement.align === 'center' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => updateSelectedElement('align', 'right')}
                className={`p-1 rounded ${selectedElement.align === 'right' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>

              <div className="h-4 w-[1px] bg-slate-700" />

              <div className="flex items-center space-x-1">
                <span>글자색:</span>
                <input
                  type="color"
                  value={selectedElement.color}
                  onChange={(e) => updateSelectedElement('color', e.target.value)}
                  className="w-6 h-6 border-0 bg-transparent cursor-pointer"
                />
              </div>

              <div className="flex items-center space-x-1">
                <span>배경색:</span>
                <input
                  type="color"
                  value={selectedElement.bgColor === 'transparent' ? '#ffffff' : selectedElement.bgColor}
                  onChange={(e) => updateSelectedElement('bgColor', e.target.value)}
                  className="w-6 h-6 border-0 bg-transparent cursor-pointer"
                />
                <button
                  onClick={() => updateSelectedElement('bgColor', 'transparent')}
                  className="text-[10px] text-slate-400 hover:text-white underline"
                >
                  투명
                </button>
              </div>
            </>
          )}

          {selectedElement.type === 'shape' && (
            <>
              <div className="flex items-center space-x-1">
                <span>채우기:</span>
                <input
                  type="color"
                  value={selectedElement.fillColor}
                  onChange={(e) => updateSelectedElement('fillColor', e.target.value)}
                  className="w-6 h-6 border-0 bg-transparent cursor-pointer"
                />
              </div>

              <div className="flex items-center space-x-1">
                <span>테두리:</span>
                <input
                  type="color"
                  value={selectedElement.borderColor}
                  onChange={(e) => updateSelectedElement('borderColor', e.target.value)}
                  className="w-6 h-6 border-0 bg-transparent cursor-pointer"
                />
              </div>

              <div className="flex items-center space-x-1">
                <span>두께:</span>
                <input
                  type="number"
                  value={selectedElement.borderWidth}
                  onChange={(e) => updateSelectedElement('borderWidth', Number(e.target.value))}
                  className="w-12 bg-slate-700 text-slate-200 border border-slate-600 rounded px-1 py-0.5 focus:outline-none"
                  min="0" max="20"
                />
              </div>

              <div className="flex items-center space-x-1">
                <span>선 스타일:</span>
                <select
                  value={selectedElement.borderStyle || 'solid'}
                  onChange={(e) => updateSelectedElement('borderStyle', e.target.value)}
                  className="bg-slate-700 text-slate-200 border border-slate-600 rounded px-1 py-0.5 focus:outline-none"
                >
                  <option value="solid">실선</option>
                  <option value="dashed">점선 (Dash)</option>
                  <option value="dotted">점선 (Dot)</option>
                </select>
              </div>
            </>
          )}

          <div className="h-4 w-[1px] bg-slate-700" />

          {/* Layer & Alignment Tools */}
          <div className="flex items-center space-x-1">
            <button onClick={() => moveLayer('front')} className="p-1 hover:bg-slate-700 rounded" title="맨 앞으로 보내기">
              <ArrowUp className="w-3.5 h-3.5 text-indigo-400" />
            </button>
            <button onClick={() => moveLayer('back')} className="p-1 hover:bg-slate-700 rounded" title="맨 뒤로 보내기">
              <ArrowDown className="w-3.5 h-3.5 text-indigo-400" />
            </button>
          </div>

          <div className="h-4 w-[1px] bg-slate-700" />

          <button
            onClick={deleteSelectedElement}
            className="flex items-center gap-1 text-rose-400 hover:text-rose-300 ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>삭제</span>
          </button>
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT SLIDE PANEL */}
        <div className="w-60 bg-slate-850 border-r border-slate-800 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">슬라이드 목록 ({slides.length})</span>
            <button 
              onClick={() => addSlide('blank')} 
              className="p-1 hover:bg-slate-700 rounded text-slate-300"
              title="새 빈 슬라이드 추가"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Layout Presets */}
          <div className="p-2 border-b border-slate-800 grid grid-cols-2 gap-1 text-[11px]">
            <button onClick={() => addSlide('title')} className="px-2 py-1 bg-slate-700 hover:bg-slate-650 rounded text-slate-300 truncate text-center">제목 슬라이드</button>
            <button onClick={() => addSlide('content')} className="px-2 py-1 bg-slate-700 hover:bg-slate-650 rounded text-slate-300 truncate text-center">내용 슬라이드</button>
            <button onClick={() => addSlide('two-column')} className="px-2 py-1 bg-slate-700 hover:bg-slate-650 rounded text-slate-300 truncate text-center">2단 비교</button>
            <button onClick={() => addSlide('quote')} className="px-2 py-1 bg-slate-700 hover:bg-slate-650 rounded text-slate-300 truncate text-center">명언 스타일</button>
          </div>

          {/* Slides List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {slides.map((slide, index) => {
              const isSelected = index === currentSlideIndex;
              return (
                <div
                  key={slide.id}
                  onClick={() => {
                    setCurrentSlideIndex(index);
                    setSelectedElementId(null);
                  }}
                  className={`group relative rounded-lg p-2 border-2 cursor-pointer transition ${
                    isSelected ? 'border-indigo-500 bg-indigo-950/30' : 'border-slate-700 hover:border-slate-500 bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-xs text-slate-400 font-mono">
                    <span>#{index + 1}</span>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1">
                      <button onClick={(e) => { e.stopPropagation(); reorderSlides(index, index - 1); }} disabled={index === 0} className="p-0.5 hover:bg-slate-700 rounded disabled:opacity-20">
                        <ChevronLeft className="w-3 h-3 rotate-90" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); reorderSlides(index, index + 1); }} disabled={index === slides.length - 1} className="p-0.5 hover:bg-slate-700 rounded disabled:opacity-20">
                        <ChevronRight className="w-3 h-3 rotate-90" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); deleteSlide(index); }} disabled={slides.length <= 1} className="p-0.5 hover:bg-slate-700 rounded text-rose-400 disabled:opacity-20">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* THUMBNAIL PREVIEW FIXED */}
                  <div 
                    className="w-full aspect-[16/9] rounded overflow-hidden relative shadow-inner border border-slate-700/50"
                    style={{
                      background: slide.bgType === 'solid' ? slide.bgColor : slide.bgGradient
                    }}
                  >
                    {slide.elements.map(el => (
                      <div
                        key={el.id}
                        className="absolute rounded-sm opacity-80"
                        style={{
                          left: `${(el.x / DEFAULT_SLIDE_WIDTH) * 100}%`,
                          top: `${(el.y / DEFAULT_SLIDE_HEIGHT) * 100}%`,
                          width: `${(el.width / DEFAULT_SLIDE_WIDTH) * 100}%`,
                          height: `${(el.height / DEFAULT_SLIDE_HEIGHT) * 100}%`,
                          backgroundColor: el.type === 'text' ? (el.bgColor !== 'transparent' ? el.bgColor : 'rgba(255,255,255,0.25)') : (el.fillColor || '#3b82f6')
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MAIN SLIDE CANVAS WORKSPACE */}
        <div 
          className="flex-1 bg-slate-950 flex flex-col justify-center items-center relative overflow-auto p-8"
          onClick={() => setSelectedElementId(null)}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Zoom & Grid Controls */}
          <div className="absolute bottom-4 right-4 bg-slate-800 border border-slate-700 rounded-lg p-1.5 flex items-center space-x-2 text-xs shadow-lg z-10">
            <button onClick={() => setShowGrid(!showGrid)} className={`p-1 rounded ${showGrid ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`} title="격자 가이드">
              <Grid className="w-4 h-4" />
            </button>
            <div className="h-4 w-[1px] bg-slate-700" />
            <button onClick={() => setZoom(prev => Math.max(0.4, prev - 0.1))} className="p-1 hover:bg-slate-700 rounded">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-mono">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(prev => Math.min(1.6, prev + 0.1))} className="p-1 hover:bg-slate-700 rounded">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={() => setZoom(1)} className="p-1 hover:bg-slate-700 rounded text-slate-400" title="화면 맞춤">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* MAIN CANVAS FIX: Render slide explicitly */}
          <div
            ref={canvasRef}
            className="shadow-2xl relative transition-transform origin-center border border-slate-700/50"
            style={{
              width: `${DEFAULT_SLIDE_WIDTH}px`,
              height: `${DEFAULT_SLIDE_HEIGHT}px`,
              transform: `scale(${zoom})`,
              background: currentSlide.bgType === 'solid' ? currentSlide.bgColor : currentSlide.bgGradient
            }}
          >
            {/* Grid Overlay */}
            {showGrid && (
              <div 
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />
            )}

            {/* Elements Rendering */}
            {currentSlide.elements?.map((element) => {
              const isSelected = element.id === selectedElementId;

              return (
                <div
                  key={element.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElementId(element.id);
                  }}
                  onMouseDown={(e) => handleMouseDown(e, element)}
                  className={`absolute cursor-move ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-transparent' : 'hover:ring-1 hover:ring-indigo-300/50'}`}
                  style={{
                    left: `${element.x}px`,
                    top: `${element.y}px`,
                    width: `${element.width}px`,
                    height: `${element.height}px`,
                    transform: `rotate(${element.rotation || 0}deg)`,
                    opacity: element.opacity ?? 1
                  }}
                >
                  {/* TEXT ELEMENT */}
                  {element.type === 'text' && (
                    <textarea
                      value={element.text}
                      onChange={(e) => updateSelectedElement('text', e.target.value)}
                      className="w-full h-full bg-transparent resize-none focus:outline-none border-none p-1 font-sans leading-normal"
                      style={{
                        fontSize: `${element.fontSize}px`,
                        fontFamily: element.fontFamily,
                        color: element.color,
                        fontWeight: element.bold ? 'bold' : 'normal',
                        fontStyle: element.italic ? 'italic' : 'normal',
                        textDecoration: `${element.underline ? 'underline' : ''} ${element.strikethrough ? 'line-through' : ''}`.trim(),
                        textAlign: element.align,
                        backgroundColor: element.bgColor,
                        lineHeight: element.lineHeight || 1.4,
                        letterSpacing: `${element.letterSpacing || 0}px`
                      }}
                    />
                  )}

                  {/* SHAPE ELEMENT */}
                  {element.type === 'shape' && (
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {renderShapeSvg(element)}
                    </svg>
                  )}

                  {/* IMAGE ELEMENT */}
                  {element.type === 'image' && (
                    <img 
                      src={element.src} 
                      alt="Element" 
                      className="w-full h-full object-cover rounded pointer-events-none" 
                    />
                  )}

                  {/* RESIZE HANDLES */}
                  {isSelected && (
                    <>
                      <div onMouseDown={(e) => handleMouseDown(e, element, 'nw')} className="w-3 h-3 bg-white border-2 border-indigo-600 absolute -top-1.5 -left-1.5 cursor-nwse-resize rounded-full z-20" />
                      <div onMouseDown={(e) => handleMouseDown(e, element, 'ne')} className="w-3 h-3 bg-white border-2 border-indigo-600 absolute -top-1.5 -right-1.5 cursor-nesw-resize rounded-full z-20" />
                      <div onMouseDown={(e) => handleMouseDown(e, element, 'sw')} className="w-3 h-3 bg-white border-2 border-indigo-600 absolute -bottom-1.5 -left-1.5 cursor-nesw-resize rounded-full z-20" />
                      <div onMouseDown={(e) => handleMouseDown(e, element, 'se')} className="w-3 h-3 bg-white border-2 border-indigo-600 absolute -bottom-1.5 -right-1.5 cursor-nwse-resize rounded-full z-20" />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDEBAR: THEMES & BACKGROUND */}
        <div className="w-64 bg-slate-850 border-l border-slate-800 flex flex-col shrink-0 p-4 overflow-y-auto">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-indigo-400" />
            <span>디자인 테마 선택</span>
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              {THEMES.map(theme => (
                <button
                  key={theme.name}
                  onClick={() => applyTheme(theme)}
                  className="w-full p-2.5 rounded-lg border border-slate-700 hover:border-indigo-500 text-left transition flex items-center justify-between"
                  style={{
                    background: theme.bgType === 'solid' ? theme.bgColor : theme.bgGradient
                  }}
                >
                  <span className="text-xs font-semibold" style={{ color: theme.textColor }}>{theme.name}</span>
                  <span className="w-3 h-3 rounded-full border border-white/40" style={{ backgroundColor: theme.accentColor }} />
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-slate-400 mb-2">슬라이드 배경 사용자 정의</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">채우기 유형</label>
                  <select
                    value={currentSlide.bgType}
                    onChange={(e) => updateCurrentSlideProps({ bgType: e.target.value })}
                    className="w-full bg-slate-700 text-slate-200 border border-slate-600 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                  >
                    <option value="solid">단색 (Solid Color)</option>
                    <option value="gradient">그라데이션 (Gradient)</option>
                  </select>
                </div>

                {currentSlide.bgType === 'solid' && (
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">배경 색상</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentSlide.bgColor || '#ffffff'}
                        onChange={(e) => updateCurrentSlideProps({ bgColor: e.target.value })}
                        className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <span className="text-xs font-mono text-slate-400">{currentSlide.bgColor}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN PRESENTATION MODE */}
      {isPresenting && (
        <div 
          className="fixed inset-0 bg-black z-50 flex items-center justify-center select-none cursor-crosshair overflow-hidden"
          onMouseMove={(e) => {
            if (laserPointer) {
              setLaserPos({ x: e.clientX, y: e.clientY });
            }
          }}
        >
          {laserPointer && (
            <div 
              className="fixed w-4 h-4 rounded-full bg-rose-500 shadow-[0_0_12px_#f43f5e] pointer-events-none z-50 transition-transform duration-75"
              style={{ left: `${laserPos.x - 8}px`, top: `${laserPos.y - 8}px` }}
            />
          )}

          <button
            onClick={() => setIsPresenting(false)}
            className="absolute top-4 right-4 text-white/50 hover:text-white p-2 rounded-full bg-black/40 backdrop-blur z-50 transition"
            title="슬라이드 쇼 종료 (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative shadow-2xl overflow-hidden"
            style={{
              width: `${DEFAULT_SLIDE_WIDTH}px`,
              height: `${DEFAULT_SLIDE_HEIGHT}px`,
              transform: `scale(${Math.min(window.innerWidth / DEFAULT_SLIDE_WIDTH, window.innerHeight / DEFAULT_SLIDE_HEIGHT) * 0.95})`,
              background: slides[presentationSlideIndex]?.bgType === 'solid' 
                ? slides[presentationSlideIndex]?.bgColor 
                : slides[presentationSlideIndex]?.bgGradient
            }}
          >
            {slides[presentationSlideIndex]?.elements.map((element) => (
              <div
                key={element.id}
                className="absolute"
                style={{
                  left: `${element.x}px`,
                  top: `${element.y}px`,
                  width: `${element.width}px`,
                  height: `${element.height}px`,
                  transform: `rotate(${element.rotation || 0}deg)`,
                  opacity: element.opacity ?? 1
                }}
              >
                {element.type === 'text' && (
                  <div
                    className="w-full h-full whitespace-pre-wrap font-sans p-1"
                    style={{
                      fontSize: `${element.fontSize}px`,
                      fontFamily: element.fontFamily,
                      color: element.color,
                      fontWeight: element.bold ? 'bold' : 'normal',
                      fontStyle: element.italic ? 'italic' : 'normal',
                      textDecoration: `${element.underline ? 'underline' : ''} ${element.strikethrough ? 'line-through' : ''}`.trim(),
                      textAlign: element.align,
                      backgroundColor: element.bgColor,
                      lineHeight: element.lineHeight || 1.4,
                      letterSpacing: `${element.letterSpacing || 0}px`
                    }}
                  >
                    {element.text}
                  </div>
                )}
                {element.type === 'shape' && (
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {renderShapeSvg(element)}
                  </svg>
                )}
                {element.type === 'image' && (
                  <img src={element.src} alt="" className="w-full h-full object-cover" />
                )}
              </div>
            ))}
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-black/60 backdrop-blur px-4 py-2 rounded-full border border-white/10 text-white text-xs">
            <button
              onClick={() => setPresentationSlideIndex(prev => Math.max(0, prev - 1))}
              disabled={presentationSlideIndex === 0}
              className="hover:text-indigo-400 disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-mono">
              {presentationSlideIndex + 1} / {slides.length}
            </span>
            <button
              onClick={() => setPresentationSlideIndex(prev => Math.min(slides.length - 1, prev + 1))}
              disabled={presentationSlideIndex === slides.length - 1}
              className="hover:text-indigo-400 disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="h-4 w-[1px] bg-white/20 mx-1" />
            <button
              onClick={() => setLaserPointer(!laserPointer)}
              className={`p-1 rounded ${laserPointer ? 'text-rose-400 bg-rose-950/50' : 'text-slate-400 hover:text-white'}`}
              title="레이저 포인터 온/오프"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}