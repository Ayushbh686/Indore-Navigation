// import StoreCanvasViewerGrid from "./components/MapEditor"; // Adjust the path if needed

/*
const dummyFloor = {
  level: 1,
  width: 30,
  height: 20,
  grid: Array(20)
    .fill(0)
    .map(() => Array(30).fill(0)), // Initialize all walkable

  shelves: [
    { label: "Produce", startX: 5, startY: 4, width: 4, height: 2 },
    { label: "Dairy", startX: 10, startY: 4, width: 4, height: 2 },
    { label: "Snacks", startX: 5, startY: 10, width: 6, height: 2 },
    { label: "Meat", startX: 12, startY: 10, width: 5, height: 2 }
  ],

  products: [
    { name: "Apples", x: 6, y: 5, shelfLabel: "Produce" },
    { name: "Milk", x: 11, y: 5, shelfLabel: "Dairy" },
    { name: "Chips", x: 7, y: 11, shelfLabel: "Snacks" },
    { name: "Chicken", x: 13, y: 11, shelfLabel: "Meat" }
  ],

  transitions: [
    { x: 0, y: 19, toFloor: 2, toX: 1, toY: 1, type: "stairs" as "stairs" },
    { x: 29, y: 0, toFloor: 2, toX: 5, toY: 5, type: "elevator" as "elevator" }
  ]
};

// Mark shelf area as blocked in grid (1)
dummyFloor.shelves.forEach((shelf) => {
  for (let dy = 0; dy < shelf.height; dy++) {
    for (let dx = 0; dx < shelf.width; dx++) {
      const y = shelf.startY + dy;
      const x = shelf.startX + dx;
      dummyFloor.grid[y][x] = 1; // blocked
    }
  }
});

function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>🛒 Store Layout Viewer</h2>
      <StoreCanvasViewerGrid floor={dummyFloor} />
    </div>
  );
}

export default App;
*/

import { BrowserRouter, Routes, Route } from "react-router";
import Index from "./pages/Index";
import AdminView from "./pages/AdminView";
import NavigateView from "./pages/NavigateView";
import NotFound from "./pages/NotFound";
import Header from "./components/header";

export default function App(){
  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminView />} />
          <Route path="/navigate" element={<NavigateView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
    
}