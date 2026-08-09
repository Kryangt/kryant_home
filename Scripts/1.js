const SAMPLE_COUNT = 100;
const TRAIL_CAPACITY = 20;

const STYLE = {
  color: "black",
  faceWidth: 3,
  lineWidth: 4,
  eyeRadius: 5,
};

const DEBUG_GUIDES = false;

export const DECOMPOSE_ROUTES = [
  { direction: -1, curveDistance: 150, endX: -210, endY: -330 },
  { direction: -1, curveDistance: 110, endX: -150, endY: -285 },
  { direction: 0, curveDistance: 45, endX: -20, endY: -350 },
  { direction: 1, curveDistance: 110, endX: 150, endY: -290 },
  { direction: 1, curveDistance: 155, endX: 220, endY: -340 },
];

export const PORTRAIT_PATHS = {
  face: {
    start: [-90, 40],
    horizontalVelocity: 100,
    verticalCurve: 140,
  },
  mouths: [
    [[-0.67, -56.375], [-14.67, -57.375], [-28.67, -57.375]],
    [[16, -47.386], [-11, -77.39], [-40, -49.36]],
    [[10, -55.39], [-13, -35.39], [-39, -55.39]],
    [[17, -56.39], [8, -75.39], [-9, -73.39]],
  ],
  hat: {
    brim: [
      [[-120.67, 88.96], [-126.67, 62.96], [-100.67, 23.96]],
      [[-100.67, 23.96], [2.67, 7.96], [116.67, 33.96]],
      [[116.67, 33.96], [142.33, 52.29], [141.33, 88.29]],
      [[141.33, 88.29], [-1.33, 128.96], [-120.67, 88.96]],
    ],
    top: [[-110.67, 88.96], [-1.33, 299.29], [120.67, 93.29]],
  },
};

