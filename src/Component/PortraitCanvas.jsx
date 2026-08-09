import { useEffect, useRef } from "react";
import { portraitRender } from "../../Scripts/1";
import "./PortraitCanvas.css";

export function PortraitCanvas({
  width = 500,
  height = 500,
  className = "",
  label = "Animated line portrait",
  decomposeProgress = 0,
  canvasRef: externalCanvasRef = null,
}) {
  const canvasRef = useRef(null);
  const decomposeProgressRef = useRef(decomposeProgress);

  useEffect(() => {
    decomposeProgressRef.current = decomposeProgress;
  }, [decomposeProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    return portraitRender(canvas, {
      getDecomposeProgress: () => decomposeProgressRef.current,
    });
  }, []);

  return (
    <canvas
      ref={(node) => {
        canvasRef.current = node;

        if (!externalCanvasRef) {
          return;
        }

        if (typeof externalCanvasRef === "function") {
          externalCanvasRef(node);
          return;
        }

        externalCanvasRef.current = node;
      }}
      className={`portrait-canvas ${className}`.trim()}
      height={height}
      width={width}
      role="img"
      aria-label={label}
    />
  );
}
