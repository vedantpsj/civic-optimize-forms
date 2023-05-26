const express = require("express");
const fs = require("fs");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

const app = express();
const port = 3000;

const path = require("path");
const cors = require("cors");

app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Content-Type"],
  })
);

class response {
  status;
  message;
  data;
  constructor(status, message, data) {
    return {
      status: status ?? 200,
      message: message ?? "Success",
      data: data ?? [],
    };
  }
}

app.get("/", async (req, res) => {
  let inventory = JSON.parse(
    fs.readFileSync("./assets/inventory.json", "utf8")
  );
  return res.send(inventory);
});

app.get("/get-show-titles", async (req, res) => {
  try {
    let inventory = JSON.parse(
      fs.readFileSync("./assets/inventory.json", "utf8")
    );
    let showTitles = inventory.map((el) => el.show_title);
    showTitles = Array.from(new Set([...showTitles]));
    return res.send(showTitles);
  } catch (error) {
    return res.send(error.message).status(400);
  }
});

app.get("/get-titles", async (req, res) => {
  try {
    let inventory = JSON.parse(
      fs.readFileSync("./assets/inventory.json", "utf8")
    );
    const show_title = req.query.show_title;
    let items = inventory.filter(
      (inventoryItem) => inventoryItem.show_title === show_title
    );

    items = items.map((item) => item.item);
    res.send(items);
  } catch (error) {
    return res.send(error.message).status(400);
  }
});

app.get("/get-details", async (req, res) => {
  try {
    let inventory = JSON.parse(
      fs.readFileSync("./assets/inventory.json", "utf8")
    );
    const show_title = req.query.show_title;
    const item = req.query.item;

    const itemInJSon = inventory.find(
      (inventoryItem) =>
        inventoryItem.show_title === show_title && inventoryItem.item === item
    );
    return res.send(itemInJSon);
  } catch (error) {
    return res.send(error.message).status(400);
  }
});

app.post("/validate", jsonParser, async (req, res) => {
  try {
    let inventory = JSON.parse(
      fs.readFileSync("./assets/inventory.json", "utf8")
    );
    const actionType = req.body.action_type;
    const show_title = req.body.show_title;
    const item = req.body.item;
    const itemInJson = inventory.find(
      (inventoryItem) =>
        inventoryItem.show_title === show_title && inventoryItem.item === item
    );

    if (itemInJson && actionType === "0") {
      return res
        .status(400)
        .send(
          new response(
            400,
            "Show Title and item name can not be same to already existing title and item name",
            []
          )
        );
    }

    return res.send(new response());
  } catch (error) {
    return res.send(error.message).status(400);
  }
});

app.post("/manage-inventory", jsonParser, async (req, res) => {
  try {
    let inventory = JSON.parse(
      fs.readFileSync("./assets/inventory.json", "utf8")
    );
    const actionType = req.body.action_type;
    let content = inventory;
    if (actionType === "0") {
      const obj = {
        show_title: req.body.show_title,
        item: req.body.item,
        category: req.body.category,
        rent_for_2_weeks: req.body.cost,
        quantity: req.body.quantity,
      };
      content = [...content, obj];
      fs.writeFileSync("assets/inventory.json", JSON.stringify(content));
      res.send(new response());
    } else if (actionType === "1") {
      const el = content.find(
        (el) =>
          el.show_title === req.body.show_title && el.item === req.body.item
      );
      if (el) {
        el.category = req.body.category;
        el.rent_for_2_weeks = req.body.cost;
        el.quantity = req.body.quantity;
      }
      fs.writeFileSync("assets/inventory.json", JSON.stringify(content));
      res.send(new response());
    } else if (actionType === "2") {
      content = content.filter((el) =>
        el.show_title === req.body.show_title && el.item === req.body.item
          ? false
          : true
      );
      console.log(content);
      fs.writeFileSync("assets/inventory.json", JSON.stringify(content));
      res.send(new response());
    }
  } catch (error) {
    return res.send(error.message).status(400);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