const LETTER_BLUEPRINTS = [
  {
    key: "H",
    origin: [15, 40],
    moveOffsetMs: 0,
    moveTotalMs: 2000,
    movePathMs: 1500,
    drawDelayMs: 1500,
    drawDurationSeconds: 0.8,
    createStart: ({ width, height }) => [width, height],
    end: [82.67, -57.375],
    tangents: [[-400, 200], [300, 0]],
    curves: [
      [[82.67, -54.375], [80, -90.375], [82.67, -127.375]],
      [[80, -90.375], [92, -90.375], [124.67, -90.375]],
      [[122.67, -57.375], [124.67, -90.375], [122.67, -127.375]],
    ],
  },
  {
    key: "i",
    origin: [75, 50],
    moveOffsetMs: 0,
    moveTotalMs: 2000,
    movePathMs: 1500,
    drawDelayMs: 1500,
    drawDurationSeconds: 0.8,
    createStart: ({ width, height }) => [width, randomBetween(-height, 0)],
    end: [114.67, -116.7],
    tangents: [[-50, -200], [-100, -60]],
    curves: [
      [[114.67, -116.7], [110.67, -126.375], [103.67, -131.375]],
      [[104.67, -130.375], [90.67, -141.7], [102.67, -116.7]],
      [[101.67, -117.7], [105.67, -110.7], [106.67, -103.375]],
      [[106.67, -104.7], [105.67, -91.7], [91.67, -105.708]],
      [[84.33, -110.7], [102.33, -96.7], [93.33, -91.7]],
    ],
  },
  {
    key: "I",
    origin: [0, 0],
    moveOffsetMs: 2500,
    moveTotalMs: 2000,
    movePathMs: 1500,
    drawDelayMs: 4000,
    drawDurationSeconds: 1,
    createStart: ({ width, height }) => [-width, randomBetween(-height, 0)],
    end: [7.67, -140.71],
    tangents: [[300, 300], [300, -100]],
    curves: [
      [[7.67, -140.71], [28.67, -149.71], [50.67, -149.71]],
      [[27.33, -149.708], [28.33, -210.7], [32.33, -220.708]],
      [[-10.67, -223], [42.67, -219.05], [281.33, -215.05]],
    ],
  },
  {
    key: "M",
    origin: [0, 0],
    moveOffsetMs: 2500,
    moveTotalMs: 2000,
    movePathMs: 1000,
    drawDelayMs: 3500,
    drawDurationSeconds: 1,
    createStart: ({ width, height }) => [randomBetween(-width, 0), -height],
    end: [65.67, -218],
    tangents: [[300, 200], [300, -400]],
    curves: [
      [[65.67, -218], [68.67, -186.385], [85.67, -218.39]],
      [[27.33, -169.708], [28.33, -210.7], [32.33, -220.708]],
      [[87.66, -218.39], [97.33, -180.38], [103.33, -218.39]],
    ],
  },
  {
    key: "K",
    origin: [0, 0],
    moveOffsetMs: 3000,
    moveTotalMs: 4000,
    movePathMs: 3000,
    drawDelayMs: 6000,
    drawDurationSeconds: 1.25,
    createStart: ({ width, height }) => [-width, height * 2],
    end: [156, -216.06],
    tangents: [[-300, -50], [0, 400]],
    curves: [
      [[156, -216.06], [155.67, -181.04], [151.67, -124.04]],
      [[154.67, -167.04], [183.67, -155.04], [188.67, -126.04]],
      [[154.67, -166.04], [194.67, -192.04], [195.67, -216.04]],
    ],
  },
  {
    key: "Y",
    origin: [0, 0],
    moveOffsetMs: 3000,
    moveTotalMs: 4000,
    movePathMs: 3000,
    drawDelayMs: 6000,
    drawDurationSeconds: 1.25,
    createStart: ({ width, height }) => [randomBetween(-width, width), -height],
    end: [250.67, -216.72],
    tangents: [[-300, 50], [0, 300]],
    curves: [
      [[250.67, -216.72], [250, -184.71], [249.67, -164.71]],
      [[249, -165.71], [240.67, -121.71], [214.67, -150.71]],
      [[249, -165.71], [266.67, -88.71], [288.67, -132.71]],
    ],
  },
];

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function createRuntime(canvas) {
  return {
    centerX: canvas.width / 2 - 50,
    centerY: canvas.height / 2 + 95,
    scaleX: 1.55,
    scaleY: -1.55,
    previousTime: undefined,
    facePreviousTime: -1,
    facePreviousPoint: [...PORTRAIT_PATHS.face.start],
    facePoints: [[...PORTRAIT_PATHS.face.start]],
    hatPoints: [],
    hatTopPoints: [],
    mouthActive: false,
    mouthIndex: 0,
    letters: LETTER_BLUEPRINTS.map((letter) => ({
      ...letter,
      start: letter.createStart(canvas),
      movingPoints: [],
      staticPoints: letter.curves.map(() => []),
    })),
  };
}

export function portraitRender(canvas, options = {}) {
  const context = canvas.getContext("2d");
  const runtime = createRuntime(canvas);
  const getDecomposeProgress = options.getDecomposeProgress || (() => 0);
  let animationID;
  let startTimestamp = null;

  function draw(timestamp) {
    if (startTimestamp === null) {
      startTimestamp = timestamp;
    }

    const localTime = timestamp - startTimestamp;
    updatePortraitPlacement(runtime, localTime);

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.translate(runtime.centerX + 50, runtime.centerY);
    context.scale(runtime.scaleX, runtime.scaleY);

    const decomposeProgress = getDecomposeProgress();

    if (decomposeProgress > 0.01) {
      drawDecomposingPortrait(context, runtime, canvas, decomposeProgress);
      if (DEBUG_GUIDES) {
        drawDecomposeGuideCurves(context, runtime, canvas);
      }
    } else {
      drawFace(context, runtime, localTime);
      drawEyes(context, canvas, localTime);
      drawHat(context, runtime, localTime);
      drawMouth(context, runtime, localTime);
    }

    context.restore();

    animationID = requestAnimationFrame(draw);
  }

  canvas.onclick = () => {
    runtime.mouthActive = true;
    runtime.mouthIndex += 1;
  };

  animationID = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(animationID);
    canvas.onclick = null;
  };
}

