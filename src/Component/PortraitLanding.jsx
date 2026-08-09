import { useEffect, useRef, useState } from "react";
import { PortraitCanvas } from "./PortraitCanvas";
import { Element } from "react-scroll";
import { Publication } from "./Publication";
import "./PortraitLanding.css";

const ABOUT_CALLOUTS = [
  {
    id: "age",
    text: "AGE_PLACEHOLDER",
    labelX: 4,
    labelY: 14,
  },
  {
    id: "job",
    text: "JOB_PLACEHOLDER",
    labelX: 76,
    labelY: 18,
  },
  {
    id: "occupation",
    text: "OCCUPATION_PLACEHOLDER",
    labelX: 3,
    labelY: 90,
  },
  {
    id: "interest",
    text: "INTEREST_PLACEHOLDER",
    labelX: 75,
    labelY: 86,
  },
];

export function PortraitLanding({ hasEntered, onEnter }) {
  const portraitCanvasRef = useRef(null);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [decomposeProgress, setDecomposeProgress] = useState(0);

  function handleEnter() {
    if (isEntering) {
      return;
    }

    setIsEntering(true);
    onEnter();
  }

  function handleArrowKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleEnter();
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowEnterButton(true);
    }, 3600);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hasEntered) {
      setDecomposeProgress(0);
      return undefined;
    }

    function updateDecomposeProgress() {
      const viewportHeight = window.innerHeight || 1;
      const progress = Math.min(Math.max(window.scrollY / (viewportHeight * 0.58), 0), 1);
      setDecomposeProgress(progress);
    }

    updateDecomposeProgress();
    window.addEventListener("scroll", updateDecomposeProgress, { passive: true });
    window.addEventListener("resize", updateDecomposeProgress);

    return () => {
      window.removeEventListener("scroll", updateDecomposeProgress);
      window.removeEventListener("resize", updateDecomposeProgress);
    };
  }, [hasEntered]);

  return (
    <main className="portrait-landing" id="About">
      <section className="portrait-landing__stage" aria-label="Website entry">
        <div
          className={`portrait-landing__canvas-wrap ${showEnterButton ? "portrait-landing__canvas-wrap--floating" : ""}`.trim()}
        >
          <PortraitCanvas
            width={820}
            height={760}
            className="portrait-landing__canvas"
            label="Animated portrait of Chenming Ye"
            decomposeProgress={decomposeProgress}
            canvasRef={portraitCanvasRef}
          />

          {(isEntering || hasEntered) ? (
            <>
              <svg
                className="portrait-callout-lines"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path className="portrait-callout-line" d="M 29 43.5 Q 29 43.5 29 43.5">
                  <animate attributeName="d" from="M 29 43.5 Q 29 43.5 29 43.5" to="M 29 43.5 Q 21 31 10 18" dur="0.6s" begin="0.25s" fill="freeze" />
                </path>
                <path className="portrait-callout-line" d="M 73 42 Q 73 42 73 42">
                  <animate attributeName="d" from="M 73 42 Q 73 42 73 42" to="M 73 42 Q 76 31 80 22" dur="0.6s" begin="0.6s" fill="freeze" />
                </path>
                <path className="portrait-callout-line" d="M 29 56 Q 29 56 29 56">
                  <animate attributeName="d" from="M 29 56 Q 29 56 29 56" to="M 29 56 Q 20 70 10 87" dur="0.6s" begin="0.95s" fill="freeze" />
                </path>
                <path className="portrait-callout-line" d="M 71 56 Q 71 56 71 56">
                  <animate attributeName="d" from="M 71 56 Q 71 56 71 56" to="M 71 56 Q 75 69 79 83" dur="0.6s" begin="1.3s" fill="freeze" />
                </path>
              </svg>
              {ABOUT_CALLOUTS.map((callout, index) => (
                <div
                  key={callout.id}
                  className="portrait-callout-label"
                  style={{
                    left: `${callout.labelX}%`,
                    top: `${callout.labelY}%`,
                    animationDelay: `${0.3 + index * 0.35}s`,
                  }}
                >
                  {callout.text}
                </div>
              ))}
            </>
          ) : null}
        </div>
        <span
          className={`portrait-landing__arrow ${showEnterButton && !isEntering ? "portrait-landing__arrow--visible" : ""}`.trim()}
          role="button"
          aria-label="Click to enter KY World"
          onClick={handleEnter}
          onKeyDown={handleArrowKeyDown}
          aria-hidden={!showEnterButton || isEntering}
          tabIndex={showEnterButton && !isEntering ? 0 : -1}
        >
          <span>Click to enter KY World</span>
          <span className="portrait-landing__arrow-icon" aria-hidden="true">
            &rarr;
          </span>
        </span>
      </section>
      {hasEntered ? (
        <Element name="Publications">
          <section className="portrait-landing__publication">
            <Publication
              sourceCanvasRef={portraitCanvasRef}
              decomposeProgress={decomposeProgress}
            />
          </section>
        </Element>
      ) : null}
    </main>
  );
}
