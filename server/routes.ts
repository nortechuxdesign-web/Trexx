import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { artworkFormSchema } from "@shared/schema";
import sharp from "sharp";

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Only PNG files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Ensure uploads directory exists
  const uploadsDir = "uploads";
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Serve uploaded files
  app.use("/uploads", express.static("uploads"));

  // Upload logo endpoint
  app.post("/api/upload-logo", upload.single("logo"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Validate image dimensions
      const metadata = await sharp(req.file.path).metadata();
      if (!metadata.width || !metadata.height || metadata.width < 500 || metadata.height < 500) {
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ 
          message: "Image must be at least 500x500 pixels" 
        });
      }

      // Generate unique filename
      const fileName = `logo-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
      const filePath = path.join(uploadsDir, fileName);

      // Process and save the image
      await sharp(req.file.path)
        .resize(500, 500, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(filePath);

      // Clean up temporary file
      fs.unlinkSync(req.file.path);

      res.json({
        success: true,
        logoPath: `/uploads/${fileName}`,
        fileName: fileName,
        dimensions: `${metadata.width}x${metadata.height}`,
      });
    } catch (error) {
      console.error("Logo upload error:", error);
      res.status(500).json({ message: "Failed to upload logo" });
    }
  });

  // Create artwork
  app.post("/api/artworks", async (req, res) => {
    try {
      const validatedData = artworkFormSchema.parse(req.body);
      
      const artwork = await storage.createArtwork({
        companyName: validatedData.companyName,
        primaryColor: validatedData.primaryColor,
        missionType: validatedData.missionType,
        templateType: validatedData.templateType,
        logoPath: req.body.logoPath || null,
      });

      res.json(artwork);
    } catch (error) {
      console.error("Create artwork error:", error);
      res.status(400).json({ message: "Invalid artwork data" });
    }
  });

  // Get recent artworks
  app.get("/api/artworks/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 8;
      const artworks = await storage.getRecentArtworks(limit);
      res.json(artworks);
    } catch (error) {
      console.error("Get recent artworks error:", error);
      res.status(500).json({ message: "Failed to fetch recent artworks" });
    }
  });

  // Generate artwork image
  app.post("/api/artworks/:id/generate", async (req, res) => {
    try {
      const { id } = req.params;
      const artwork = await storage.getArtwork(id);
      
      if (!artwork) {
        return res.status(404).json({ message: "Artwork not found" });
      }

      // Generate unique filename for the generated image
      const fileName = `generated-${id}-${Date.now()}.png`;
      const filePath = `/uploads/${fileName}`;

      // Update artwork with generated image path
      await storage.updateArtwork(id, {
        generatedImagePath: filePath,
      });

      res.json({
        success: true,
        imagePath: filePath,
        artworkId: id,
      });
    } catch (error) {
      console.error("Generate artwork error:", error);
      res.status(500).json({ message: "Failed to generate artwork" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
