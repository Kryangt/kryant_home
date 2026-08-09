const CANVAS_WIDTH = 980;
const CANVAS_HEIGHT = 700;
const LINE_WIDTH = 4;
const TRAIL_LENGTH = 0.24;
const CIRCLE_RADIUS = 25;
const CIRCLE_FLOAT_DISTANCE = 6;
const CIRCLE_CELLS = [
  [408, 298],
  [721, 298],
  [255, 418],
  [564, 538],
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function interpolatePoint(start, end, progress) {
  return [
    start[0] + (end[0] - start[0]) * progress,
    start[1] + (end[1] - start[1]) * progress,
  ];
}

function sampleHermite([start, end, startTangent, endTangent], samples = 90) {
  return Array.from({ length: samples + 1 }, (_, index) => {
    const u = index / samples;
    return [
      (2 * u ** 3 - 3 * u ** 2 + 1) * start[0] +
        (-2 * u ** 3 + 3 * u ** 2) * end[0] +
        (u ** 3 - 2 * u ** 2 + u) * startTangent[0] +
        (u ** 3 - u ** 2) * endTangent[0],
      (2 * u ** 3 - 3 * u ** 2 + 1) * start[1] +
        (-2 * u ** 3 + 3 * u ** 2) * end[1] +
        (u ** 3 - 2 * u ** 2 + u) * startTangent[1] +
        (u ** 3 - u ** 2) * endTangent[1],
    ];
  });
}

function roundedRectangle(x, y, width, height, radius, samples = 10) {
  const points = [[x + radius, y], [x + width - radius, y]];
  const corners = [
    [x + width - radius, y + radius, -Math.PI / 2, 0, [x + width, y + height - radius]],
    [x + width - radius, y + height - radius, 0, Math.PI / 2, [x + radius, y + height]],
    [x + radius, y + height - radius, Math.PI / 2, Math.PI, [x, y + radius]],
    [x + radius, y + radius, Math.PI, Math.PI * 1.5, null],
  ];

  corners.forEach(([cx, cy, start, end, next]) => {
    for (let step = 1; step <= samples; step += 1) {
      const angle = start + ((end - start) * step) / samples;
      points.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
    }
    if (next) points.push(next);
  });
  points.push(points[0]);
  return points;
}

function reverse(points) {
  return [...points].reverse();
}

function circlePoints(centerX, centerY, radius, samples = 52) {
  return Array.from({ length: samples + 1 }, (_, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / samples;
    return [centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius];
  });
}

function createCircleCells() {
  return CIRCLE_CELLS.map(([x, y], index) => ({
    id: `scheduler-circle-${index + 1}`,
    x,
    y,
    phase: index * (Math.PI / 2),
    delay: index * 0.035,
  }));
}

// Each incoming route ends exactly where its first calendar stroke begins.
// This makes the moving trail appear to turn into the final illustration.
const FLOW_GROUPS = [
  {
    delay: 0,
    route: sampleHermite([[0, 92], [214, 126], [250, 16], [120, 0]]),
    strokes: [roundedRectangle(180, 126, 620, 472, 34)],
  },
  {
    delay: 0.055,
    route: sampleHermite([[980, 202], [800, 238], [-220, -24], [-100, 0]]),
    strokes: [reverse([[180, 238], [800, 238]]), reverse([[180, 358], [800, 358]]), reverse([[180, 478], [800, 478]])],
  },
  {
    delay: 0.105,
    route: sampleHermite([[302, 0], [297, 88], [-18, 100], [0, 55]]),
    strokes: [roundedRectangle(278, 88, 38, 88, 19), roundedRectangle(664, 88, 38, 88, 19)],
  },
  {
    delay: 0.16,
    route: sampleHermite([[522, 700], [486, 598], [-16, -125], [0, -65]]),
    strokes: [reverse([[486, 238], [486, 598]]), reverse([[330, 238], [330, 598]]), reverse([[642, 238], [642, 598]])],
  },
];

function polylineLength(points) {
  return points.slice(1).reduce(
    (total, point, index) => total + Math.hypot(point[0] - points[index][0], point[1] - points[index][1]),
    0,
  );
}

function slicePolyline(points, startProgress, endProgress) {
  const total = polylineLength(points);
  const startDistance = total * clamp(startProgress, 0, 1);
  const endDistance = total * clamp(endProgress, 0, 1);
  const visible = [];
  let previousLength = 0;

  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    const segmentLength = Math.hypot(end[0] - start[0], end[1] - start[1]);
    const currentLength = previousLength + segmentLength;
    if (currentLength >= startDistance && previousLength <= endDistance) {
      const from = (Math.max(startDistance, previousLength) - previousLength) / (segmentLength || 1);
      const to = (Math.min(endDistance, currentLength) - previousLength) / (segmentLength || 1);
      if (visible.length === 0) visible.push(interpolatePoint(start, end, from));
      visible.push(interpolatePoint(start, end, to));
    }
    previousLength = currentLength;
  }
  return visible;
}

