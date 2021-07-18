const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();

dotenv.config();

const artistRoute = require("./routes/artist.routes");
const userRoute = require("./routes/user.routes");
const filmRoute = require("./routes/films.routes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: "application/vnd.api+json" }));
app.use(cors());

app.use(artistRoute);
app.use(userRoute);
app.use(filmRoute);
module.exports = app;
