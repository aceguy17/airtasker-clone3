import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { hashPassword } from "./password";

/**
 * Phase 1 storage: a JSON file on disk.
 * Swap this module for Prisma/Postgres in Phase 2 without touching the pages,
 * as long as the exported function signatures stay the same.
 */

const DATA_FILE =
  process.env.DATA_FILE ?? path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "db.json");

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  suburb: string;
  bio: string;
  skills: string[];
  phoneVerified: boolean;
  createdAt: string;
};

export type Category = { id: string; name: string; icon: string };

export type TaskStatus = "open" | "in_progress" | "completed" | "cancelled";
export type EscrowStatus = "none" | "funded" | "released";

export type Task = {
  id: string;
  posterId: string;
  title: string;
  description: string;
  categoryId: string;
  mode: "in-person" | "remote";
  suburb: string;
  budgetType: "fixed" | "hourly" | "open";
  budget: number | null;
  dueDate: string | null;
  status: TaskStatus;
  hiredTaskerId: string | null;
  agreedPrice: number | null;
  escrow: EscrowStatus;
  workDoneAt: string | null;
  completedAt: string | null;
  createdAt: string;
};

export type Offer = {
  id: string;
  taskId: string;
  taskerId: string;
  price: number;
  message: string;
  availability: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
};

export type Message = {
  id: string;
  taskId: string;
  senderId: string;
  body: string;
  createdAt: string;
};

export type Review = {
  id: string;
  taskId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  text: string;
  createdAt: string;
};

export type Data = {
  users: User[];
  categories: Category[];
  tasks: Task[];
  offers: Offer[];
  messages: Message[];
  reviews: Review[];
  sessions: Record<string, string>; // token -> userId
};

export function newId(prefix: string) {
  return `${prefix}_${randomUUID().slice(0, 8)}`;
}

function seed(): Data {
  const now = Date.now();
  const iso = (days: number) => new Date(now + days * 864e5).toISOString();
  const pw = hashPassword("password123");

  const users: User[] = [
    {
      id: "u_alex",
      name: "Alex Poster",
      email: "alex@example.com",
      passwordHash: pw,
      suburb: "Melbourne",
      bio: "Busy professional who would rather outsource the chores.",
      skills: [],
      phoneVerified: true,
      createdAt: iso(-60),
    },
    {
      id: "u_sam",
      name: "Sam Carter",
      email: "sam@example.com",
      passwordHash: pw,
      suburb: "Mitcham",
      bio: "Handy with flat-pack furniture and general home tidy-ups. Five years of weekend work.",
      skills: ["Assembly", "Cleaning"],
      phoneVerified: true,
      createdAt: iso(-45),
    },
    {
      id: "u_priya",
      name: "Priya Nair",
      email: "priya@example.com",
      passwordHash: pw,
      suburb: "Richmond",
      bio: "Garden lover and reliable pet sitter. Happy to take on weekly jobs.",
      skills: ["Gardening", "Pet Care"],
      phoneVerified: true,
      createdAt: iso(-30),
    },
    {
      id: "u_tom",
      name: "Tom Walsh",
      email: "tom@example.com",
      passwordHash: pw,
      suburb: "Footscray",
      bio: "Painter and handyman, fully insured. Quotes are free and honest.",
      skills: ["Painting", "Handyman"],
      phoneVerified: false,
      createdAt: iso(-20),
    },
  ];

  const categories: Category[] = [
    { id: "c_cleaning", name: "Cleaning", icon: "🧽" },
    { id: "c_handyman", name: "Handyman", icon: "🔧" },
    { id: "c_assembly", name: "Assembly", icon: "🪑" },
    { id: "c_moving", name: "Moving & Delivery", icon: "📦" },
    { id: "c_gardening", name: "Gardening", icon: "🌿" },
    { id: "c_painting", name: "Painting", icon: "🎨" },
    { id: "c_tech", name: "Tech Help", icon: "💻" },
    { id: "c_pets", name: "Pet Care", icon: "🐾" },
    { id: "c_tutoring", name: "Tutoring", icon: "📚" },
    { id: "c_admin", name: "Admin & Online", icon: "🗂️" },
  ];

  const tasks: Task[] = [
    {
      id: "t_wardrobe",
      posterId: "u_alex",
      title: "Assemble IKEA wardrobe",
      description:
        "Three-door wardrobe, all parts and tools are on site. Should take about 3 hours. Must be assembled against the wall and anchored safely.",
      categoryId: "c_assembly",
      mode: "in-person",
      suburb: "Mitcham",
      budgetType: "fixed",
      budget: 80,
      dueDate: null,
      status: "open",
      hiredTaskerId: null,
      agreedPrice: null,
      escrow: "none",
      workDoneAt: null,
      completedAt: null,
      createdAt: iso(-1),
    },
    {
      id: "t_clean",
      posterId: "u_alex",
      title: "Fortnightly house clean, 3 bedrooms",
      description:
        "Standard clean of two bathrooms, kitchen, living areas and bedrooms. Supplies are provided. Ongoing work, flexible on the day.",
      categoryId: "c_cleaning",
      mode: "in-person",
      suburb: "Richmond",
      budgetType: "fixed",
      budget: 150,
      dueDate: null,
      status: "open",
      hiredTaskerId: null,
      agreedPrice: null,
      escrow: "none",
      workDoneAt: null,
      completedAt: null,
      createdAt: iso(-2),
    },
    {
      id: "t_wifi",
      posterId: "u_alex",
      title: "Set up home Wi-Fi mesh network",
      description:
        "We have a mesh kit that needs configuring and placing around a three-level house. Remote help over video call is fine.",
      categoryId: "c_tech",
      mode: "remote",
      suburb: "Remote",
      budgetType: "open",
      budget: null,
      dueDate: null,
      status: "open",
      hiredTaskerId: null,
      agreedPrice: null,
      escrow: "none",
      workDoneAt: null,
      completedAt: null,
      createdAt: iso(-3),
    },
  ];

  const offers: Offer[] = [
    {
      id: "o_seed1",
      taskId: "t_wardrobe",
      taskerId: "u_sam",
      price: 70,
      message:
        "Hi Alex, I've assembled plenty of wardrobes like this. I can come next weekday evening with my own tools.",
      availability: "Weekday evenings",
      status: "pending",
      createdAt: iso(-0.5),
    },
  ];

  return { users, categories, tasks, offers, messages: [], reviews: [], sessions: {} };
}

export function readData(): Data {
  if (!fs.existsSync(/*turbopackIgnore: true*/ DATA_FILE)) {
    const d = seed();
    writeData(d);
    return d;
  }
  return JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ DATA_FILE, "utf8")) as Data;
}

export function writeData(d: Data) {
  fs.mkdirSync(/*turbopackIgnore: true*/ path.dirname(DATA_FILE), { recursive: true });
  const tmp = `${DATA_FILE}.${randomUUID()}.tmp`;
  fs.writeFileSync(/*turbopackIgnore: true*/ tmp, JSON.stringify(d, null, 2));
  fs.renameSync(/*turbopackIgnore: true*/ tmp, DATA_FILE);
}

/** Read, mutate and persist in one step. */
export function update<T>(fn: (d: Data) => T): T {
  const d = readData();
  const result = fn(d);
  writeData(d);
  return result;
}
