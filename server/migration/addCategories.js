const fs = require("fs");
const axios = require("axios");
const { getCategories } = require("./getCategories");

const dotenv = require("dotenv");
dotenv.config();

async function updateCategories() {
  let inventory = JSON.parse(
    fs.readFileSync("./assets/inventory.json", "utf8")
  );

  let i = 0;
  for (const item of inventory) {
    await updateNewHcmsInventory({
      id: item.id,
      show_title: item.show_title,
      item_name: item.item,
      description: item.description,
      category: item.category,
      cost: item.rent_for_2_weeks,
      image: item.image,
      quantity: item.quantity,
    });
    console.log(i, "updated ------------");
    i++;
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
  image,
}) {
  let tokens = JSON.parse(fs.readFileSync("./assets/tokens.json", "utf8"));
  const categories = await getCategories(
    tokens.hcmsToken,
    category,
    show_title
  );

  let data = JSON.stringify({
    data: {
      "item-name": {
        iv: item_name,
      },
      "item-image": {
        iv: [image],
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
    categories: categories,
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
      Authorization: "Bearer " + tokens.hcmsToken,
    },
    data: data,
  };

  const res = await axios.request(config);
  return res.data.id;
}

updateCategories();
