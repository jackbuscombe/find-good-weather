// src/server/db/client.ts
import { PrismaClient } from "@prisma/client";
import { MongoClient } from "mongodb";
import { env } from "../../env/server.mjs";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var mongo: MongoClient | undefined;
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient>;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

export const mongo =
  global.mongo || new MongoClient(process.env.MONGODB_URL as string, {});

// if (env.NODE_ENV !== "production") {
//   global.prisma = prisma;

//   global.mongo = mongo;
// }

// // Mongo
// const URI = process.env.MONGODB_URL;
// const options = {};

// if (!URI) throw new Error("No MongoDB Keys");

// let client = new MongoClient(URI, options);
// let clientPromise;

// if (env.NODE_ENV !== "production") {
//   global.prisma = prisma;

//   if (!global._mongoClientPromise) {
//     global._mongoClientPromise = client.connect();
//   }

//   clientPromise = global._mongoClientPromise;
// } else {
//   clientPromise = client.connect();
// }

// export default clientPromise;

export async function connectToCluster() {
  let mongoClient;

  try {
    mongoClient = new MongoClient(process.env.MONGODB_URL as string);
    console.log("Connecting to MongoDB Atlas cluster...");
    await mongoClient.connect();
    console.log("Successfully connected to MongoDB Atlas!");

    return mongoClient;
  } catch (error) {
    console.error("Connection to MongoDB Atlas failed!", error);
    process.exit();
  }
}
