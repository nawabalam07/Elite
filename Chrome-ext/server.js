import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/tracker");

const schema = new mongoose.Schema({
  site: String,
  time: Number,
  category: String,
  date: { type: Date, default: Date.now }
});

const TimeLog = mongoose.model("TimeLog", schema);

// Store logs
app.post("/log", async (req, res) => {
  const { site, time, category } = req.body;
  await TimeLog.create({ site, time, category });
  res.json({ success: true });
});

// Weekly report
app.get("/weekly-report", async (req, res) => {
  const oneWeek = new Date();
  oneWeek.setDate(oneWeek.getDate() - 7);

  const logs = await TimeLog.aggregate([
    { $match: { date: { $gte: oneWeek } } },
    { $group: { _id: "$category", total: { $sum: "$time" } } }
  ]);

  res.json(logs);
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
