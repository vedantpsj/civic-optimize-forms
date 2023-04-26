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

  // get index of element with name form_response_limit
  const index = currentForm.elements.findIndex((el) => {
    return el.name === "form_response_limit";
  });

  if (index != -1) {
    // Result of submission
    const result = await forms.getSubmissionData(formId, submissionId, isDraft);

    // Update Secret to be same as webhook secret
    currentForm.submissionEvents[0].configuration.secret =
      process.env.WEBHOOK_SECRET;

    // Update defaultValue of the form
    currentForm.elements[index].defaultValue =
      result.submission.form_response_limit - 1;

    // Mark form as ended if defaultValue reaches 0
    if (currentForm.elements[index].defaultValue == 0) {
      currentForm.publishEndDate = new Date().toISOString();
    }

    // Update form
    await forms.updateForm(currentForm);
  }
};
