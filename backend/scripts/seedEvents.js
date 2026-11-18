require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Event = require("../models/Event");
const User = require("../models/User");

async function main() {
  const uri =
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/college_event_management";

  await mongoose.connect(uri);

  let admin = await User.findOne({ email: process.env.ADMIN_EMAIL || "admin@campus.edu" });
  if (!admin) {
    admin = await User.create({
      name: process.env.ADMIN_NAME || "System Admin",
      email: process.env.ADMIN_EMAIL || "admin@campus.edu",
      password: await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@1234", 12),
      role: "admin",
      department: process.env.ADMIN_DEPARTMENT || "Administration",
    });
  }

  const eventData = [
    {
      title: "AI & Machine Learning Workshop",
      description: "Hands-on introduction to machine learning models and practical AI tools.",
      category: "technical",
      startDate: new Date("2026-12-05T10:00:00"),
      endDate: new Date("2026-12-05T16:00:00"),
      registrationDeadline: new Date("2026-12-03T23:59:59"),
      venue: "Main Auditorium",
      capacity: 120,
      status: "upcoming",
    },
    {
      title: "Inter-College TechFest 2026",
      description: "A day of coding challenges, project showcases, robotics, and startup pitching.",
      category: "technical",
      startDate: new Date("2026-12-12T09:00:00"),
      endDate: new Date("2026-12-12T18:00:00"),
      registrationDeadline: new Date("2026-12-10T23:59:59"),
      venue: "Innovation Hall",
      capacity: 300,
      status: "upcoming",
    },
    {
      title: "Cultural Evening",
      description: "Music, dance, drama, and performances celebrating campus diversity.",
      category: "cultural",
      startDate: new Date("2026-12-18T17:30:00"),
      endDate: new Date("2026-12-18T21:30:00"),
      registrationDeadline: new Date("2026-12-16T23:59:59"),
      venue: "Open Air Theatre",
      capacity: 500,
      status: "upcoming",
    },
    {
      title: "Annual Sports Meet",
      description: "Athletics, team sports, and friendly competitions across the campus.",
      category: "sports",
      startDate: new Date("2026-12-20T08:00:00"),
      endDate: new Date("2026-12-20T17:00:00"),
      registrationDeadline: new Date("2026-12-18T23:59:59"),
      venue: "College Stadium",
      capacity: 250,
      status: "upcoming",
    },
  ];

  let inserted = 0;
  for (const event of eventData) {
    const exists = await Event.findOne({ title: event.title });
    if (!exists) {
      await Event.create({ ...event, organizer: admin._id });
      inserted += 1;
    }
  }

  console.log(`Seed complete: ${inserted} events inserted.`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error("Event seeding failed:", error.message);
  process.exit(1);
});
