const inventory = require("../assets/inventory.json");

module.exports = function (req, res) {
  if (!req.body || !req.body.submission || !req.body.submission.show_title) {
    return res.setStatusCode(400).setPayload({
      message: "No inventory present",
    });
  }

  const show_title = req.body.submission.show_title;

  const items = inventory.filter(
    (inventoryItem) => inventoryItem.show_title === show_title
  );

  let totalCost = 0;
  items.forEach((item) => {
    totalCost += +item.quantity * +item.rent_for_2_weeks;
  });

  return res.setStatusCode(200).setPayload({
    totalCost: totalCost,
  });
};
