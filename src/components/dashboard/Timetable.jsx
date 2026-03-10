import React, { useState, useRef } from 'react';

const START_HOUR = 7;
const END_HOUR = 20;
const PIXELS_PER_HOUR = 80; 
const ROOMS = ['Cambridge xonasi', 'Harward xonasi', 'MIT xonasi', 'Oxford xonasi', 'Robototexnika', 'Yale xonasi'];

// YANGI: isGlobal prop qo'shildi (default false)
const Timetable = ({ isGlobal = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [view, setView] = useState('horizontal');
  const [dayTab, setDayTab] = useState('juft');
  
  const [lessons, setLessons] = useState([
    { id: 1, room: 'Cambridge xonasi', startHour: 8, endHour: 9.5, title: 'FA Geografiya #1', course: 'Geografiya Faxriddin Abrorov', students: 1, color: '#FCA5A5', text: '#7F1D1D' },
    { id: 2, room: 'Harward xonasi', startHour: 8, endHour: 10, title: 'BA Front-end #2', course: 'Front-end Bekzod Akbararov', students: 1, color: '#6EE7B7', text: '#064E3B' },
    { id: 3, room: 'MIT xonasi', startHour: 9, endHour: 10.5, title: '1-guruh Intensive pro', course: 'Master Ugvey', students: 1, color: '#A7F3D0', text: '#064E3B' },
    { id: 4, room: 'Robototexnika', startHour: 10, endHour: 11.5, title: 'Roboto texnika #1 SJ', course: 'Geografiya Steve Jobs', students: 2, color: '#F87171', text: '#7F1D1D' }
  ]);

  const containerRef = useRef(null);

  const [resizingLesson, setResizingLesson] = useState(null); 
  const [movingLesson, setMovingLesson] = useState(null); 
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); 
  
  const [isDragging, setIsDragging] = useState(false); 
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const handleResizeMouseDown = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    setResizingLesson(id);
  };

  const handleLessonMouseDown = (e, lesson) => {
    e.stopPropagation(); 
    if (resizingLesson) return;

    const rect = containerRef.current.getBoundingClientRect();
    const gridX = e.clientX - rect.left + containerRef.current.scrollLeft;
    const gridY = e.clientY - rect.top + containerRef.current.scrollTop;

    const style = getBlockStyle(lesson);
    
    setDragOffset({
      x: gridX - parseFloat(style.left),
      y: gridY - parseFloat(style.top)
    });
    
    setMovingLesson(lesson.id);
  };

  const handlePanMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setStartY(e.pageY - containerRef.current.offsetTop);
    setScrollLeft(containerRef.current.scrollLeft);
    setScrollTop(containerRef.current.scrollTop);
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const gridX = e.clientX - rect.left + containerRef.current.scrollLeft;
    const gridY = e.clientY - rect.top + containerRef.current.scrollTop;

    if (resizingLesson) {
      let currentPos = view === 'vertical' ? gridY - 50 : gridX - 150;
      let newEndHour = START_HOUR + (currentPos / PIXELS_PER_HOUR);
      newEndHour = Math.round(newEndHour * 2) / 2;

      setLessons(prev => prev.map(lesson => {
        if (lesson.id === resizingLesson) {
          const validEndHour = Math.max(lesson.startHour + 0.5, Math.min(newEndHour, END_HOUR));
          return { ...lesson, endHour: validEndHour };
        }
        return lesson;
      }));
    } 
    else if (movingLesson) {
      let targetX = gridX - dragOffset.x;
      let targetY = gridY - dragOffset.y;

      let newStartHour, roomIndex;

      if (view === 'vertical') {
        newStartHour = START_HOUR + ((targetY - 50) / PIXELS_PER_HOUR);
        const blockCenterX = targetX + (170 / 2); 
        roomIndex = Math.floor((blockCenterX - 80) / 180);
      } else {
        newStartHour = START_HOUR + ((targetX - 150) / PIXELS_PER_HOUR);
        const blockCenterY = targetY + (70 / 2);
        roomIndex = Math.floor((blockCenterY - 50) / 80);
      }

      newStartHour = Math.round(newStartHour * 2) / 2; 
      roomIndex = Math.max(0, Math.min(ROOMS.length - 1, roomIndex)); 

      setLessons(prev => prev.map(lesson => {
        if (lesson.id === movingLesson) {
          const duration = lesson.endHour - lesson.startHour;
          const validStart = Math.max(START_HOUR, Math.min(newStartHour, END_HOUR - duration));
          return {
            ...lesson,
            startHour: validStart,
            endHour: validStart + duration,
            room: ROOMS[roomIndex]
          };
        }
        return lesson;
      }));
    } 
    else if (isDragging) {
      e.preventDefault();
      const x = e.pageX - containerRef.current.offsetLeft;
      const y = e.pageY - containerRef.current.offsetTop;
      containerRef.current.scrollLeft = scrollLeft - (x - startX);
      containerRef.current.scrollTop = scrollTop - (y - startY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setResizingLesson(null);
    setMovingLesson(null);
  };

  const times = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => `${(START_HOUR + i).toString().padStart(2, '0')}:00`);

  const getBlockStyle = (lesson) => {
    const roomIndex = ROOMS.indexOf(lesson.room);
    if (view === 'vertical') {
      return {
        top: `${50 + (lesson.startHour - START_HOUR) * PIXELS_PER_HOUR}px`,
        height: `${(lesson.endHour - lesson.startHour) * PIXELS_PER_HOUR}px`,
        left: `${80 + roomIndex * 180}px`, 
        width: '170px'
      };
    } else {
      return {
        left: `${150 + (lesson.startHour - START_HOUR) * PIXELS_PER_HOUR}px`,
        width: `${(lesson.endHour - lesson.startHour) * PIXELS_PER_HOUR}px`,
        top: `${50 + roomIndex * 80}px`,
        height: '70px'
      };
    }
  };

  // ASOSIY JADVAL KODI (Ikkala joyda ham bir xil chiziladi)
  const timetableCoreContent = (
    <div className="flex-grow-1 d-flex flex-column" style={{ overflow: 'hidden' }}>
      {/* Menyu qismi */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
        <div className="d-flex gap-4 fw-medium" style={{ fontSize: '15px' }}>
          <span className={`cursor-pointer pb-1 ${dayTab === 'toq' ? 'text-primary border-bottom border-primary border-2' : 'text-muted'}`} onClick={() => setDayTab('toq')}>Toq kunlar</span>
          <span className={`cursor-pointer pb-1 ${dayTab === 'juft' ? 'text-primary border-bottom border-primary border-2' : 'text-muted'}`} onClick={() => setDayTab('juft')}>Juft kunlar</span>
          <span className={`cursor-pointer pb-1 ${dayTab === 'boshqa' ? 'text-primary border-bottom border-primary border-2' : 'text-muted'}`} onClick={() => setDayTab('boshqa')}>Boshqa</span>
        </div>
        
        <div className="d-flex align-items-center gap-2 bg-light p-1 rounded-pill border">
          <span className={`px-3 py-1 rounded-pill cursor-pointer ${view === 'horizontal' ? 'bg-white shadow-sm fw-medium text-primary' : 'text-muted'}`} style={{fontSize: '13px'}} onClick={() => setView('horizontal')}>Gorizontal</span>
          <span className={`px-3 py-1 rounded-pill cursor-pointer ${view === 'vertical' ? 'bg-white shadow-sm fw-medium text-primary' : 'text-muted'}`} style={{fontSize: '13px'}} onClick={() => setView('vertical')}>Vertikal</span>
        </div>
      </div>

      {/* Interaktiv Jadval */}
      <div 
        className="hide-scrollbars position-relative border rounded w-100 flex-grow-1" 
        style={{ 
          height: isGlobal ? '100%' : '500px', // Dashboard uchun 500px, Modal uchun 100%
          backgroundColor: '#fcfcfc', 
          overflow: 'auto', 
          cursor: isDragging ? 'grabbing' : 'grab' 
        }}
        onMouseDown={handlePanMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        ref={containerRef}
      >
        <div style={{ 
          position: 'relative', 
          width: view === 'vertical' ? `${80 + ROOMS.length * 180}px` : `${150 + times.length * PIXELS_PER_HOUR}px`,
          height: view === 'vertical' ? `${50 + times.length * PIXELS_PER_HOUR}px` : `${50 + ROOMS.length * 80}px`,
          minWidth: '100%'
        }}>
          
          {view === 'vertical' ? (
            <>
              <div className="d-flex position-absolute top-0 w-100 bg-white border-bottom shadow-sm" style={{ height: '50px', zIndex: 10, position: 'sticky' }}>
                <div style={{ width: '80px', minWidth: '80px', borderRight: '1px solid #eaeaea', position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 11 }}></div>
                {ROOMS.map(room => <div key={room} className="d-flex align-items-center justify-content-center text-muted fw-bold" style={{ width: '180px', minWidth: '180px', borderRight: '1px solid #eaeaea', fontSize: '14px' }}>{room}</div>)}
              </div>
              {times.map((time, i) => (
                <div key={time} className="position-absolute w-100 d-flex" style={{ top: `${50 + i * PIXELS_PER_HOUR}px`, height: `${PIXELS_PER_HOUR}px`, borderBottom: '1px dashed #eaeaea' }}>
                  <div className="d-flex justify-content-center pt-2 fw-medium text-dark bg-white" style={{ width: '80px', minWidth: '80px', borderRight: '1px solid #eaeaea', position: 'sticky', left: 0, zIndex: 5 }}>{time}</div>
                  {ROOMS.map(room => <div key={room} style={{ width: '180px', minWidth: '180px', borderRight: '1px dashed #f0f0f0' }}></div>)}
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="d-flex position-absolute top-0 w-100 bg-white border-bottom shadow-sm" style={{ height: '50px', zIndex: 10, position: 'sticky' }}>
                <div style={{ width: '150px', minWidth: '150px', borderRight: '1px solid #eaeaea', position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 11 }}></div>
                {times.map(time => <div key={time} className="d-flex justify-content-start ps-2 pt-3 text-muted fw-bold" style={{ width: `${PIXELS_PER_HOUR}px`, minWidth: `${PIXELS_PER_HOUR}px`, borderRight: '1px solid #eaeaea', fontSize: '13px' }}>{time}</div>)}
              </div>
              {ROOMS.map((room, i) => (
                <div key={room} className="position-absolute w-100 d-flex" style={{ top: `${50 + i * 80}px`, height: '80px', borderBottom: '1px dashed #eaeaea' }}>
                  <div className="d-flex align-items-center px-3 fw-medium text-dark bg-white" style={{ width: '150px', minWidth: '150px', borderRight: '1px solid #eaeaea', position: 'sticky', left: 0, zIndex: 5 }}>{room}</div>
                  {times.map(time => <div key={time} style={{ width: `${PIXELS_PER_HOUR}px`, minWidth: `${PIXELS_PER_HOUR}px`, borderRight: '1px dashed #f0f0f0' }}></div>)}
                </div>
              ))}
            </>
          )}

          {lessons.map(lesson => {
            const isMoving = movingLesson === lesson.id;
            return (
              <div 
                key={lesson.id} 
                className="position-absolute rounded shadow-sm d-flex flex-column p-2 overflow-hidden"
                onMouseDown={(e) => handleLessonMouseDown(e, lesson)} 
                style={{
                  ...getBlockStyle(lesson),
                  backgroundColor: lesson.color,
                  color: lesson.text,
                  zIndex: isMoving ? 50 : 20, 
                  boxShadow: isMoving ? '0 10px 25px rgba(0,0,0,0.3)' : '0 2px 5px rgba(0,0,0,0.1)', 
                  transition: (resizingLesson === lesson.id || isMoving) ? 'none' : 'all 0.2s ease', 
                  cursor: isMoving ? 'grabbing' : 'move' 
                }}
              >
                <div className="fw-bold" style={{ fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden' }}>{lesson.title}</div>
                <div style={{ fontSize: '11px', opacity: 0.9 }}>{lesson.course}</div>
                <div className="mt-auto d-flex justify-content-between align-items-end">
                  <span className="bg-white px-1 rounded text-dark fw-bold" style={{ fontSize: '10px' }}>{lesson.students} tal.</span>
                </div>

                <div 
                  className="position-relative"
                  onMouseDown={(e) => handleResizeMouseDown(e, lesson.id)} 
                  style={{
                    bottom: view === 'vertical' ? 0 : 'auto',
                    right: view === 'horizontal' ? 0 : 'auto',
                    height: view === 'vertical' ? '12px' : '100%',
                    width: view === 'horizontal' ? '12px' : '100%',
                    cursor: view === 'vertical' ? 'ns-resize' : 'ew-resize',
                    backgroundColor: 'rgba(0,0,0,0.15)',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );


  // AGAR isGlobal YOLG'ON BO'LSA (Ya'ni Dashboardda bo'lsa) - TO'G'RIDAN-TO'G'RI CHIZISH
  if (!isGlobal) {
    return (
      <div className="dashboard-card mb-4 mt-4 bg-white p-3 border rounded shadow-sm" style={{ width: '100%' }}>
         <h4 className="fw-bold mb-4">Dars Jadvali</h4>
         {timetableCoreContent}
      </div>
    );
  }

  // AGAR isGlobal ROST BO'LSA - SUZUVCHI TUGMA VA MODAL CHIZISH
  return (
    <>
      <style>{`
        .hide-scrollbars::-webkit-scrollbar { display: none; }
        .hide-scrollbars { -ms-overflow-style: none; scrollbar-width: none; }
        
        .global-timetable-btn {
          position: fixed;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          background-color: #FF7A00;
          color: white;
          padding: 16px 14px;
          border-radius: 8px 0 0 8px;
          cursor: pointer;
          z-index: 9998;
          box-shadow: -4px 0 15px rgba(255, 122, 0, 0.4);
          font-size: 24px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .global-timetable-btn:hover {
          padding-right: 24px;
          background-color: #e66a00;
        }

        .timetable-modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(3px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease;
        }

        .timetable-modal-content {
          width: 95vw;
          height: 90vh;
          background-color: #fff;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          animation: slideUp 0.3s ease;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      {/* SUZUVCHI TUGMA */}
      {/* 1. SUZUVCHI TUGMA */}
      <div 
        className="global-timetable-btn"
        onClick={() => setIsOpen(true)}
        title="Dars jadvalini ochish"
      >
        {/* FontAwesome o'rniga haqiqiy SVG Ikonka */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
          <path d="M8 14h.01"></path>
          <path d="M12 14h.01"></path>
          <path d="M16 14h.01"></path>
          <path d="M8 18h.01"></path>
          <path d="M12 18h.01"></path>
          <path d="M16 18h.01"></path>
        </svg>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="timetable-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="timetable-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
              <h3 className="m-0 fw-bold text-dark">Umumiy Dars Jadvali</h3>
              <button 
                className="btn btn-light rounded-circle border d-flex align-items-center justify-content-center" 
                style={{ width: '40px', height: '40px' }} 
                onClick={() => setIsOpen(false)}
              >
                <i className="fa-solid fa-xmark fs-5 text-secondary"></i>
              </button>
            </div>
            {timetableCoreContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Timetable;