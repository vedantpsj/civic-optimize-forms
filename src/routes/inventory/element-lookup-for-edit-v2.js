"use strict";
const CivicPlus = require("@oneblink/sdk/tenants/civicplus");
const { getFile } = require("../../services/utils");

module.exports.post = async function (req, res) {
  if (
    !req.body ||
    !req.body.submission ||
    !req.body.submission.action_type ||
    !req.body.submission.show_title_edit
  ) {
    return res.setStatusCode(200).setPayload([]);
  }

  if (req.body.submission.action_type !== "1") {
    return res.setStatusCode(200).setPayload([]);
  }
  const inventory = await getFile();
  const show_title = req.body.submission.show_title_edit;
  const items = inventory.filter(
    (inventoryItem) => inventoryItem.show_title === show_title
  );

  const element = req.body.definition.elements.find(
    (el) => el.name === "action_type"
  );
  const elementId = element.id;
  const option = element?.options.find((el) => el.value === "1");
  const optionId = option?.id;

  const conditionallyShowPredicates = [
    {
      elementId: elementId,
      optionIds: [optionId],
      type: "OPTIONS",
    },
  ];
  // If the request does not contain a valid warehouse number,
  // finish early with a custom error message for the user to see.
  if (!items.length) {
    return res.setStatusCode(200).setPayload([]);
  }

  const selectItemNameElement = CivicPlus.Forms.generateFormElement({
    name: "item_edit",
    label: `Select Item to Edit`,
    type: "select",
    buttons: false,
    required: true,
    readOnly: false,
    dataLookupId: 274,
    isDataLookup: true,
    conditionallyShow: true,
    conditionallyShowPredicates: conditionallyShowPredicates,
    options: items.map((el) => {
      return {
        value: el.item,
        label: el.item,
      };
    }),
  });

  const costElement = CivicPlus.Forms.generateFormElement({
    name: "cost_edit",
    label: `Cost of item`,
    type: "number",
    defaultValue: 0,
    conditionallyShow: true,
    conditionallyShowPredicates: conditionallyShowPredicates,
  });

  const quantity = CivicPlus.Forms.generateFormElement({
    name: "quantity_edit",
    label: `Quantity`,
    type: "number",
    defaultValue: 0,
    conditionallyShow: true,
    conditionallyShowPredicates: conditionallyShowPredicates,
  });

  return res
    .setStatusCode(200)
    .setPayload([selectItemNameElement, costElement, quantity]);
};
