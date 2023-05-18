const axios = require("axios");

const saveFile = (body) => {
  return axios.put(process.env.fileUrl, body);
};

const getFile = async () => {
  try {
    const res = await axios.get(process.env.fileUrl);
    return res.data;
  } catch (error) {
    return [];
  }
};

module.exports = {
  saveFile,
  getFile,
};
