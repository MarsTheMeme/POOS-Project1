import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // This frontend connects directly to external PHP APIs
  // No backend routes needed for this application
  
  const httpServer = createServer(app);
  return httpServer;
}
