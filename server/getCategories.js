var axios = require("axios");

async function getCategories(token, category, show_title) {
  let categories = [];
  try {
    const allCategories = await getHCMSCategories(token);
    categories = getCategoryFromName(category, show_title, allCategories);
  } catch (error) {
    console.log({ ...error });
    categories = getCategoryFromName("", "", category);
  }

  return categories;
}

function getCategoryFromName(category, show_title, allCategories) {
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
  const names = [category, show_title];

  switch (show_title) {
    case "Beauty and the Beast Jr": {
      names.push("Beauty and the Beast");
      names.push("Junior Show");
      break;
    }
    case "The Little Mermaid, Jr.": {
      names.push("The Little Mermaid");
      names.push("Junior Show");
      break;
    }
    case "Beauty and the Beast, Jr. (2014)": {
      names.push("Beauty and the Beast");
      names.push("Junior Show");
      break;
    }
    case "High School Musical, Jr.": {
      names.push("High School Musical");
      names.push("Junior Show");
      break;
    }
    case "Into the Woods (2023)":
    case "Into the Woods (2015)": {
      names.push("Into the Woods");
      break;
    }
    case "Seussical the Musical": {
      names.push("Seussical");

      break;
    }
    case "Seussical the Musical, Jr.": {
      names.push("Seussical");
      names.push("Junior Show");
      break;
    }
    case "The Lion King, Jr.": {
      names.push("The Lion King");
      names.push("Junior Show");
      break;
    }
    case "James and the Giant Peach, Jr.": {
      names.push("James and the Giant Peach");
      names.push("Junior Show");
      break;
    }

    case "Beauty and the Beast (2008)": {
      names.push("Beauty and the Beast");
      break;
    }
  }

  names.forEach((name) => {
    const cat = allCategories.items.find(
      (e) => e.name.toLowerCase() === name.toLowerCase()
    );
    if (cat) {
      categories.push({
        id: cat.id,
        name: cat.name,
      });
    }
  });

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
