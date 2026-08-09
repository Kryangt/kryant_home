import { useEffect, useRef, useState } from "react";
import "./Timeline.css";

const TIMELINE_EVENTS = [
  {
    title: "The Beginning",
    date: "2004.12.07",
    description: "I was born 🎉",
    side: "left",
  },
  {
    title: "My Kindergarten",
    date: "2007.xx.xx",
    description: "Big head, small body.",
    side: "right",
  },
  {
    title: "Family Milestone",
    date: "2010.10.24",
    description: "My little brother joined our family.",
    side: "left",
  },
  {
    title: "Hi, Madison",
    date: "2023.09.06",
    description: "A new place and the beginning of a new chapter.",
    side: "right",
  },
  {
    title: "Hi, Research",
    date: "2025.02.14",
    description: "I joined the People and Robots Lab to explore human-computer interaction.",
    side: "left",
  },
];

const JUMP_POSES = [
  { head: [27, 10], shoulder: [27, 22], hip: [27, 46], leftHand: [13, 37], rightHand: [41, 37], leftKnee: [21, 58], leftFoot: [16, 70], rightKnee: [34, 58], rightFoot: [41, 70] },
  { head: [31, 17], shoulder: [27, 29], hip: [23, 48], leftHand: [12, 47], rightHand: [42, 45], leftKnee: [16, 57], leftFoot: [9, 68], rightKnee: [33, 58], rightFoot: [43, 68] },
  { head: [37, 11], shoulder: [31, 24], hip: [22, 46], leftHand: [17, 16], rightHand: [47, 5], leftKnee: [17, 57], leftFoot: [9, 67], rightKnee: [31, 55], rightFoot: [24, 68] },
  { head: [36, 12], shoulder: [29, 25], hip: [21, 47], leftHand: [10, 15], rightHand: [47, 11], leftKnee: [15, 57], leftFoot: [7, 66], rightKnee: [31, 57], rightFoot: [25, 70] },
  { head: [34, 17], shoulder: [27, 29], hip: [23, 49], leftHand: [9, 39], rightHand: [45, 48], leftKnee: [17, 57], leftFoot: [9, 69], rightKnee: [34, 58], rightFoot: [43, 69] },
];

function interpolatePose(progress) {
  const scaled = Math.min(Math.max(progress, 0), 1) * (JUMP_POSES.length - 1);
  const poseIndex = Math.min(Math.floor(scaled), JUMP_POSES.length - 2);
  const localProgress = progress === 1 ? 1 : scaled - poseIndex;
  const easedProgress = localProgress * localProgress * (3 - 2 * localProgress);
  const startPose = JUMP_POSES[poseIndex];
  const endPose = JUMP_POSES[poseIndex + 1];
  return Object.fromEntries(Object.keys(startPose).map((joint) => [
    joint,
    startPose[joint].map((value, index) => value + (endPose[joint][index] - value) * easedProgress),
  ]));
}

function StickFigure({ jumpProgress, direction }) {
  const pose = interpolatePose(jumpProgress);
  const point = (joint) => pose[joint].join(" ");

  return (
    <svg className="timeline-stick-figure" viewBox="0 0 54 76" aria-hidden="true">
      <g transform={direction < 0 ? "translate(54 0) scale(-1 1)" : undefined}>
        <circle cx={pose.head[0]} cy={pose.head[1]} r="8" />
        <path d={`M ${point("shoulder")} Q 25 36 ${point("hip")}`} />
        <polyline points={`${point("leftHand")} ${point("shoulder")} ${point("rightHand")}`} />
        <polyline points={`${point("leftFoot")} ${point("leftKnee")} ${point("hip")} ${point("rightKnee")} ${point("rightFoot")}`} />
        <circle className="timeline-stick-hand" cx={pose.leftHand[0]} cy={pose.leftHand[1]} r="2.7" />
        <circle className="timeline-stick-hand" cx={pose.rightHand[0]} cy={pose.rightHand[1]} r="2.7" />
      </g>
    </svg>
  );
}

