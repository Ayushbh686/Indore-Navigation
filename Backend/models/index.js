import mongoose from "mongoose";

//transition schema
const TransitionSchema = new mongoose.Schema({
  x: Number,
  y: Number,
  toFloor: Number,
  toX: Number,
  toY: Number,
  type: { type: String, enum: ['stairs', 'elevator'] }
}, { _id: true });

// Product (embedded)
const ProductSchema = new mongoose.Schema({
  name: String,
  x: Number,
  y: Number,
  shelfLabel: String
}, { _id: true });

// Shelf (embedded)
const ShelfSchema = new mongoose.Schema({
  label: String,
  startX: Number,
  startY: Number,
  width: Number,
  height: Number,
  products: [ProductSchema] 
}, { _id: true });

// Floor (embedded)
const FloorSchema = new mongoose.Schema({
  level: Number,
  width: Number,
  height: Number,
  grid: [[Number]],
  shelves: [ShelfSchema],
  products: [ProductSchema],
  transitions: [TransitionSchema]
}, { _id: true });

// Store (main model)
const StoreSchema = new mongoose.Schema({
  name: String,
  address: String,
  floors: [FloorSchema]
});

const Store = mongoose.model('Store', StoreSchema);


export {
  Store,
  StoreSchema,
  FloorSchema,
  ShelfSchema,
  ProductSchema,
  TransitionSchema
};
