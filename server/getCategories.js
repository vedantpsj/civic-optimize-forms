var axios = require("axios");

async function getCategories(token, category, show_title) {
  const categories = [
    {
      id: "c5369245-a81e-4e90-ab2d-1c7ba0a9ebea",
      name: "Community Arts",
    },
    {
      id: "a9172c2b-7f1a-4bbf-9274-e7d4ea0402c3",
      name: "Theater Rentals",
    },
  ];
  try {
    const allCategories = await getHCMSCategories(token);
    const category1 = allCategories.items.find(
      (e) => e.name.toLowerCase() === category.toLowerCase()
    );
    if (category1) {
      categories.push({
        id: category1.id,
        name: category1.name,
      });
    }
    const category2 = allCategories.items.find(
      (e) => e.name.toLowerCase() === show_title.toLowerCase()
    );
    if (category2) {
      categories.push({
        id: category2.id,
        name: category2.name,
      });
    }
  } catch (error) {
    console.log(error);
  }
  return categories;
}

async function getHCMSCategories(token) {
  return new Promise(async (resolve, reject) => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://content.civicplus.com/api/apps/ut-sandycity/categories",
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    try {
      const response = await axios.request(config);
      resolve(response.data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

module.exports = {
  getCategories,
};
