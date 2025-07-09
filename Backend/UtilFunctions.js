// PathFinding function
export function PathFinding(grid, start, goals) {
  const rows = grid.length;
  const cols = grid[0].length;
  const dirs = [
    [0, 1], [1, 0], [0, -1], [-1, 0],
    [1, 1], [-1, -1], [-1, 1], [1, -1]
  ];

  const isBlocked = (x, y) => {
    if (isNaN(x) || isNaN(y)) {
      console.warn("Invalid coordinates:", { x, y });
      return true;
    }
    if (x < 0 || y < 0 || y >= rows || x >= cols) return true;
    return grid[y][x] === 1;
  };



  const isAdjacentToGoal = (x, y) =>
    goals.some(g => Math.abs(g.x - x) <= 1 && Math.abs(g.y - y) <= 1);

  const key = (x, y) => `${x},${y}`;

  const queue = [{ x: start.x, y: start.y, cost: 0, path: [start] }];
  const visited = new Set([key(start.x, start.y)]);

  while (queue.length) {
    queue.sort((a, b) => a.cost - b.cost);
    const { x, y, path } = queue.shift();

    if (isAdjacentToGoal(x, y)) return path;

    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      const k = key(nx, ny);

      if (!isBlocked(nx, ny) && !visited.has(k)) {
        visited.add(k);
        queue.push({
          x: nx,
          y: ny,
          cost: path.length + 1,
          path: [...path, { x: nx, y: ny }]
        });
      }
    }
  }

  return null; // No path
}


// Helper: Mark grid cells blocked by shelf
export function markShelfOnGrid(grid, shelf) {
  for (let dy = 0; dy < shelf.height; dy++) {
    for (let dx = 0; dx < shelf.width; dx++) {
      const y = shelf.startY + dy;
      const x = shelf.startX + dx;
      if (grid[y] && grid[y][x] !== undefined) grid[y][x] = 1;
    }
  }
}