import React, { useState, useRef } from 'react';

const START_HOUR = 7;
const END_HOUR = 20;
const PIXELS_PER_HOUR = 80; // Har bir soat 80px joy oladi
const ROOMS = ['Cambridge xonasi', 'Harward xonasi', 'MIT xonasi', 'Oxford xonasi', 'Robototexnika', 'Yale xonasi'];

const Timetable = () => {
  const [view, setView] = useState('horizontal');
  const [dayTab, setDayTab] = useState('juft');
  
  const [lessons, setLessons] = useState([
    { id: 1, room: 'Cambridge xonasi', startHour: 8, endHour: 9.5, title: 'FA Geografiya #1', course: 'Geografiya Faxriddin Abrorov', students: 1, color: '#FCA5A5', text: '#7F1D1D' },
    { id: 2, room: 'Harward xonasi', startHour: 8, endHour: 10, title: 'BA Front-end #2', course: 'Front-end Bekzod Akbararov', students: 1, color: '#6EE7B7', text: '#064E3B' },
    { id: 3, room: 'MIT xonasi', startHour: 9, endHour: 10.5, title: '1-guruh Intensive pro', course: 'Master Ugvey', students: 1, color: '#A7F3D0', text: '#064E3B' },
    { id: 4, room: 'Robototexnika', startHour: 10, endHour: 11.5, title: 'Roboto texnika #1 SJ', course: 'Geografiya Steve Jobs', students: 2, color: '#F87171', text: '#7F1D1D' }
  ]);

  const containerRef = useRef(null);

  // --- STATELAR (Cho'zish, Surish va KO'CHIRISH uchun) ---
  const [resizingLesson, setResizingLesson] = useState(null); 
  const [movingLesson, setMovingLesson] = useState(null); // YANGI: Qaysi dars ko'chirilayotgani
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Sichqoncha darsning qayeridan ushlagani
  
  const [isDragging, setIsDragging] = useState(false); 
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  // 1. DARSNI CHO'ZISH (RESIZE)
  const handleResizeMouseDown = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    setResizingLesson(id);
  };

  // 2. DARSNI KO'CHIRISHNI BOSHLASH (DRAG & DROP)
  const handleLessonMouseDown = (e, lesson) => {
    e.stopPropagation(); // Jadval surilib ketmasligi uchun
    if (resizingLesson) return;

    const rect = containerRef.current.getBoundingClientRect();
    const gridX = e.clientX - rect.left + containerRef.current.scrollLeft;
    const gridY = e.clientY - rect.top + containerRef.current.scrollTop;

    const style = getBlockStyle(lesson);
    
    // Sichqoncha dars blokining ichida qayerda turganini aniqlaymiz (sakrab ketmasligi uchun)
    setDragOffset({
      x: gridX - parseFloat(style.left),
      y: gridY - parseFloat(style.top)
    });
    
    setMovingLesson(lesson.id);
  };

  // 3. JADVALNI SURISHNI BOSHLASH (PAN)
  const handlePanMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setStartY(e.pageY - containerRef.current.offsetTop);
    setScrollLeft(containerRef.current.scrollLeft);
    setScrollTop(containerRef.current.scrollTop);
  };

  // 4. SICHQONCHA HARAKATLANGANDA BARCHA MANTIQ
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const gridX = e.clientX - rect.left + containerRef.current.scrollLeft;
    const gridY = e.clientY - rect.top + containerRef.current.scrollTop;

    // A: Agar cho'zilayotgan bo'lsa
    if (resizingLesson) {
      let currentPos = view === 'vertical' ? gridY - 50 : gridX - 150;
      let newEndHour = START_HOUR + (currentPos / PIXELS_PER_HOUR);
      newEndHour = Math.round(newEndHour * 2) / 2; // Snap 30 min

      setLessons(prev => prev.map(lesson => {
        if (lesson.id === resizingLesson) {
          const validEndHour = Math.max(lesson.startHour + 0.5, Math.min(newEndHour, END_HOUR));
          return { ...lesson, endHour: validEndHour };
        }
        return lesson;
      }));
    } 
    // B: Agar dars KO'CHIRILAYOTGAN bo'lsa (Drag and Drop)
    else if (movingLesson) {
      // Darsning yangi top-left koordinatalari
      let targetX = gridX - dragOffset.x;
      let targetY = gridY - dragOffset.y;

      let newStartHour, roomIndex;

      if (view === 'vertical') {
        newStartHour = START_HOUR + ((targetY - 50) / PIXELS_PER_HOUR);
        // Xonani aniqlash (blokning markazidan hisoblaymiz)
        const blockCenterX = targetX + (170 / 2); 
        roomIndex = Math.floor((blockCenterX - 80) / 180);
      } else {
        newStartHour = START_HOUR + ((targetX - 150) / PIXELS_PER_HOUR);
        // Xonani aniqlash
        const blockCenterY = targetY + (70 / 2);
        roomIndex = Math.floor((blockCenterY - 50) / 80);
      }

      newStartHour = Math.round(newStartHour * 2) / 2; // Snap 30 min
      roomIndex = Math.max(0, Math.min(ROOMS.length - 1, roomIndex)); // Xonalar chegarasidan chiqmasligi uchun

      setLessons(prev => prev.map(lesson => {
        if (lesson.id === movingLesson) {
          const duration = lesson.endHour - lesson.startHour;
          // Vaqt chegaradan chiqib ketmasin
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
    // C: Agar jadval surilayotgan bo'lsa
    else if (isDragging) {
      e.preventDefault();
      const x = e.pageX - containerRef.current.offsetLeft;
      const y = e.pageY - containerRef.current.offsetTop;
      containerRef.current.scrollLeft = scrollLeft - (x - startX);
      containerRef.current.scrollTop = scrollTop - (y - startY);
    }
  };

  // 5. BARCHASINI TO'XTATISH
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

  return (
    <div className="dashboard-card mb-4" style={{ userSelect: 'none', width: '100%', overflow: 'hidden', boxSizing: 'border-box', maxWidth: 'calc(100vw - 150px)' }}>
      
      <style>{`
        .hide-scrollbars::-webkit-scrollbar { display: none; }
        .hide-scrollbars { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Menyu qismi */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div className="d-flex gap-4 fw-medium" style={{ fontSize: '15px' }}>
          <span className={`cursor-pointer pb-1 ${dayTab === 'toq' ? 'text-info border-bottom border-info border-2' : 'text-muted'}`} onClick={() => setDayTab('toq')}>Toq kunlar</span>
          <span className={`cursor-pointer pb-1 ${dayTab === 'juft' ? 'text-info border-bottom border-info border-2' : 'text-muted'}`} onClick={() => setDayTab('juft')}>Juft kunlar</span>
          <span className={`cursor-pointer pb-1 ${dayTab === 'boshqa' ? 'text-info border-bottom border-info border-2' : 'text-muted'}`} onClick={() => setDayTab('boshqa')}>Boshqa</span>
        </div>
        
        <div className="d-flex align-items-center gap-2 bg-light p-1 rounded-pill border">
          <span className={`px-3 py-1 rounded-pill cursor-pointer ${view === 'horizontal' ? 'bg-white shadow-sm fw-medium text-info' : 'text-muted'}`} style={{fontSize: '13px'}} onClick={() => setView('horizontal')}>Gorizontal</span>
          <span className={`px-3 py-1 rounded-pill cursor-pointer ${view === 'vertical' ? 'bg-white shadow-sm fw-medium text-info' : 'text-muted'}`} style={{fontSize: '13px'}} onClick={() => setView('vertical')}>Vertikal</span>
        </div>
      </div>

      {/* JADVAL QISMI */}
      <div 
        className="hide-scrollbars position-relative border rounded w-100" 
        style={{ 
          height: '500px', 
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
          
          {/* ... ORQA FON GRID CHIZIQLARI ... (O'zgarishsiz qoldi) */}
          {view === 'vertical' ? (
            <>
              <div className="d-flex position-absolute top-0 w-100 bg-white border-bottom" style={{ height: '50px', zIndex: 10 }}>
                <div style={{ width: '80px', minWidth: '80px', borderRight: '1px solid #eaeaea' }}></div>
                {ROOMS.map(room => <div key={room} className="d-flex align-items-center justify-content-center text-muted fw-medium" style={{ width: '180px', minWidth: '180px', borderRight: '1px solid #eaeaea', fontSize: '14px' }}>{room}</div>)}
              </div>
              {times.map((time, i) => (
                <div key={time} className="position-absolute w-100 d-flex" style={{ top: `${50 + i * PIXELS_PER_HOUR}px`, height: `${PIXELS_PER_HOUR}px`, borderBottom: '1px solid #eaeaea' }}>
                  <div className="d-flex justify-content-center pt-2 fw-medium text-dark bg-white" style={{ width: '80px', minWidth: '80px', borderRight: '1px solid #eaeaea', zIndex: 5 }}>{time}</div>
                  {ROOMS.map(room => <div key={room} style={{ width: '180px', minWidth: '180px', borderRight: '1px solid #f5f5f5' }}></div>)}
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="d-flex position-absolute top-0 w-100 bg-white border-bottom" style={{ height: '50px', zIndex: 10 }}>
                <div style={{ width: '150px', minWidth: '150px', borderRight: '1px solid #eaeaea' }}></div>
                {times.map(time => <div key={time} className="d-flex justify-content-start ps-2 pt-3 text-muted fw-medium" style={{ width: `${PIXELS_PER_HOUR}px`, minWidth: `${PIXELS_PER_HOUR}px`, borderRight: '1px solid #eaeaea', fontSize: '13px' }}>{time}</div>)}
              </div>
              {ROOMS.map((room, i) => (
                <div key={room} className="position-absolute w-100 d-flex" style={{ top: `${50 + i * 80}px`, height: '80px', borderBottom: '1px solid #eaeaea' }}>
                  <div className="d-flex align-items-center px-3 fw-medium text-dark bg-white" style={{ width: '150px', minWidth: '150px', borderRight: '1px solid #eaeaea', fontSize: '13px', zIndex: 5 }}>{room}</div>
                  {times.map(time => <div key={time} style={{ width: `${PIXELS_PER_HOUR}px`, minWidth: `${PIXELS_PER_HOUR}px`, borderRight: '1px solid #f5f5f5' }}></div>)}
                </div>
              ))}
            </>
          )}

          {/* SUZIB YURUVCHI DARSLAR BLOKI */}
          {lessons.map(lesson => {
            const isMoving = movingLesson === lesson.id;
            
            return (
              <div 
                key={lesson.id} 
                className="position-absolute rounded shadow-sm d-flex flex-column p-2 overflow-hidden"
                onMouseDown={(e) => handleLessonMouseDown(e, lesson)} // YANGI: Ko'chirishni shu yerda ushlaymiz
                style={{
                  ...getBlockStyle(lesson),
                  backgroundColor: lesson.color,
                  color: lesson.text,
                  zIndex: isMoving ? 50 : 20, // Ko'chirilayotganda hammadan ustiga chiqadi
                  boxShadow: isMoving ? '0 10px 25px rgba(0,0,0,0.3)' : '0 2px 5px rgba(0,0,0,0.1)', // Ko'chirilayotganda soya beramiz
                  transition: (resizingLesson === lesson.id || isMoving) ? 'none' : 'all 0.2s ease', // Harakat silliq bo'lishi uchun
                  cursor: isMoving ? 'grabbing' : 'move' // Kursor o'zgaradi
                }}
              >
                <div className="fw-bold" style={{ fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden' }}>{lesson.title}</div>
                <div style={{ fontSize: '11px', opacity: 0.9 }}>{lesson.course}</div>
                <div className="mt-auto d-flex justify-content-between align-items-end">
                  <span className="bg-white px-1 rounded text-dark fw-bold" style={{ fontSize: '10px' }}>{lesson.students} tal.</span>
                </div>

                {/* CHO'ZISH UCHUN TUTQICH */}
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
};

export default Timetable;