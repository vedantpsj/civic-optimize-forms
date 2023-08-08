var axios = require("axios");
const qs = require("qs");

exports.updateHcmsToken = async function (form) {
  return new Promise(async (resolve, reject) => {
    let data = qs.stringify(form);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://content.civicplus.com/identity-server/connect/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      resolve(response.data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