function drawPolyline(context, points) {
  if (points.length < 2) return;
  // Rounded caps turn extremely short paths into detached dots. Wait until a
  // path has enough visible length to read as a continuous arriving stroke.
  if (polylineLength(points) < LINE_WIDTH * 2.5) return;
  context.beginPath();
  context.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([x, y]) => context.lineTo(x, y));
  context.stroke();
}

function drawProgressiveStrokes(context, strokes, progress) {
  const lengths = strokes.map(polylineLength);
  const totalLength = lengths.reduce((total, length) => total + length, 0);
  let distanceLeft = totalLength * clamp(progress, 0, 1);

  strokes.forEach((stroke, index) => {
    const strokeProgress = clamp(distanceLeft / lengths[index], 0, 1);
    drawPolyline(context, slicePolyline(stroke, 0, strokeProgress));
    distanceLeft -= lengths[index];
  });
}

function drawFloatingCircles(context, circles, progress, time, reduceMotion) {
  circles.forEach((circle) => {
    const circleProgress = clamp((progress - 0.64 - circle.delay) / 0.16, 0, 1);
    circle.visible = circleProgress === 1;
    if (circleProgress <= 0) return;

    const floatOffset = circleProgress === 1 && !reduceMotion
      ? Math.sin(time / 720 + circle.phase) * CIRCLE_FLOAT_DISTANCE
      : 0;
    const centerY = circle.y + floatOffset;
    drawPolyline(
      context,
      slicePolyline(circlePoints(circle.x, centerY, CIRCLE_RADIUS), 0, circleProgress),
    );

    circle.currentY = centerY;
  });
}

export function calendarRender(canvas, options = {}) {
  const context = canvas.getContext("2d");
  const getProgress = options.getProgress || (() => 0);
  const onHoverCircle = options.onHoverCircle || (() => {});
  const circles = createCircleCells();
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  let animationId;
  let hoveredCircleId = null;

  function updateHoveredCircle(event) {
    const bounds = canvas.getBoundingClientRect();
    const pointerX = ((event.clientX - bounds.left) / bounds.width) * canvas.width;
    const pointerY = ((event.clientY - bounds.top) / bounds.height) * canvas.height;
    const hoveredCircle = circles.find((circle) => circle.visible && (
      Math.hypot(pointerX - circle.x, pointerY - (circle.currentY ?? circle.y)) <= CIRCLE_RADIUS + 10
    ));
    const nextId = hoveredCircle?.id ?? null;
    if (nextId === hoveredCircleId) return;
    hoveredCircleId = nextId;
    onHoverCircle(hoveredCircle ?? null);
  }

  function clearHoveredCircle() {
    if (hoveredCircleId === null) return;
    hoveredCircleId = null;
    onHoverCircle(null);
  }

  canvas.addEventListener("pointermove", updateHoveredCircle);
  canvas.addEventListener("pointerleave", clearHoveredCircle);

  function draw(time = 0) {
    const progress = clamp(getProgress(), 0, 1);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#000000";
    context.lineWidth = LINE_WIDTH;
    context.lineCap = "round";
    context.lineJoin = "round";

    FLOW_GROUPS.forEach((group) => {
      const localProgress = clamp((progress - group.delay) / 0.58, 0, 1);
      const moveProgress = clamp(localProgress / 0.48, 0, 1);
      const constructProgress = clamp((localProgress - 0.46) / 0.54, 0, 1);
      const visibleLength = TRAIL_LENGTH * (1 - clamp((moveProgress - 0.82) / 0.18, 0, 1));
      const tailProgress = Math.max(0, moveProgress - visibleLength);

      // Keep the trail connected to the calendar until construction takes over.
      const routeHead = constructProgress > 0 ? 1 : moveProgress;
      drawPolyline(context, slicePolyline(group.route, tailProgress, routeHead));
      drawProgressiveStrokes(context, group.strokes, constructProgress);
    });

    drawFloatingCircles(context, circles, progress, time, reduceMotion);

    animationId = requestAnimationFrame(draw);
  }

  animationId = requestAnimationFrame(draw);
  return () => {
    cancelAnimationFrame(animationId);
    canvas.removeEventListener("pointermove", updateHoveredCircle);
    canvas.removeEventListener("pointerleave", clearHoveredCircle);
  };
}

export { CANVAS_HEIGHT, CANVAS_WIDTH };
