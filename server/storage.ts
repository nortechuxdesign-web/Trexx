import { type User, type InsertUser, type Artwork, type InsertArtwork } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Artwork methods
  getArtwork(id: string): Promise<Artwork | undefined>;
  createArtwork(artwork: InsertArtwork): Promise<Artwork>;
  getRecentArtworks(limit?: number): Promise<Artwork[]>;
  updateArtwork(id: string, updates: Partial<Artwork>): Promise<Artwork | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private artworks: Map<string, Artwork>;

  constructor() {
    this.users = new Map();
    this.artworks = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getArtwork(id: string): Promise<Artwork | undefined> {
    return this.artworks.get(id);
  }

  async createArtwork(insertArtwork: InsertArtwork): Promise<Artwork> {
    const id = randomUUID();
    const artwork: Artwork = {
      ...insertArtwork,
      id,
      logoPath: insertArtwork.logoPath || null,
      generatedImagePath: null,
      createdAt: new Date(),
      metadata: null,
    };
    this.artworks.set(id, artwork);
    return artwork;
  }

  async getRecentArtworks(limit: number = 10): Promise<Artwork[]> {
    const allArtworks = Array.from(this.artworks.values());
    return allArtworks
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async updateArtwork(id: string, updates: Partial<Artwork>): Promise<Artwork | undefined> {
    const existing = this.artworks.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.artworks.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
