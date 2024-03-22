const express = require("express");
const fs = require("fs");
const schedule = require("node-schedule");
const { updateHcmsToken } = require("./updateHcmsTokens");

const dotenv = require("dotenv");
dotenv.config();

const { router: productionRoutes } = require("./theater-production");
const { router: rentalRoutes } = require("./theater-rentals");

const app = express();
const port = 3000;

const cors = require("cors");

app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Content-Type"],
  })
);

app.use("/api/production", productionRoutes);

app.use("/api/rentals", rentalRoutes);

app.get("/api/auth", async (req, res) => {
  if (req.query?.auth === process.env.AUTH) {
    let tokens = JSON.parse(fs.readFileSync("./assets/tokens.json", "utf8"));
    return res.send(tokens);
  }
  return res.status(400).send("Unauthorized");
});

// TODO: DONT REMOVE THIS AS IT IS USED IN CIVIC PLUS FORMS - feat/theater-rentals-inventory
// TODO: https://console.transform.civicplus.com/accounts
app.get("/api", async (req, res) => {
  let inventory = JSON.parse(
    fs.readFileSync("./assets/inventory.json", "utf8")
  );
  return res.send(inventory);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const job4 = schedule.scheduleJob("0 0 */5 * * ", async function () {
  let tokens = JSON.parse(fs.readFileSync("./assets/tokens.json", "utf8"));
  try {
    let body = await updateHcmsToken(tokens.form);
    console.log("tokens updated");
    tokens.hcmsToken = body.access_token;
    fs.writeFileSync("assets/tokens.json", JSON.stringify(tokens));
  } catch (error) {
    console.log(error);
  }
});
