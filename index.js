const schedule = require("node-schedule");
const fs = require("fs");

const { updateHcmsToken } = require("./src/hcms/update-hcms-token");
const { updateHotels } = require("./src/yelp/hotel");
const { updateRestaurants } = require("./src/yelp/restaurants");
const { updateNpuEvents } = require("./src/nowplayingutah/npuEvents");

// update hotels at UTC : 00:00:00 - every day
const job1 = schedule.scheduleJob("0 0 * * *", async function () {
  try {
    let tokens = JSON.parse(fs.readFileSync("./tokens.json", "utf8"));
    await updateHotels(tokens.hcmsToken, tokens.yelpToken);
  } catch (error) {
    console.log(error);
  }
});

// update restaurants at UTC : 00:05:00 - every day
const job2 = schedule.scheduleJob("5 0 * * *", async function () {
  try {
    let tokens = JSON.parse(fs.readFileSync("./tokens.json", "utf8"));
    await updateRestaurants(tokens.hcmsToken, tokens.yelpToken);
  } catch (error) {
    console.log(error);
  }
});

// update restaurants at UTC : 00:10:00 - every day
const job3 = schedule.scheduleJob("10 0 * * *", async function () {
  try {
    let tokens = JSON.parse(fs.readFileSync("./tokens.json", "utf8"));
    await updateNpuEvents(tokens.hcmsToken);
  } catch (error) {
    console.log(error);
  }
});

// update tokens every 10 days// 0 0 0 1,10 ? *
const job4 = schedule.scheduleJob("15 0 * * 0", async function () {
  let tokens = JSON.parse(fs.readFileSync("./tokens.json", "utf8"));
  try {
    let body = await updateHcmsToken(tokens.form);
    body = JSON.parse(body);
    tokens.hcmsToken = body.access_token;
    fs.writeFileSync("tokens.json", JSON.stringify(tokens));
  } catch (error) {
    console.log(error);
  }
});
