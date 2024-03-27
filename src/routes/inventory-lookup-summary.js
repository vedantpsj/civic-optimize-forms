"use strict";

// require the OneBlink SDK
/* eslint-disable */
const OneBlink = require("@oneblink/sdk");
const CivicPlus = require("@oneblink/sdk/tenants/civicplus");
const { getFile } = require("../services/utils");

module.exports.post = async function (req, res) {
  // If the request does not contain the essential data to process,
  // finish early with a custom error message for the user to see.
  if (!req.body || !req.body.submission || !req.body.submission.show_title) {
    // A user friendly error message can be shown to the user in One Blink Forms
    // by returning a 400 Status code and a JSON payload with a `message` property.
    // There is no character limit, however it is suggested to keep the message
    // short and clear.
    return res.setStatusCode(400).setPayload({
      message: "No inventory present",
    });
  }

  // Access the submission data from the request body.
  const show_title = req.body.submission.show_title;
  const inventory = await getFile();

  const items = inventory.filter(
    (inventoryItem) => inventoryItem.show_title === show_title
  );

  // If the request does not contain a valid warehouse number,
  // finish early with a custom error message for the user to see.
  if (!items.length) {
    return res.setStatusCode(400).setPayload({
      message: "Could not find the inventory you were looking for.",
    });
  }

  let htmlString = "";
  let cost = 0;
  items.forEach((item) => {
    htmlString += `<div>${item.item} | ${item.category} Piece | Qty ${item.quantity}</div>`;
    cost += +item.quantity * +item.rent_for_2_weeks;
  });

  htmlString += `<div>Total cost: $${cost}</div>`;

  const calculation = CivicPlus.Forms.generateFormElement({
    conditionallyShow: false,
    defaultValue: htmlString,
    label: "Summary",
    name: "Summary",
    type: "html",
  });

  return res.setStatusCode(200).setPayload([calculation]);
};
