var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const axios = require("axios");
const express = require("express");
const router = express.Router();
const fs = require("fs");

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

router.get("/", async (req, res) => {
  let inventory = JSON.parse(
    fs.readFileSync("./assets/production.json", "utf8")
  );
  return res.send(inventory);
});

router.get("/get-show-titles", async (req, res) => {
  try {
    let inventory = JSON.parse(
      fs.readFileSync("./assets/production.json", "utf8")
    );
    let showTitles = inventory.map((el) => el.show_title);
    showTitles = Array.from(new Set([...showTitles]));
    return res.send(showTitles);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get("/get-details", async (req, res) => {
  try {
    let inventory = JSON.parse(
      fs.readFileSync("./assets/production.json", "utf8")
    );
    const show_title = req.query.show_title;
    const itemInJSon = inventory.find(
      (inventoryItem) => inventoryItem.show_title === show_title
    );
    return res.send(itemInJSon);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.post("/validate", jsonParser, async (req, res) => {
  try {
    let inventory = JSON.parse(
      fs.readFileSync("./assets/production.json", "utf8")
    );
    const actionType = req.body.action_type;
    const show_title = req.body.show_title;

    const itemInJson = inventory.find(
      (inventoryItem) => inventoryItem.show_title === show_title
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
    return res.status(400).send(error.message);
  }
});

router.post("/manage-inventory", jsonParser, async (req, res) => {
  try {
    let inventory = JSON.parse(
      fs.readFileSync("./assets/production.json", "utf8")
    );
    const actionType = req.body.type;
    let content = inventory;
    if (actionType === "0") {
      const id = await createProductionItemOnHcms(req.body);

      const obj = {
        id: id,
        show_title: req.body.show_title,
        show_cost: req.body.cost,
        description: req.body.description,
        image: req.body.image,
      };
      content = [...content, obj];
      fs.writeFileSync("assets/production.json", JSON.stringify(content));
      res.send(new response());
    } else if (actionType === "1") {
      const el = content.find((el) => el.show_title === req.body.show_title);

      await updateProductionItemOnHcms({ ...el, ...req.body });
      if (el) {
        el.show_cost = req.body.cost;
        el.description = req.body.description;
        el.image = req.body.image;
      }
      fs.writeFileSync("assets/production.json", JSON.stringify(content));
      res.send(new response());
    } else if (actionType === "2") {
      const itemToDelete = content.find(
        (el) => el.show_title === req.body.show_title
      );
      content = content.filter((el) =>
        el.show_title === req.body.show_title ? false : true
      );
      if (itemToDelete) {
        await deleteInventory(itemToDelete);
      }
      fs.writeFileSync("assets/production.json", JSON.stringify(content));
      res.send(new response());
    }
  } catch (error) {
    console.log({ ...error });
    return res.status(400).send(error.message);
  }
});

async function createProductionItemOnHcms({
  show_title,
  description,
  cost,
  image,
}) {
  try {
    let tokens = JSON.parse(fs.readFileSync("./assets/tokens.json", "utf8"));
    let data = JSON.stringify({
      data: {
        "show-title": {
          iv: show_title,
        },
        "featured-image": {
          iv: [image],
        },
        "show-description": {
          iv: description,
        },
        "show-cost": {
          iv: cost.toString(),
        },
      },
      permissionSet: {
        id: "73a1c81f-ee5c-460f-89af-9f95383dc74a",
        name: "HCMS",
      },
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://content.civicplus.com/api/content/ut-sandycity/costume-inventory",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokens.hcmsToken,
      },
      data: data,
    };

    const res = await axios.request(config);
    return res.data.id;
  } catch (error) {
    console.log({ ...error });
    throw new Error(error);
  }
}

async function updateProductionItemOnHcms({
  id,
  show_title,
  description,
  cost,
  image,
}) {
  let tokens = JSON.parse(fs.readFileSync("./assets/tokens.json", "utf8"));
  let data = JSON.stringify({
    data: {
      "show-title": {
        iv: show_title,
      },
      "featured-image": {
        iv: [image],
      },
      "show-description": {
        iv: description,
      },
      "show-cost": {
        iv: cost.toString(),
      },
    },
    permissionSet: {
      id: "73a1c81f-ee5c-460f-89af-9f95383dc74a",
      name: "HCMS",
    },
  });

  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `https://content.civicplus.com/api/content/ut-sandycity/costume-inventory/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + tokens.hcmsToken,
    },
    data: data,
  };

  const res = await axios.request(config);
  return res.data.id;
}

async function deleteInventory({ id }) {
  let tokens = JSON.parse(fs.readFileSync("./assets/tokens.json", "utf8"));
  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `https://content.civicplus.com/api/content/ut-sandycity/costume-inventory/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + tokens.hcmsToken,
    },
  };
  return axios.request(config);
}

module.exports = {
  router,
};
