require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");
const axios = require("axios");
const { default: BlobUrl } = require("./Delete/BlobUrls");

const app = express();

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/shareme";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

cron.schedule(
  "* * * * *",
  async () => {
    console.log("🔔 Running event reminder");
    // const blobUrl = BlobUrl.find({});

    // await fetch("http://localhost:3000/api/delete", {
    //   method: "DELETE",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ code: "4321" }),
    // });
    console.log("Date / Time:", new Date().toLocaleString());
  },
  {
    scheduled: true,
    timezone: "Asia/Singapore",
  }
);

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("Server is running properly");
});