export const protraitRender = portraitRender;

function updatePortraitPlacement(runtime, localTime) {
  runtime.previousTime = localTime / 1000;
}

function drawFace(context, runtime, localTime) {
  const t = localTime / 1000 - 1;

  if (t < 1) {
    drawFaceDynamically(context, runtime, t);
    return;
  }

  drawPolyline(context, runtime.facePoints, STYLE.faceWidth);
}

function drawFaceDynamically(context, runtime, t) {
  const { horizontalVelocity, verticalCurve } = PORTRAIT_PATHS.face;
  const delta = t - runtime.facePreviousTime;
  const currentX = runtime.facePreviousPoint[0] + horizontalVelocity * delta;
  const currentY =
    runtime.facePreviousPoint[1] + 2 * verticalCurve * runtime.facePreviousTime * delta;

  runtime.facePreviousTime = t;
  runtime.facePreviousPoint = [currentX, currentY];
  runtime.facePoints.push(runtime.facePreviousPoint);

  drawPolyline(context, runtime.facePoints, STYLE.faceWidth);
}

function drawEyes(context, canvas, localTime) {
  drawEye(context, getEyePosition(canvas, localTime, true));
  drawEye(context, getEyePosition(canvas, localTime, false));
}

function getEyePosition(canvas, localTime, isLeftEye) {
  const t = localTime / 1000;
  const easedT = Math.min(Math.max(isLeftEye ? t : t - 1, 0), 1);
  const wave = 20 * Math.sin(Math.PI * easedT * 4);

  if (isLeftEye) {
    const target = -25 + canvas.width / 2 + 10;
    return [-canvas.width / 2 - 10 + target * easedT, wave];
  }

  const target = canvas.width / 2 + 10 - 55;
  return [canvas.width / 2 + 60 - (target + 50) * easedT, wave];
}

function drawEye(context, position) {
  context.save();
  context.strokeStyle = STYLE.color;
  context.beginPath();
  context.arc(position[0], position[1], STYLE.eyeRadius, 0, 2 * Math.PI);
  context.stroke();
  context.fill();
  context.restore();
}

function drawHat(context, runtime, localTime) {
  const { brim, top } = PORTRAIT_PATHS.hat;

  if (localTime <= 2000) {
    drawCurvesByArcLength(context, brim, runtime.hatPoints, localTime, 2000);
    return;
  }

  if (localTime <= 3000) {
    drawStaticCurves(context, brim);
    drawCurvesByArcLength(context, [top], runtime.hatTopPoints, localTime - 2000, 1000);
    return;
  }

  drawStaticCurves(context, brim);
  drawStaticCurves(context, [top], true);
}

function drawMouth(context, runtime, localTime) {
  if (localTime <= 7000 || !runtime.mouthActive) {
    return;
  }

  const mouth =
    PORTRAIT_PATHS.mouths[runtime.mouthIndex % PORTRAIT_PATHS.mouths.length];

  context.save();
  context.translate(20, 0);
  drawQuadraticCurve(context, mouth, STYLE.faceWidth);
  context.restore();
}

function drawDecomposingPortrait(context, runtime, canvas, progress) {
  const strokes = createPortraitStrokes(runtime, canvas);

  strokes.forEach((stroke, index) => {
    drawDecomposingStroke(context, stroke, progress, index);
  });
}

