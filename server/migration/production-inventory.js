const fs = require("fs");
const axios = require("axios");

const data = [];

const assets = data.map((e) => {
  return {
    id: e.id,
    show_title: e.data["show-title"].iv,
    show_cost: e.data["show-cost"].iv,
    description: e.data["show-description"].iv,
    image: e.data["featured-image"].iv[0],
  };
});

async function publishInventory(id) {
  let data = JSON.stringify({
    status: "Published",
  });

  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `https://content.civicplus.com/api/content/ut-sandycity/costume-inventory/${id}/status`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };
  try {
    await axios.request(config);
    console.log("inventory updated for id", id);
  } catch (error) {
    console.log("Failed", id);
  }
}

// (async function () {
//   for (const asset of assets) {
//     await publishInventory(asset.id);
//   }
// })();

// fs.writeFileSync("assets/production.json", JSON.stringify(assets));