export function Timeline() {
  const timelineRef = useRef(null);
  const [motion, setMotion] = useState({ progress: 0, active: false, mobile: false });

  useEffect(() => {
    let motionFrameId;
    let lastFrameTime;
    let displayedProgress = 0;
    let targetMotion = { progress: 0, active: false, mobile: window.innerWidth <= 700 };

    function animateTimeline(time) {
      const elapsed = lastFrameTime === undefined ? 16 : Math.min(time - lastFrameTime, 64);
      lastFrameTime = time;
      const smoothing = 1 - Math.exp(-elapsed / 210);
      displayedProgress += (targetMotion.progress - displayedProgress) * smoothing;

      if (Math.abs(targetMotion.progress - displayedProgress) < 0.0005) {
        displayedProgress = targetMotion.progress;
      }

      setMotion({
        progress: displayedProgress,
        active: targetMotion.active,
        mobile: targetMotion.mobile,
      });

      if (displayedProgress !== targetMotion.progress) {
        motionFrameId = window.requestAnimationFrame(animateTimeline);
      } else {
        motionFrameId = undefined;
        lastFrameTime = undefined;
      }
    }

    function updateTimeline() {
      const timeline = timelineRef.current;
      if (!timeline) return;

      const bounds = timeline.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const active = bounds.top < viewportHeight * 0.82 && bounds.bottom > viewportHeight * 0.18;
      const travelDistance = Math.max(bounds.height - viewportHeight * 0.28, 1);
      const progress = Math.min(Math.max((viewportHeight * 0.78 - bounds.top) / travelDistance, 0), 1);
      targetMotion = { progress, active, mobile: window.innerWidth <= 700 };
      if (motionFrameId === undefined) {
        motionFrameId = window.requestAnimationFrame(animateTimeline);
      }
    }

    updateTimeline();
    window.addEventListener("scroll", updateTimeline, { passive: true });
    window.addEventListener("resize", updateTimeline);
    return () => {
      if (motionFrameId !== undefined) window.cancelAnimationFrame(motionFrameId);
      window.removeEventListener("scroll", updateTimeline);
      window.removeEventListener("resize", updateTimeline);
    };
  }, []);

  const jumpPosition = (() => {
    const landingX = motion.mobile ? [30, 70, 30, 70, 30] : [26.5, 73.5, 26.5, 73.5, 26.5];
    const landingY = motion.mobile ? [19, 224, 429, 634, 839] : [15, 245, 475, 705, 935];
    const scaledProgress = motion.progress * (landingX.length - 1);
    const jumpIndex = Math.min(Math.floor(scaledProgress), landingX.length - 2);
    const segmentProgress = motion.progress === 1 ? 1 : scaledProgress - jumpIndex;
    const jumpProgress = Math.min(Math.max((segmentProgress - 0.1) / 0.8, 0), 1);
    const x = landingX[jumpIndex] + (landingX[jumpIndex + 1] - landingX[jumpIndex]) * jumpProgress;
    const linearY = landingY[jumpIndex] + (landingY[jumpIndex + 1] - landingY[jumpIndex]) * jumpProgress;
    const y = linearY - Math.sin(Math.PI * jumpProgress) * (motion.mobile ? 70 : 100);
    return {
      x,
      y,
      jumpProgress,
      direction: landingX[jumpIndex + 1] > landingX[jumpIndex] ? 1 : -1,
    };
  })();

  const hasLandedOn = (index) => motion.active && (
    index === 0 || motion.progress >= index / (TIMELINE_EVENTS.length - 1)
  );

  return (
    <div className={`timeline ${motion.active ? "timeline--active" : ""}`} ref={timelineRef}>
      <div
        className="timeline-stick-position"
        style={{ left: `${jumpPosition.x}%`, top: `${jumpPosition.y}px` }}
      >
        <StickFigure jumpProgress={jumpPosition.jumpProgress} direction={jumpPosition.direction} />
      </div>

      {TIMELINE_EVENTS.map((event, index) => (
        <article
          className={`timeline-stop timeline-stop--${event.side} ${hasLandedOn(index) ? "timeline-stop--reached" : ""}`}
          key={event.title}
          style={{
            "--stop-top": `${90 + index * 230}px`,
            "--stop-top-mobile": `${80 + index * 205}px`,
            "--float-delay": `${index * -0.55}s`,
          }}
        >
          <div className="timeline-platform" aria-hidden="true" />
          <div className="timeline-card">
            <time>{event.date}</time>
            <h2>{event.title}</h2>
            <p>{event.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