function drawDecomposeGuideCurves(context, runtime, canvas) {
  const strokes = createPortraitStrokes(runtime, canvas);

  context.save();
  context.strokeStyle = "#c2410c";
  context.lineWidth = 1.5;
  context.setLineDash([8, 8]);

  strokes.forEach((points, index) => {
    const endPoint = points[points.length - 1];
    const route = DECOMPOSE_ROUTES[index % DECOMPOSE_ROUTES.length];
    const curveOffset = route.direction * route.curveDistance;
    const controlPoint = [
      endPoint[0] + curveOffset,
      endPoint[1] - 120 - index * 12,
    ];
    const bottomEnd = [route.endX, route.endY];
    const flowCurve = sampleQuadraticCurve([endPoint, controlPoint, bottomEnd], 60);
    drawPolyline(context, flowCurve, 1.5);
  });

  context.restore();
}

function createPortraitStrokes(runtime, canvas) {
  const { brim, top } = PORTRAIT_PATHS.hat;

  return [
    runtime.facePoints,
    sampleQuadraticCurve(brim[0], 28),
    sampleQuadraticCurve(brim[1], 28),
    sampleQuadraticCurve(brim[2], 28),
    sampleQuadraticCurve(top, 34),
  ].filter((points) => points.length > 1);
}

function drawDecomposingStroke(context, points, progress, seed) {
  const shrinkProgress = clamp(progress / 0.36, 0, 1);
  const growProgress = clamp(progress / 0.32, 0, 1);
  const moveProgress = clamp((progress - 0.34) / 0.66, 0, 1);
  const remainingPoints = slicePolylineByProgress(points, shrinkProgress, 1);
  const endPoint = points[points.length - 1];
  const route = DECOMPOSE_ROUTES[seed % DECOMPOSE_ROUTES.length];
  const curveOffset = route.direction * route.curveDistance;
  const controlPoint = [
    endPoint[0] + curveOffset,
    endPoint[1] - 120 - seed * 12,
  ];
  const bottomEnd = [route.endX, route.endY];
  const flowCurve = sampleQuadraticCurve([endPoint, controlPoint, bottomEnd], 60);
  const visibleLength = 0.38;
  const headProgress = interpolatePoint(
    [0, 0],
    [visibleLength, 0],
    growProgress,
  )[0] + moveProgress * (1 - visibleLength);
  const vanishProgress = clamp((progress - 0.78) / 0.22, 0, 1);
  const currentVisibleLength = visibleLength * (1 - vanishProgress);
  const tailProgress = Math.max(0, headProgress - currentVisibleLength);
  const movingPoints = slicePolylineByProgress(flowCurve, tailProgress, headProgress);

  if (remainingPoints.length > 1) {
    drawPolyline(context, remainingPoints, STYLE.lineWidth);
  }

  if (movingPoints.length > 1) {
    drawPolyline(context, movingPoints, STYLE.lineWidth);
  }
}

function sampleQuadraticCurve(curve, sampleCount) {
  const curveFunction = createBezierFunctions([curve])[0];
  const points = [];

  for (let index = 0; index <= sampleCount; index += 1) {
    points.push(curveFunction(index / sampleCount));
  }

  return points;
}

function slicePolylineByProgress(points, startProgress, endProgress) {
  const arcLength = numericalMeasurementFromPoints(points);
  const startDistance = arcLength.total * startProgress;
  const endDistance = arcLength.total * endProgress;
  const slicedPoints = [];
  let previousLength = 0;

  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    const segmentLength = Math.hypot(end[0] - start[0], end[1] - start[1]);
    const currentLength = previousLength + segmentLength;

    if (currentLength >= startDistance && previousLength <= endDistance) {
      const segmentStart = Math.max(startDistance, previousLength);
      const segmentEnd = Math.min(endDistance, currentLength);
      const segmentStartRatio = (segmentStart - previousLength) / (segmentLength || 1);
      const segmentEndRatio = (segmentEnd - previousLength) / (segmentLength || 1);
      const startPoint = interpolatePoint(start, end, segmentStartRatio);
      const endPoint = interpolatePoint(start, end, segmentEndRatio);

      if (slicedPoints.length === 0) {
        slicedPoints.push(startPoint);
      }

      slicedPoints.push(endPoint);
    }

    previousLength = currentLength;
  }

  return slicedPoints;
}

