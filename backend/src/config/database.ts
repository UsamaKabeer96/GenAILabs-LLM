import mongoose from "mongoose";

export const mongoDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      console.error("MONGODB_URI is missing from environment variables");
      throw new Error("MONGODB_URI is missing from environment variables");
    }

    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
      return;
    }

    console.log("🔄 Connecting to MongoDB...");
    console.log("🌍 Environment:", process.env.NODE_ENV);
    console.log("☁️ Vercel:", process.env.VERCEL);
    console.log("🔗 URI exists:", !!uri);
    console.log("🔗 URI starts with:", uri?.substring(0, 20) + "...");

    await mongoose.connect(uri, {
      dbName: "llm-parameter-lab",
      ...(process.env.VERCEL === "1"
        ? {
          serverSelectionTimeoutMS: 10000, // Increased timeout for Vercel
          socketTimeoutMS: 45000,
          bufferCommands: false,
          bufferMaxEntries: 0,
          maxPoolSize: 1, // Limit connection pool for serverless
          minPoolSize: 0,
        }
        : {
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        }),
    });

    console.log("✅ Connected to MongoDB successfully!");
    console.log("📊 Database: llm-parameter-lab");
    console.log(`🏠 Host: ${mongoose.connection.host}`);
    console.log(`🔌 Ready State: ${mongoose.connection.readyState}`);
    console.log(`🔗 Connection ID: ${mongoose.connection.id}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
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
