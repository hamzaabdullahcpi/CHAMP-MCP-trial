import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  X,
  Move,
  Scan
} from 'lucide-react';
import { resolveAssetUrl, defaultArchitectureImage } from '../utils/assetUtils';

export interface SwedenArchitectureDiagramProps {
  customImageUrl?: string;
  customTitle?: string;
  onEnlarge?: () => void;
  onNavigateToAction?: (actionId: number) => void;
}

export default function SwedenArchitectureDiagram({ 
  customImageUrl, 
  customTitle = "Sweden’s Multilevel Climate Governance Architecture", 
  onEnlarge 
}: SwedenArchitectureDiagramProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalZoom, setModalZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [fitMode, setFitMode] = useState<'contain' | 'width'>('contain');
  const containerRef = useRef<HTMLDivElement>(null);

  // Default fallback diagram with proper deployment base URL resolution
  const imageSrc = resolveAssetUrl(customImageUrl, defaultArchitectureImage);

  const handleZoomIn = useCallback(() => setModalZoom(prev => Math.min(Number((prev + 0.25).toFixed(2)), 4.0)), []);
  const handleZoomOut = useCallback(() => setModalZoom(prev => Math.max(Number((prev - 0.25).toFixed(2)), 0.6)), []);
  const handleResetZoom = useCallback(() => {
    setModalZoom(1);
    setPosition({ x: 0, y: 0 });
    setFitMode('contain');
  }, []);

  const toggleFitWidth = useCallback(() => {
    if (fitMode === 'width') {
      setFitMode('contain');
      setModalZoom(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setFitMode('width');
      setModalZoom(1.35);
      setPosition({ x: 0, y: 0 });
    }
  }, [fitMode]);

  const handleDoubleClick = () => {
    if (modalZoom > 1.1) {
      handleResetZoom();
    } else {
      setModalZoom(1.85);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.deltaY < 0) {
      // Zoom in
      setModalZoom(prev => Math.min(Number((prev + 0.15).toFixed(2)), 4.0));
    } else {
      // Zoom out
      setModalZoom(prev => Math.max(Number((prev - 0.15).toFixed(2)), 0.6));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Keyboard shortcut support
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, handleZoomIn, handleZoomOut, handleResetZoom]);

  const openFullscreen = () => {
    if (onEnlarge) {
      onEnlarge();
    } else {
      setIsModalOpen(true);
      setModalZoom(1);
      setPosition({ x: 0, y: 0 });
      setFitMode('contain');
    }
  };

  return (
    <div className="w-full space-y-3 font-sans">
      {/* Main Inline Image Container (Crisp, High-Detail, Fit-to-view) */}
      <div className="relative group bg-white border border-line rounded-none p-2 sm:p-4 shadow-xs overflow-hidden">
        {/* Floating Quick Action Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs border border-line/90 shadow-sm rounded-none p-1">
          <button
            onClick={openFullscreen}
            className="p-1.5 text-slate-700 hover:text-slate-950 hover:bg-line rounded-none transition-colors cursor-pointer"
            title="Fullscreen"
            aria-label="Fullscreen"
          >
            <Maximize2 size={16} className="text-accent" />
          </button>
        </div>

        {/* The Graphic Image */}
        <div 
          className="w-full flex items-center justify-center bg-white cursor-pointer overflow-hidden"
          onClick={openFullscreen}
        >
          <img
            src={imageSrc}
            alt={customTitle}
            className="w-full h-auto object-contain rounded-none transition-transform duration-200 hover:scale-[1.003]"
            loading="eager"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== defaultArchitectureImage) {
                target.src = defaultArchitectureImage;
              }
            }}
          />
        </div>
      </div>

      {/* Maximized Fullscreen Overlay — 100% Screen Real Estate with Floating Glass Controls */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-slate-950/98 w-screen h-screen overflow-hidden select-none flex flex-col"
            onClick={() => setIsModalOpen(false)}
          >
            {/* Top Right Floating Overlay Controls */}
            <div 
              className="absolute top-3 right-3 sm:top-4 sm:right-6 z-30 flex items-center gap-1.5 sm:gap-2 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-2xl rounded-none p-1 text-white">
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-none transition-colors cursor-pointer"
                  title="Zoom Out (-)"
                  aria-label="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="px-2 text-xs font-mono font-medium text-slate-300 hover:text-white hover:bg-slate-800 min-w-[3.4rem] text-center transition-colors cursor-pointer py-1"
                  title="Click to reset zoom"
                >
                  {Math.round(modalZoom * 100)}%
                </button>
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-none transition-colors cursor-pointer"
                  title="Zoom In (+)"
                  aria-label="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
                <div className="h-4 w-px bg-slate-800 mx-1" />
                <button
                  onClick={toggleFitWidth}
                  className={`p-1.5 transition-colors cursor-pointer rounded-none flex items-center gap-1 text-xs px-2 ${
                    fitMode === 'width' 
                      ? 'bg-accent/20 text-accent font-semibold' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title={fitMode === 'width' ? "Fit whole screen" : "Fit full width"}
                  aria-label="Toggle Fit Width"
                >
                  <Scan size={15} />
                  <span className="hidden sm:inline">Fit Width</span>
                </button>
                <button
                  onClick={handleResetZoom}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-none transition-colors cursor-pointer"
                  title="Reset View (0)"
                  aria-label="Reset View"
                >
                  <RotateCcw size={15} />
                </button>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-slate-900/95 backdrop-blur-md text-slate-400 hover:text-white hover:bg-slate-800 rounded-none border border-slate-800 shadow-2xl transition-colors cursor-pointer"
                title="Close (Esc)"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* True 100% Screen Viewport Canvas with Pan, Drag, Wheel Zoom & Double-Click */}
            <div 
              ref={containerRef}
              className={`w-full h-full overflow-hidden bg-slate-950 flex items-center justify-center relative select-none ${
                isDragging ? 'cursor-grabbing' : (modalZoom > 1 ? 'cursor-grab' : 'cursor-zoom-in')
              }`}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onDoubleClick={handleDoubleClick}
            >
              <div 
                className="transition-transform duration-100 flex items-center justify-center w-full h-full"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${modalZoom})`,
                  transformOrigin: 'center center'
                }}
              >
                <img
                  src={imageSrc}
                  alt={customTitle}
                  className={`object-contain bg-white shadow-2xl rounded-none pointer-events-none transition-all duration-150 ${
                    fitMode === 'width' 
                      ? 'w-[98vw] h-auto max-w-none' 
                      : 'w-screen h-screen max-w-[99vw] max-h-[97vh]'
                  }`}
                  draggable={false}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== defaultArchitectureImage) {
                      target.src = defaultArchitectureImage;
                    }
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
