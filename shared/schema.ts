import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const artworks = pgTable("artworks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  primaryColor: text("primary_color").notNull(),
  missionType: text("mission_type").notNull(),
  logoPath: text("logo_path"),
  templateType: text("template_type").notNull(),
  generatedImagePath: text("generated_image_path"),
  createdAt: timestamp("created_at").defaultNow(),
  metadata: json("metadata"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertArtworkSchema = createInsertSchema(artworks).pick({
  companyName: true,
  primaryColor: true,
  missionType: true,
  logoPath: true,
  templateType: true,
});

export const artworkFormSchema = z.object({
  companyName: z.string().min(1, "Nome da empresa é obrigatório"),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor deve estar no formato hexadecimal"),
  missionType: z.enum(["follow-instagram", "choose-proplayer"], {
    required_error: "Selecione um tipo de missão",
  }),
  templateType: z.enum(["instagram", "proplayer"]).default("instagram"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertArtwork = z.infer<typeof insertArtworkSchema>;
export type Artwork = typeof artworks.$inferSelect;
export type ArtworkFormData = z.infer<typeof artworkFormSchema>;