function numericalMeasurementFromPoints(points) {
  let total = 0;

  for (let index = 1; index < points.length; index += 1) {
    total += Math.hypot(
      points[index][0] - points[index - 1][0],
      points[index][1] - points[index - 1][1],
    );
  }

  return { total };
}

function interpolatePoint(start, end, progress) {
  return [
    start[0] + (end[0] - start[0]) * progress,
    start[1] + (end[1] - start[1]) * progress,
  ];
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}


function drawLetters(context, runtime, time) {
  runtime.letters.forEach((letter) => {
    const movingCurve = [
      letter.start,
      letter.end,
      letter.tangents[0],
      letter.tangents[1],
    ];

    context.save();
    context.translate(letter.origin[0], letter.origin[1]);
    drawMovingHermiteCurve(
      context,
      letter.moveTotalMs,
      letter.movePathMs,
      time - letter.moveOffsetMs,
      movingCurve,
      letter.movingPoints,
    );
    drawProgressiveCurves(
      context,
      time - letter.drawDelayMs,
      letter.drawDurationSeconds,
      letter.staticPoints,
      letter.curves,
    );
    context.restore();
  });

  if (time > 5000) {
    context.beginPath();
    context.moveTo(69, -158.7);
    context.lineTo(63.33, -172.7);
    context.lineWidth = STYLE.lineWidth;
    context.strokeStyle = STYLE.color;
    context.stroke();
  }
}

function drawProgressiveCurves(
  context,
  time,
  durationSeconds,
  pointsToDraw,
  curves,
) {
  const seconds = time / 1000;

  if (seconds <= 0) {
    return;
  }

  if (seconds > durationSeconds) {
    drawStaticCurves(context, curves);
    return;
  }

  const curveFunctions = createBezierFunctions(curves);
  const arcLengths = calculateArcLengths(curveFunctions);
  const totalDistance = arcLengths.reduce(
    (distance, arcLength) => distance + arcLength.total,
    0,
  );
  const traveledDistance = seconds * totalDistance / durationSeconds;
  let currentArcLength = 0;
  let previousLength = 0;

  for (let index = 0; index < arcLengths.length; index += 1) {
    currentArcLength += arcLengths[index].total;

    if (traveledDistance <= currentArcLength) {
      const u = convertDistanceToU(
        traveledDistance - previousLength,
        index,
        arcLengths,
      );
      pointsToDraw[index].push(curveFunctions[index](u));
      break;
    }

    previousLength = currentArcLength;
  }

  pointsToDraw.forEach((points) => drawPolyline(context, points, STYLE.lineWidth));
}

function drawMovingHermiteCurve(
  context,
  totalTime,
  movingTime,
  currentTime,
  controlPoints,
  points,
) {
  if (currentTime < 0 || currentTime > totalTime) {
    return;
  }

  const hermiteFunction = createHermiteFunction(controlPoints);
  const arcInfo = calculateArcLengths([hermiteFunction]);
  const totalDistance = arcInfo[0].total;
  const traveledDistance = currentTime / 1000 * totalDistance / (movingTime / 1000);
  const u = convertDistanceToU(traveledDistance, 0, arcInfo);

  if (points.length >= TRAIL_CAPACITY) {
    points.shift();
  }

  points.push(hermiteFunction(u));
  drawPolyline(context, points, STYLE.lineWidth);
}

