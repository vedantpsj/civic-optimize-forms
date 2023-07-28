const express = require("express");
const fs = require("fs");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const axios = require("axios");

const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = 3001;

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
    const item = req.body.item_name;
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
    const actionType = req.body.type;
    let content = inventory;
    if (actionType === "0") {
      const id = await createNewHCMSInventory(req.body);
      const obj = {
        id: id,
        show_title: req.body.show_title,
        item: req.body.item_name,
        category: req.body.category,
        rent_for_2_weeks: req.body.cost,
        quantity: req.body.quantity,
        description: req.body.description,
      };
      content = [...content, obj];
      fs.writeFileSync("assets/inventory.json", JSON.stringify(content));
      res.send(new response());
    } else if (actionType === "1") {
      const el = content.find(
        (el) =>
          el.show_title === req.body.show_title &&
          el.item === req.body.item_name
      );

      await updateNewHcmsInventory({ ...el, ...req.body });
      if (el) {
        el.category = req.body.category;
        el.rent_for_2_weeks = req.body.cost;
        el.quantity = req.body.quantity;
        el.description = req.body.description;
      }
      fs.writeFileSync("assets/inventory.json", JSON.stringify(content));
      res.send(new response());
    } else if (actionType === "2") {
      const itemToDelete = content.find(
        (el) =>
          el.show_title === req.body.show_title &&
          el.item === req.body.item_name
      );
      content = content.filter((el) =>
        el.show_title === req.body.show_title && el.item === req.body.item_name
          ? false
          : true
      );
      if (itemToDelete) {
        await deleteInventory(itemToDelete);
      }
      fs.writeFileSync("assets/inventory.json", JSON.stringify(content));
      res.send(new response());
    }
  } catch (error) {
    return res.send(error.message).status(400);
  }
});

async function createNewHCMSInventory({
  show_title,
  item_name,
  description,
  quantity,
  category,
  cost,
}) {
  try {
    let data = JSON.stringify({
      data: {
        "item-name": {
          iv: item_name,
        },
        "item-image": {
          iv: ["6302d479-59a6-41a9-ad47-4f4db7a4d54f"],
        },
        "item-description": {
          iv: description,
        },
        "item-quantity": {
          iv: +quantity,
        },
        "item-cost": {
          iv: +cost,
        },
        availability: {
          iv: true,
        },
      },
      tags: [category, show_title],
      categories: [
        {
          id: "c5369245-a81e-4e90-ab2d-1c7ba0a9ebea",
          name: "Community Arts",
        },
        {
          id: "a9172c2b-7f1a-4bbf-9274-e7d4ea0402c3",
          name: "Theater Rentals",
        },
      ],
      permissionSet: {
        id: "73a1c81f-ee5c-460f-89af-9f95383dc74a",
        name: "HCMS",
      },
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://content.civicplus.com/api/content/ut-sandycity/inventory-item/",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.TOKEN,
      },
      data: data,
    };

    const res = await axios.request(config);
    return res.data.id;
  } catch (error) {
    throw new Error(error);
  }
}

async function updateNewHcmsInventory({
  id,
  show_title,
  item_name,
  description,
  quantity,
  category,
  cost,
}) {
  try {
    let data = JSON.stringify({
      data: {
        "item-name": {
          iv: item_name,
        },
        "item-image": {
          iv: ["6302d479-59a6-41a9-ad47-4f4db7a4d54f"],
        },
        "item-description": {
          iv: description,
        },
        "item-quantity": {
          iv: +quantity,
        },
        "item-cost": {
          iv: +cost,
        },
        availability: {
          iv: true,
        },
      },
      tags: [category, show_title],
      categories: [
        {
          id: "c5369245-a81e-4e90-ab2d-1c7ba0a9ebea",
          name: "Community Arts",
        },
        {
          id: "a9172c2b-7f1a-4bbf-9274-e7d4ea0402c3",
          name: "Theater Rentals",
        },
      ],
      permissionSet: {
        id: "73a1c81f-ee5c-460f-89af-9f95383dc74a",
        name: "HCMS",
      },
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `https://content.civicplus.com/api/content/ut-sandycity/inventory-item/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.TOKEN,
      },
      data: data,
    };

    const res = await axios.request(config);
    return res.data.id;
  } catch (error) {
    console.log(error);
  }
}

async function deleteInventory({ id }) {
  try {
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `https://content.civicplus.com/api/content/ut-sandycity/inventory-item/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.TOKEN,
      },
    };
    const res = await axios.request(config);
  } catch (error) {
    console.log(error);
  }
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
