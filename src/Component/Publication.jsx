import { useEffect, useRef, useState } from "react";
import { calendarRender, CANVAS_HEIGHT, CANVAS_WIDTH } from "../../Scripts/calendar";
import "./Publication.css";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function CalendarCanvas({ progress }) {
  const canvasRef = useRef(null);
  const progressRef = useRef(progress);
  const [hoveredCircle, setHoveredCircle] = useState(null);
  const [cardCircle, setCardCircle] = useState(null);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    return calendarRender(canvas, {
      getProgress: () => progressRef.current,
      onHoverCircle: (circle) => {
        if (circle) setCardCircle(circle);
        setHoveredCircle(circle);
      },
    });
  }, []);

  return (
    <div className="doing-calendar-wrap">
      <canvas
        ref={canvasRef}
        className="doing-calendar"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        role="img"
        aria-label="An animated smart scheduler with four floating circled calendar cells"
      />
      <div
        className={`scheduler-placeholder-card ${hoveredCircle ? "scheduler-placeholder-card--visible" : ""}`}
        style={cardCircle ? {
          left: `${(cardCircle.x / CANVAS_WIDTH) * 100}%`,
          top: `${(cardCircle.y / CANVAS_HEIGHT) * 100}%`,
        } : undefined}
        aria-hidden={!hoveredCircle}
      >
        <span>Schedule placeholder</span>
        <small>Details coming soon</small>
      </div>
    </div>
  );
}

export function Publication() {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    function updateProgress() {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      // Begin when roughly half of this section has entered the viewport and
      // finish as its top edge reaches the top of the viewport.
      const start = viewportHeight * 0.5;
      const end = 0;
      setScrollProgress(clamp((start - rect.top) / (start - end), 0, 1));
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const schedulerProgress = clamp(scrollProgress / 0.42, 0, 1);
  const calendarProgress = scrollProgress;

  return (
    <section ref={sectionRef} className="doing-section">
      <header className="doing-heading">
        <h1>What am I doing...</h1>
        <p
          className="doing-current"
          style={{
            opacity: schedulerProgress,
            transform: `translateX(${(1 - schedulerProgress) * 24 }px)`,
          }}
        >
          Smart Scheduler
        </p>
      </header>
      <CalendarCanvas progress={calendarProgress} />
    </section>
  );
}
