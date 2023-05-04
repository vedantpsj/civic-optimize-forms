"use strict";

// require the OneBlink SDK
/* eslint-disable */
const OneBlink = require("@oneblink/sdk");
const CivicPlus = require("@oneblink/sdk/tenants/civicplus");
const inventory = require("../assets/inventory.json");

module.exports.post = function (req, res) {
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
  const elements = [];
  let calc = "";
  items.forEach((item) => {
    const checkBoxElement = CivicPlus.Forms.generateFormElement({
      name:
        (show_title + item.item)
          .replace(/ /g, "")
          .replace(/,/g, "")
          .replace(/'/g, "") + "__package",
      label: `${item.item} | ${item.category} Piece | Qty ${item.quantity}`,
      type: "checkboxes",
      defaultValue: [],
      buttons: false,
      required: false,
      readOnly: true,
      options: [
        {
          value: item.rent_for_2_weeks,
          label: `Included $${item.rent_for_2_weeks}`,
        },
      ],
    });

    checkBoxElement.defaultValue = [checkBoxElement.options[0].id];

    elements.push(checkBoxElement);
    const inputElement = CivicPlus.Forms.generateFormElement({
      name:
        (show_title + item.item)
          .replace(/ /g, "")
          .replace(/,/g, "")
          .replace(/'/g, "") +
        "__input" +
        "__package",
      label: `Select quantity`,
      type: "number",
      defaultValue: item.quantity,
      minNumber: 1,
      maxNumber: item.quantity,
      readOnly: true,
      conditionallyShow: true,
      conditionallyShowPredicates: [
        {
          elementId: checkBoxElement.id,
          type: "OPTIONS",
          optionIds: [checkBoxElement.options[0].id],
        },
      ],
    });
    elements.push(inputElement);
    calc += `( ISNULL({ELEMENT:${checkBoxElement.name}}, 0) * ISNULL({ELEMENT:${inputElement.name}}, 0) ) +`;
  });

  calc = calc.slice(0, -1);

  console.log(calc);
  const calculation = CivicPlus.Forms.generateFormElement({
    name: "calculation__package",
    label: `Calculation`,
    type: "calculation",
    required: true,
    calculation: calc,
    preCalculationDisplay: "<div>No Result!</div>",
    defaultValue: "<div>Total cost ${RESULT}</div>",
  });

  return res.setStatusCode(200).setPayload([...elements, calculation]);
};