function drawCurvesByArcLength(context, curves, points, currentTime, totalTime) {
  const curveFunctions = createBezierFunctions(curves);
  const arcLengths = calculateArcLengths(curveFunctions);
  const totalDistance = arcLengths.reduce(
    (distance, arcLength) => distance + arcLength.total,
    0,
  );
  const traveledDistance = currentTime / 1000 * totalDistance / (totalTime / 1000);
  let currentArcLength = 0;
  let previousLength = 0;

  for (let index = 0; index < arcLengths.length; index += 1) {
    currentArcLength += arcLengths[index].total;

    if (traveledDistance <= currentArcLength) {
      const u = convertDistanceToU(
        traveledDistance - previousLength,
        index,
        arcLengths,
      );
      points.push(curveFunctions[index](u));
      break;
    }

    previousLength = currentArcLength;
  }

  drawPolyline(context, points, STYLE.lineWidth);
}

function drawStaticCurves(context, curves, fill = false) {
  curves.forEach((curve) => drawQuadraticCurve(context, curve, STYLE.lineWidth, fill));
}

function drawQuadraticCurve(context, curve, lineWidth, fill = false) {
  context.save();
  context.beginPath();
  context.moveTo(curve[0][0], curve[0][1]);
  context.quadraticCurveTo(curve[1][0], curve[1][1], curve[2][0], curve[2][1]);
  context.strokeStyle = STYLE.color;
  context.lineWidth = lineWidth;
  context.stroke();

  if (fill) {
    context.fill();
  }

  context.restore();
}

function drawPolyline(context, points, lineWidth) {
  if (points.length === 0) {
    return;
  }

  context.save();
  context.beginPath();
  context.moveTo(points[0][0], points[0][1]);

  for (let index = 1; index < points.length; index += 1) {
    context.lineTo(points[index][0], points[index][1]);
  }

  context.strokeStyle = STYLE.color;
  context.lineWidth = lineWidth;
  context.stroke();
  context.restore();
}

function createBezierFunctions(curves) {
  return curves.map((curve) => (u) => {
    const [p0, p1, p2] = curve;
    const inverse = 1 - u;

    return [
      inverse ** 2 * p0[0] + 2 * inverse * u * p1[0] + u ** 2 * p2[0],
      inverse ** 2 * p0[1] + 2 * inverse * u * p1[1] + u ** 2 * p2[1],
    ];
  });
}

function createHermiteFunction(controlPoints) {
  const [startPoint, endPoint, startTangent, endTangent] = controlPoints;

  return (u) => [
    (2 * u ** 3 - 3 * u ** 2 + 1) * startPoint[0] +
      (-2 * u ** 3 + 3 * u ** 2) * endPoint[0] +
      (u ** 3 - 2 * u ** 2 + u) * startTangent[0] +
      (u ** 3 - u ** 2) * endTangent[0],
    (2 * u ** 3 - 3 * u ** 2 + 1) * startPoint[1] +
      (-2 * u ** 3 + 3 * u ** 2) * endPoint[1] +
      (u ** 3 - 2 * u ** 2 + u) * startTangent[1] +
      (u ** 3 - u ** 2) * endTangent[1],
  ];
}

function calculateArcLengths(functions) {
  return functions.map((curveFunction) => numericalMeasurement(curveFunction));
}

function numericalMeasurement(curveFunction) {
  let previous;
  let total = 0;
  const table = [];

  for (let index = 0; index <= SAMPLE_COUNT; index += 1) {
    const t = index / SAMPLE_COUNT;
    const current = curveFunction(t);

    if (previous !== undefined) {
      total += Math.hypot(current[0] - previous[0], current[1] - previous[1]);
    }

    table.push({ t, arcLength: total });
    previous = current;
  }

  return { total, table };
}

function convertDistanceToU(distance, segmentIndex, arcLengths) {
  const segment = arcLengths[segmentIndex];

  for (let index = 0; index < segment.table.length - 1; index += 1) {
    const p0 = segment.table[index].arcLength;
    const t0 = segment.table[index].t;
    const p1 = segment.table[index + 1].arcLength;
    const t1 = segment.table[index + 1].t;

    if (distance >= p0 && distance <= p1) {
      const ratio = (distance - p0) / (p1 - p0 || 1);
      return t0 + ratio * (t1 - t0);
    }
  }

  return 1;
}
