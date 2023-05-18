"use strict";

const { getFile } = require("../../services/utils");
module.exports.post = async function (req, res) {
  if (
    !req.body ||
    !req.body.submission ||
    !req.body.submission.action_type ||
    !req.body.submission.show_title_edit ||
    !req.body.submission.item_edit
  ) {
    return res.setStatusCode(200).setPayload({});
  }

  const show_title = req.body.submission.show_title_edit;
  const item = req.body.submission.item_edit;

  const inventory = await getFile();
  const itemFromJson = inventory.find(
    (inventoryItem) =>
      inventoryItem.show_title === show_title && inventoryItem.item === item
  );

  // If the request does not contain a valid warehouse number,
  // finish early with a custom error message for the user to see.
  if (!itemFromJson) {
    return res.setStatusCode(200).setPayload({});
  }

  return res.setStatusCode(200).setPayload({
    cost_edit: itemFromJson.rent_for_2_weeks,
    quantity_edit: itemFromJson.quantity,
  });
};
