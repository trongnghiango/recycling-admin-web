import mongoose from "mongoose";

function newConnection(uri: string) {
  //
  console.log(`Mongodb:: URI:: ${uri}`);
  const db = mongoose.createConnection(uri, {});

  db.on("error", function (error) {
    console.log(`MongoDB:: connection ${this.name} ${JSON.stringify(error)}`);
    db.close().catch(() =>
      console.log(`Mongodb:: failed to close connection ${this.name} `)
    );
  });

  db.on("connected", function () {
    mongoose.set("debug", function (col, method, query, doc) {
      console.log(`MongoDB Debug:: ${this.conn.name}::${col}`);
    });
    console.log(`MongoDB:: connected ${this.name}`);
  });

  db.on("disconnected", function () {
    console.log(`MongoDB:: disconnected ${this.name}`);
  });

  return db;
}
const { DB_URI = "" } = process.env;
export const testDB = newConnection(DB_URI);
