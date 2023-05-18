const { getFile } = require("../../services/utils");

module.exports = async function (req, res) {
  const inventory = await getFile();
  let titles = inventory.map((el) => el.show_title);
  titles = Array.from(new Set([...titles]));
  return titles.map((title) => ({
    value: title,
    label: title,
  }));
};
