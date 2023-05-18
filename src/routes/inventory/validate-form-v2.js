const { getFile } = require("../../services/utils");

async function post(req, res) {
  try {
    const show_title = req?.body?.submission?.show_title_add;
    const item = req?.body?.submission?.item_add;
    const inventory = await getFile();
    const itemInJson = inventory.find(
      (inventoryItem) =>
        inventoryItem.show_title === show_title && inventoryItem.item === item
    );
    if (itemInJson) {
      return res.setStatusCode(400).setPayload({
        message: "Show Title and item name can not be same to already existing title and item name",
      });
    }
    return res.setStatusCode(200);
  } catch (error) {
    return res.setStatusCode(400).setPayload({
      message: "Some error occurred please try again later",
    });
  }
}

module.exports = { post };
