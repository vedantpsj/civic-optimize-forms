const inventory = require("../assets/inventory.json");

module.exports = function () {
  let titles = inventory.map((el) => el.show_title);
  titles = Array.from(new Set([...titles]));
  return titles.map((title) => ({
    value: title,
    label: title,
  }));
};
