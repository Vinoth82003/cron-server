require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");
const axios = require("axios");

const app = express();

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mtmhssDB";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// import reminder

const sendReminderEmail = require("./Notification/sendReminderEmail");

console.log("\nUpdated Schedule Will Run in 05:00 PM UTC\n");

// 🕕 CRON JOB - Runs Every Day at 6:30 AM UTC
cron.schedule(
  "30 10 * * *",
  async () => {
    console.log("🔔 Running event reminder at 5:00 PM UTC...");

    try {
      // Fetch all events from API
      const response = await axios.get(`${API_URL}/api/events`);
      const events = response.data;

      if (!events.length) {
        console.log("✅ No events found.");
        return;
      }

      // Get Tomorrow's Date (UTC)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setUTCHours(0, 0, 0, 0); // Ensure UTC comparison

      console.log("🔍 Checking for events on:", tomorrow.toISOString());

      // Filter events starting tomorrow
      const upcomingEvents = events.filter((event) => {
        const eventDate = new Date(event.fromDate);
        eventDate.setUTCHours(0, 0, 0, 0); // Convert event date to UTC midnight
        return eventDate.getTime() === tomorrow.getTime();
      });

      if (upcomingEvents.length > 0) {
        console.log(
          `📅 Found ${upcomingEvents.length} event(s) starting tomorrow.`
        );

        // Fetch registered members and send notifications
        for (const event of upcomingEvents) {
          console.log(`🔍 Fetching registered users for event: ${event.title}`);

          try {
            const regResponse = await axios.get(
              `${API_URL}/api/events/getRegistration/${event._id}`
            );
            const registeredUsers = regResponse.data.registration;

            console.log("users", registeredUsers);

            if (registeredUsers.length > 0) {
              registeredUsers.forEach((user) => {
                sendReminderEmail(user, event);
                console.log(user.name);
              });
            } else {
              console.log(
                `🚫 No registrations found for event: ${event.title}`
              );
            }
          } catch (err) {
            console.error(
              `❌ Error fetching registrations for event ${event.title}:`,
              err.message
            );
          }
        }
      } else {
        console.log("✅ No upcoming events for tomorrow.");
      }

      //   "http://localhost:8000/api/students/get/students/10,1"
    } catch (error) {
      console.error("❌ Error fetching events:", error.message);
    }
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
