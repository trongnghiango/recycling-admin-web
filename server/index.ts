import https from "https"
import fs from "fs"
import path from "path"
import express from "express"
import next from "next"
import { parse } from "url"
import * as middlewares from "./middlewares"
import cors from "cors"
import api from "./api"
import Logger from "./core/logger"
// dotenv.config({path: "../.env"});
import { corsUrl, port } from "./config"
import "./database" // initialize database

// var options = {
//   key: fs.readFileSync(path.join(__dirname, "../ssl/privatekey.pem")),
//   cert: fs.readFileSync(path.join(__dirname, "../ssl/ortho-viewer_com.pem")),
// }

process.on("uncaughtException", (e) => {
  Logger.error(`uncaughtException:: ${e}`)
})

const app = express()

const dev = process.env.NODE_ENV !== "production"
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

const PORT = parseInt(port || "1338", 10)

//
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }))
app.use(
  express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
)
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }))

// app.use(cors());

// app.use("/api/v1", api)

nextApp.prepare().then(() => {

  // app.get("/api/users", (_req, res) => {
  //   res.json({
  //     users,
  //   })
  // })

  //
  app.use((req, res, _next) => {
    const parsedUrl = parse(req.url!, true)
    nextHandler(req, res, parsedUrl)
  })

  app.use(middlewares.notFound)
  app.use(middlewares.errorHandler)

  app
    .listen(PORT, () => {
      Logger.info(
        `> Server listening at http://localhost:${PORT} as ${dev ? "development" : process.env.NODE_ENV
        }`,
        { label: "SERVER" }
      )
    })
    .on("error", (e) => Logger.error(`onError:: ${e}`))

  // https
  //   .createServer(options, app)
  //   // .on("secureConnection", (socket) => {
  //   //   // HTTPS: secureConnection
  //   //   // HTTP: connection
  //   //   socket.setTimeout(10 * 60 * 1000) // 10 minutes
  //   // })
  //   .listen(PORT, () => {
  //     Logger.info(
  //       `> Server listening at https://localhost:${PORT} as ${dev ? "development" : process.env.NODE_ENV
  //       }`,
  //       { label: "SERVER" }
  //     )
  //   })
  //   .on("error", (e) => Logger.error(`onError:: ${e}`))

  // tslint:disable-next-line:no-console
})
