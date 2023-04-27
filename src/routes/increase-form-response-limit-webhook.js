const CivicPlus = require("@oneblink/sdk/tenants/civicplus");

module.exports = async function (request) {
  // Validate WEBHOOK SECRET with submission event
  if (process.env.WEBHOOK_SECRET !== request.body.secret) {
    throw new Error("Forbidden");
  }

  const options = {
    accessKey: process.env.FORMS_KEY,
    secretKey: process.env.FORMS_SECRET,
  };

  const forms = new CivicPlus.Forms(options);

  const formId = request.body.formId;
  const submissionId = request.body.submissionId;
  const isDraft = request.body.isDraft;

  // Get Current form
  const currentForm = await forms.getForm(formId, false);

  let element = undefined;
  function findElementWithName(form) {
    form.elements.forEach((el) => {
      if (el.type === "page") {
        findElementWithName(el);
      } else {
        const ele = form.elements.find((el) => {
          return el.name === "form_response_limit";
        });
        if (ele) {
          element = ele;
        }
      }
    });
  }

  findElementWithName(currentForm);
  if (element) {
    // Update Secret to be same as webhook secret
    currentForm.submissionEvents[0].configuration.secret =
      process.env.WEBHOOK_SECRET;

    // Update defaultValue of the form
    element.defaultValue = element.defaultValue - 1;

    // Mark form as ended if defaultValue reaches 0
    if (element.defaultValue == 0) {
      currentForm.publishEndDate = new Date().toISOString();
    }

    // Update form
    await forms.updateForm(currentForm);
  }
};
