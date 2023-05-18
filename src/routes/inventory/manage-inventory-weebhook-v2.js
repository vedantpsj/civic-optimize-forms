const CivicPlus = require("@oneblink/sdk/tenants/civicplus");
const { saveFile, getFile } = require("../../services/utils");

module.exports = async function (request) {
  const submissionId = request.body.submissionId;
  const formId = request.body.formId;
  const isDraft = request.body.isDraft;

  const options = {
    accessKey: process.env.accessKey,
    secretKey: process.env.secretKey,
  };

  const forms = new CivicPlus.Forms(options);

  let count = 0;
  let result = undefined;
  while (!result && count < 5) {
    try {
      result = await forms.getSubmissionData(formId, submissionId, isDraft);
    } catch (error) {
      console.log("Error while initializing form", error);
      count = count + 1;
    }
  }
  if (!result) {
    console.log("Webhook failed to update the event!");
    return;
  }
  const actionType = result.submission.action_type;

  if (actionType === "0") {
    let content = await getFile();
    const obj = {
      show_title: result?.submission?.show_title_add,
      item: result?.submission?.item_add,
      category: result?.submission?.category_add,
      rent_for_2_weeks: result?.submission?.cost_add,
      quantity: result?.submission?.quantity_add,
    };
    content = [...content, obj];
    await saveFile(JSON.stringify(content));
    console.log("object added successfully!");
  } else if (actionType === "1") {
    let content = await getFile();
    const el = content.find(
      (el) =>
        el.show_title === result.submission.show_title_edit &&
        el.item === result.submission.item_edit
    );
    if (el) {
      el.rent_for_2_weeks = result.submission.cost_edit;
      el.quantity = result.submission.quantity_edit;
      await saveFile(JSON.stringify(content));
    }
    console.log("object edited successfully!");
  } else if (actionType === "2") {
    let content = await getFile();
    content = content.filter((el) =>
      el.show_title === result.submission.show_title_delete &&
      el.item === result.submission.item_delete
        ? false
        : true
    );
    await saveFile(JSON.stringify(content));
    console.log("object deleted successfully!");
  }
};
