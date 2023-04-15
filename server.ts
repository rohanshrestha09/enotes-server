import express from "express";
import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import fileUpload from "express-fileupload";
import { rateLimit } from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./routes";
import swaggerDocument from "./swagger.json";

require("dotenv").config({ path: __dirname + "/.env" });

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(bodyParser.json());

app.use(fileUpload());

const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // 100
  standardHeaders: true,
  legacyHeaders: false,
});

initializeApp({
  credential: cert({
    type: "service_account",
    project_id: "enotes-server",
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  } as ServiceAccount),
  storageBucket: "gs://enotes-server.appspot.com",
});

app.use(limiter);

app.use("/api/v1", router);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { swaggerOptions: { persistAuthorization: true } })
);

app.listen(PORT);
