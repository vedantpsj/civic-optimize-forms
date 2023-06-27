var request = require("request");
const fs = require("fs");

exports.updateHcmsToken = async function (form) {
  return new Promise((resolve, reject) => {
    const options = {
      method: "POST",
      url: "https://content.civicplus.com/identity-server/connect/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      form: form,
    };

    request(options, function (error, response) {
      if (error) {
        reject(error);
      }
      resolve(response.body);
    });
  });
};
