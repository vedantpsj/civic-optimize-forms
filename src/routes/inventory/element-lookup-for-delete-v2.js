"use strict";
const CivicPlus = require("@oneblink/sdk/tenants/civicplus");
const { getFile } = require("../../services/utils");

module.exports.post = async function (req, res) {
  if (
    !req.body ||
    !req.body.submission ||
    !req.body.submission.action_type ||
    !req.body.submission.show_title_delete
  ) {
    return res.setStatusCode(200).setPayload([]);
  }

  if (req.body.submission.action_type !== "2") {
    return res.setStatusCode(200).setPayload([]);
  }

  const inventory = await getFile();
  const show_title = req.body.submission.show_title_delete;
  const items = inventory.filter(
    (inventoryItem) => inventoryItem.show_title === show_title
  );
  if (!items.length) {
    return res.setStatusCode(200).setPayload([]);
  }

  const element = req.body.definition.elements.find(
    (el) => el.name === "action_type"
  );
  const elementId = element.id;
  const option = element?.options.find((el) => el.value === "2");
  const optionId = option?.id;

  const conditionallyShowPredicates = [
    {
      elementId: elementId,
      optionIds: [optionId],
      type: "OPTIONS",
    },
  ];

  const selectItemNameElement = CivicPlus.Forms.generateFormElement({
    name: "item_delete",
    label: `Select Item to delete`,
    type: "select",
    buttons: false,
    required: true,
    readOnly: false,
    options: items.map((el) => {
      return {
        value: el.item,
        label: el.item,
      };
    }),
    conditionallyShow: true,
    conditionallyShowPredicates: conditionallyShowPredicates,
  });

  return res.setStatusCode(200).setPayload([selectItemNameElement]);
};
