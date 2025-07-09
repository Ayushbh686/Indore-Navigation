import express , {urlencoded} from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Store,
  StoreSchema,
  FloorSchema,
  ShelfSchema,
  ProductSchema,
  TransitionSchema } from "./models/index.js";
import { PathFinding, markShelfOnGrid } from "./UtilFunctions.js";

dotenv.config();

const app = express();

app.use(cors({
    origin : "*",
    credentials : true
}));

app.use(express.json());
app.use(urlencoded({extended : true}));

console.log(process.env.PORT);

mongoose.connect(process.env.MONGODB_URL , {dbName : process.env.DB_NAME})
.then(() => {
    console.log("connected")
})
.then(()=>{
    app.on('error',(error)=>{
        console.log('ERRR ' , error);
        throw error;  
    });
    app.listen(process.env.PORT || 4000 , ()=>{
        console.log('Server is running at port : ', process.env.PORT);
    });
})
.catch((error) => {
    console.log("error :- " , error)
});


//storing new store data 
app.post('/api/store' , async (req , res)=>{
    try {
        const { name, address, floors } = req.body;
        const store = await Store.create({ name, address, floors });
        res.status(201).json({ storeId: store._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


//fetching store data
app.get('/api/store/:storeId', async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    // console.log(store.floors[0]._id);
    res.json(store);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: 'Store not found' });
  }
});


// POST add shelf
app.post('/api/store/:storeId/floor-level/:level/add-shelf', async (req, res) => {
  try {
    const { label, startX, startY, width, height, products = [] } = req.body;
    const store = await Store.findById(req.params.storeId);
    if (!store) return res.status(404).json({ error: "Store not found" });

    const level = parseInt(req.params.level);
    const floor = store.floors.find(f => f.level === level);
    if (!floor) return res.status(404).json({ error: "Floor not found" });

    const shelf = { label, startX, startY, width, height, products };
    floor.shelves.push(shelf);

    markShelfOnGrid(floor.grid, shelf);

    await store.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// POST /api/store/:storeId/floor/:floorId/add-product adding porduct
app.post('/api/store/:storeId/floor-level/:level/add-product', async (req, res) => {
  try {
    const { name, shelfLabel } = req.body;
    const store = await Store.findById(req.params.storeId);
    if (!store) return res.status(404).json({ error: "Store not found" });

    const level = parseInt(req.params.level);
    const floor = store.floors.find(f => f.level === level);
    if (!floor) return res.status(404).json({ error: "Floor not found" });

    const shelf = floor.shelves.find(s => s.label === shelfLabel);
    if (!shelf) return res.status(404).json({ error: "Shelf not found" });

    // Infer coordinates around shelf if needed — optional enhancement
    const product = { name, shelfLabel };

    // Add to shelf and global product list
    shelf.products.push(product);
    floor.products.push(product);

    await store.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// POST /api/store/:storeId/path  getting path
app.post('/api/store/:storeId/path', async (req, res) => {
  try {
    const { start, productNames } = req.body;
    const store = await Store.findById(req.params.storeId);
    if (!store) return res.status(404).json({ error: 'Store not found' });

    if (!start || start.x == null || start.y == null || start.floor == null) {
      return res.status(400).json({ error: 'Invalid start coordinates' });
    }

    const floorMap = {};
    const productOrder = [];

    for (const floor of store.floors) {
      for (const shelf of floor.shelves) {
        for (const product of shelf.products) {
          if (productNames.includes(product.name)) {
            if (!floorMap[floor.level]) floorMap[floor.level] = [];
            floorMap[floor.level].push({ name: product.name, shelf });
            productOrder.push({ name: product.name, floor: floor.level });
          }
        }
      }
    }

    if (productOrder.length !== productNames.length) {
      return res.status(400).json({ error: 'One or more products not found in any shelf.' });
    }

    let fullPath = [];
    let current = { ...start };
    for (const item of productOrder) {
      const targetFloor = store.floors.find(f => f.level === item.floor);
      const grid = targetFloor.grid;
      const shelf = targetFloor.shelves.find(s =>
        s.products.find(p => p.name === item.name)
      );
      if (!shelf) return res.status(404).json({ error: `Shelf for ${item.name} not found` });

      // If we are not on same floor, transition
      if (current.floor !== item.floor) {
        const fromFloor = store.floors.find(f => f.level === current.floor);
        const transition = fromFloor.transitions.find(t => t.toFloor === item.floor);
        if (!transition) {
          return res.status(400).json({ error: `No transition from floor ${current.floor} to ${item.floor}` });
        }

        const toFloor = store.floors.find(f => f.level === item.floor);
        const toGrid = toFloor.grid;

        const transPath = PathFinding(fromFloor.grid, current, [{ x: transition.x, y: transition.y }]);
        if (!transPath) return res.status(400).json({ error: `No path to transition on floor ${current.floor}` });

        fullPath.push(...transPath.slice(1)); // avoid repeating current
        current = { x: transition.toX, y: transition.toY, floor: item.floor };
        fullPath.push(current);
      }

      // Now on correct floor, path to product (adjacent tile)
      const adjacents = [];

      for (let dx = 0; dx < shelf.width; dx++) {
        for (let dy = 0; dy < shelf.height; dy++) {
          const sx = shelf.startX + dx;
          const sy = shelf.startY + dy;

          for (const [ox, oy] of [[0,1],[1,0],[0,-1],[-1,0],[1,1],[-1,-1],[-1,1],[1,-1]]) {
            const tx = sx + ox, ty = sy + oy;
            if (
              tx >= 0 && ty >= 0 &&
              tx < grid[0].length && ty < grid.length &&
              grid[ty][tx] === 0
            ) {
              adjacents.push({ x: tx, y: ty });
            }
          }
        }
      }

      const productPath = PathFinding(grid, current, adjacents);
      if (!productPath) {
        return res.status(400).json({ error: `No path to ${item.name} on floor ${item.floor}` });
      }

      fullPath.push(...productPath.slice(1));
      current = { ...productPath[productPath.length - 1], floor: item.floor };
    }

    res.json({ path: fullPath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// POST /api/store/:storeId/path-multifloor
// app.post('/store/:storeId/path-multifloor', async (req, res) => {
//   try {
// //     const { start, shoppingList } = req.body;
// //     const store = await Store.findById(req.params.storeId);
// //     if (!store) return res.status(404).json({ error: 'Store not found' });

// //     // Dummy multi-floor path (replace with real routing logic)
// //     const path = [start, { x: 2, y: 3, floor: start.floor }, { x: 5, y: 2, floor: 1 }];
// //     res.json({ path });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
