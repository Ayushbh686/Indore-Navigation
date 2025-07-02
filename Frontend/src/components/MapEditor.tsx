import React, { useRef, useEffect } from "react";

type GridCell = 0 | 1;

interface Shelf {
  label: string;
  startX: number;
  startY: number;
  width: number;
  height: number;
}

interface Product {
  name: string;
  x: number;
  y: number;
  shelfLabel: string;
}

interface Transition {
  x: number;
  y: number;
  toFloor: number;
  toX: number;
  toY: number;
  type: "stairs" | "elevator";
}

interface Floor {
  level: number;
  width: number;
  height: number;
  grid: GridCell[][];
  shelves: Shelf[];
  products: Product[];
  transitions?: Transition[];
}

interface StoreCanvasViewerGridProps {
  floor: Floor;
}

const CELL_SIZE = 20;

const StoreCanvasViewerGrid: React.FC<StoreCanvasViewerGridProps> = ({ floor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    draw();
  }, [floor]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = floor.width * CELL_SIZE;
    const canvasHeight = floor.height * CELL_SIZE;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Clear
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    drawGrid(ctx);
    drawShelves(ctx);
    drawProducts(ctx);
    drawTransitions(ctx);
  };

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    for (let y = 0; y < floor.height; y++) {
      for (let x = 0; x < floor.width; x++) {
        const cell = floor.grid[y][x];

        // Walkable or Blocked
        ctx.fillStyle = cell === 1 ? "#a8a29e" : "#ffffff"; // gray for block
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        ctx.strokeStyle = "#e5e7eb";
        ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  };

  const drawShelves = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "#3b82f6"; // blue
    floor.shelves.forEach((shelf) => {
      const { startX, startY, width, height } = shelf;
      ctx.fillRect(
        startX * CELL_SIZE,
        startY * CELL_SIZE,
        width * CELL_SIZE,
        height * CELL_SIZE
      );

      ctx.fillStyle = "#ffffff";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        shelf.label,
        (startX + width / 2) * CELL_SIZE,
        (startY + height / 2) * CELL_SIZE + 4
      );
      ctx.fillStyle = "#3b82f6"; // reset fill
    });
  };

  const drawProducts = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "#10b981"; // green
    floor.products.forEach((product) => {
      const cx = product.x * CELL_SIZE + CELL_SIZE / 2;
      const cy = product.y * CELL_SIZE + CELL_SIZE / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = "#111827";
      ctx.font = "10px Arial";
      ctx.fillText(product.name, cx, cy - 10);
      ctx.fillStyle = "#10b981";
    });
  };

  const drawTransitions = (ctx: CanvasRenderingContext2D) => {
    if (!floor.transitions) return;
    ctx.fillStyle = "#f59e0b"; // orange

    floor.transitions.forEach((trans) => {
      ctx.fillRect(
        trans.x * CELL_SIZE,
        trans.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );

      ctx.fillStyle = "#000";
      ctx.font = "9px Arial";
      ctx.fillText(
        trans.type === "elevator" ? "E" : "S",
        trans.x * CELL_SIZE + CELL_SIZE / 2,
        trans.y * CELL_SIZE + CELL_SIZE / 2 + 4
      );
      ctx.fillStyle = "#f59e0b";
    });
  };

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">🧭 Floor {floor.level}</h3>
      <canvas
        ref={canvasRef}
        style={{ border: "1px solid #ccc", maxWidth: "100%" }}
      />
    </div>
  );
};

export default StoreCanvasViewerGrid;
