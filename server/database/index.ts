import mongoose from "mongoose";
import Logger from "../core/logger";
import { db, dburi } from "../config";

const host = process.env.NODE_ENV === "development" ? "localhost" : db.host;

// Build the connection string
// const dbURI = `mongodb://${db.user}:${encodeURIComponent(
//   db.password
// )}@${host}:${db.port}/${db.name}`;

// const dbURI = dburi;

const dbURI =
  `mongodb+srv://admin:${encodeURIComponent('Nghia385685')}@cluster0.44huysk.mongodb.net`;

const options = {
  autoIndex: true,
  minPoolSize: db.minPoolSize, // Maintain up to x socket connections
  maxPoolSize: db.maxPoolSize, // Maintain up to x socket connections
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

function setRunValidators() {
  this.setOptions({ runValidators: true });
}

mongoose.set("strictQuery", true);

// Create the database connection
mongoose
  .plugin((schema: any) => {
    schema.pre("findOneAndUpdate", setRunValidators);
    schema.pre("updateMany", setRunValidators);
    schema.pre("updateOne", setRunValidators);
    schema.pre("update", setRunValidators);
  })
  .connect(dbURI, options)
  .then(() => {
    Logger.info("Mongoose connection done");
  })
  .catch((e) => {
    Logger.info("Mongoose connection error");
    Logger.info(`${dbURI}`);
    Logger.info("Err::", e);
  });

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on("connected", () => {
  Logger.debug(`Mongoose default connection open to:: ${dbURI}`);
});

// If the connection throws an error
mongoose.connection.on("error", (err) => {
  Logger.error(`Mongoose default connection error: ${err}`);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", () => {
  Logger.info("Mongoose default connection disconnected");
});

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    Logger.info(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});

export const connection = mongoose.connection;
