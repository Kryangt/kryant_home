import { useEffect, useRef, useState } from "react";
import "./Gallery.css";

const PROJECTS = [
  {
    title: "Stretch Robot",
    image: `${import.meta.env.BASE_URL}Gallery/Robot.png`,
    imageAlt: "Line drawing of a mobile robot with an extended arm",
    contentTitle: "Stretch Robot Privacy Research",
    url: "",
    // Each entry is a separate paragraph in the popup.
    content: [
      "This study is trying to investigate the effectiveness of new interactions of telepresence robot on privacy control.",
      "My main contributions are:",
    ],
    contentList: [
      "Involved in the development of the system including remote communciation, robotic mobility, and cv_detection",
      "Conducted semantic analysis on interaction data and analysis the findings",
      "Involved in the final paper writing",
    ],
  },
  {
    title: "CPU Scheduler",
    image: `${import.meta.env.BASE_URL}Gallery/CPU.jpg`,
    imageAlt: "CPU chip illustration",
    contentTitle: "CPU Scheduler",
    url: "https://github.com/Kryangt/xv6-Scheduling-optimization/tree/main",
    content: [
      "Inspired from the Operating System class in school. STCF has the best turnaround time and RR has the best response time, but Multi-Level Feedback Queue is also quit complicated. Is there any structure that is simpler but also workable?",
      "Hence, I came up a double layered STCF that can prioritize tasks whose waited time exceeding the threshold",
      "In a experiment of 1000 tasks, this structure reduced 70.5% of response time with a only 4.9% increase in turnaround time compared to the baseline"],
  },
  {
    title: "Smart Scheduler",
    image: `${import.meta.env.BASE_URL}Scheduler.png`,
    imageAlt: "Calendar illustration with four circled dates",
    contentTitle: "Smart Scheduler",
    url: "https://github.com/Kryangt/Smart-Scheduler",
    content: ["This project inspired from my personal experience. When things from school and life happened at the same time, we, especially college students, always feel overwhelmed",
      "If there is something that can help us to break things down and fit into our schedule will be great",
      "If this thing can customize our schedule, to make the schedule more align to our personal routine, it will be greater",
      "Therefore, those are the goals the Smart Scheduler are trying to accomplish, and if you want to join the process, contact me"
    ],
  },
  {
    title: "Self Portrait",
    image: `${import.meta.env.BASE_URL}Gallery/portrait.png`,
    imageAlt: "Hand-drawn self portrait wearing a hat with a handwritten greeting",
    contentTitle: "A Slef Portrait",
    url: "https://github.com/Kryangt/FaceDrawing",
    content: ["Same as the portrait in the landing page, but this one is more complete", 
      "Inspired from the 'Hello' animation of Apple's starting scene",
      "The line movements are curvature transformation, and this project is zero AI",
      "(Almost died when doing this portrait)"
    ],
  },
];

export function Gallery() {
  const [selectedProject, setSelectedProject] = useState(null);
  const deckRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    let frameId = null;
    let progress = 0;
    let previousTime = null;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateExpansion = (time) => {
      frameId = null;
      const bounds = deckRef.current.getBoundingClientRect();
      const deckCenter = bounds.top + bounds.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const distance = Math.abs(deckCenter - viewportCenter) / window.innerHeight;
      // Spread continuously on approach, finishing inside the central band.
      const fraction = Math.max(0, Math.min(1, (0.55 - distance) / 0.43));
      const target = fraction * fraction * (3 - 2 * fraction);
      const elapsed = previousTime === null ? 16 : Math.min(time - previousTime, 64);
      previousTime = time;
      // Ease toward the scroll position even after a fast wheel/trackpad jump.
      progress += (target - progress) * (1 - Math.exp(-elapsed / 180));
      if (reducedMotion.matches || Math.abs(target - progress) < 0.0005) progress = target;
      deckRef.current.style.setProperty("--expansion", progress.toFixed(5));
      if (progress !== target) {
        frameId = requestAnimationFrame(updateExpansion);
      } else {
        previousTime = null;
      }
    };
    const scheduleUpdate = () => {
      if (frameId === null) frameId = requestAnimationFrame(updateExpansion);
    };
    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(document.body);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      observer.disconnect();
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedProject]);

  return (
    <div className="project-gallery">
      <div ref={deckRef} className="project-deck" role="group" aria-label="Projects">
        {PROJECTS.map((project, index) => {
          const offset = index - (PROJECTS.length - 1) / 2;
          return (
            <div
              className="project-slot"
              key={project.title}
              style={{
                "--offset": offset,
                "--distance": Math.abs(offset),
                "--layer": PROJECTS.length - Math.floor(Math.abs(offset)),
              }}
            >
              <button
                type="button"
                className="project-page"
                aria-haspopup="dialog"
                onClick={() => setSelectedProject(project)}
              >
                {project.image && (
                  <img className="project-page__image" src={project.image} alt={project.imageAlt} draggable="false" />
                )}
                <span className="project-page__title">{project.title}</span>
              </button>
            </div>
          );
        })}
      </div>
      <dialog
        ref={dialogRef}
        className="project-preview"
        aria-labelledby="project-preview-title"
        onClose={() => setSelectedProject(null)}
      >
        <button type="button" className="project-preview__close" onClick={() => dialogRef.current.close()}>
          Close ×
        </button>
        <h2 id="project-preview-title">{selectedProject?.contentTitle}</h2>
        {selectedProject?.url?.trim() && (
          <a className="project-preview__link" href={selectedProject.url.trim()}>
            {selectedProject.url.trim()}
          </a>
        )}
        <div className="project-preview__content">
          {(Array.isArray(selectedProject?.content)
            ? selectedProject.content
            : (selectedProject?.content ?? "").split(/\r?\n\s*\r?\n/)
          ).filter((paragraph) => paragraph.trim()).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          {selectedProject?.contentList?.length > 0 && (
            <ol>
              {selectedProject.contentList.map((item, index) => <li key={index}>{item}</li>)}
            </ol>
          )}
        </div>
      </dialog>
    </div>
  );
}
