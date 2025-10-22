import mongoose from "mongoose";

export const mongoDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      console.error("MONGODB_URI is missing from environment variables");
      throw new Error("MONGODB_URI is missing from environment variables");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri, {
      dbName: "llm-parameter-lab",
      ...(process.env.VERCEL === "1"
        ? {
          serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
          socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
          bufferCommands: false, // Disable mongoose buffering
          bufferMaxEntries: 0, // Disable mongoose buffering
        }
        : {}),
    });

    console.log("Connected to MongoDB successfully!");
    console.log("Database: llm-parameter-lab");
    console.log(`Host: ${mongoose.connection.host}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });
  } catch (error) {
    console.error("MongoDB connection error:", (error as Error).message);
    console.error("Full error:", error);
    // Don't exit in Vercel environment
    if (process.env.VERCEL !== "1") {
      process.exit(1);
    }
  }
};
