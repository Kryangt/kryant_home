import { useRef, useState } from "react";
import "./Gallery.css";

const PROJECTS = [
  { title: "Project Alpha" },
  { title: "Project Beta" },
  { title: "Project Gamma" },
  { title: "Project Delta" },
  { title: "Project Epsilon" },
];

export function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStartRef = useRef(null);
  const hoverLockRef = useRef(0);

  function move(direction) {
    setActiveIndex((current) => (current + direction + PROJECTS.length) % PROJECTS.length);
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    }
  }

  function handlePointerDown(event) {
    pointerStartRef.current = event.clientX;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function handlePointerUp(event) {
    if (pointerStartRef.current === null) return;
    const distance = event.clientX - pointerStartRef.current;
    pointerStartRef.current = null;
    if (Math.abs(distance) < 45) return;
    move(distance < 0 ? 1 : -1);
  }

  function selectProject(index) {
    if (index === activeIndex) return;
    if (performance.now() < hoverLockRef.current) return;
    hoverLockRef.current = performance.now() + 480;
    setActiveIndex(index);
  }

  return (
    <div
      className="project-gallery"
      tabIndex="0"
      onKeyDown={handleKeyDown}
      aria-label="Project gallery. Use left and right arrow keys to change projects."
    >
      <div
        className="project-deck"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { pointerStartRef.current = null; }}
      >
        {PROJECTS.map((project, index) => {
          const offset = index - activeIndex;
          const distance = Math.abs(offset);
          const isActive = offset === 0;
          return (
            <article
              className={`project-page ${isActive ? "project-page--active" : ""}`}
              key={project.title}
              style={{
                "--offset": offset,
                "--distance": distance,
                zIndex: PROJECTS.length - distance,
              }}
              aria-hidden={!isActive}
              aria-label={project.title}
              onMouseEnter={() => selectProject(index)}
              onClick={() => selectProject(index)}
            >
              <div className="project-page__placeholder" aria-hidden="true" />
            </article>
          );
        })}
      </div>
    </div>
  );
}
