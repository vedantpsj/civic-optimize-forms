var request = require("request");

/* STYLES OF THE CARD */
let html = `<style media="screen">.yelp-card-list-wrapper {max-width: 1200px;margin: 0 auto;}.yelp-card-list-wrapper {width: 100%;text-align: center;}/* end style */.yelp-single-card {width: 350px;/*height: 700px;*/}/* end style */.yelp-single-card {display: inline-block;margin: 2px auto;padding: 3px;background-color: #ffffff00;}/* end style */.yelp-event-content-wrapper {width: 300px !important;margin: 0 auto;padding: 5% 0;}/* end style */.yelp-event-image {outline: 3px solid #e4eded;outline-offset: -15px;width: 300px !important;height: 300px !important;object-fit: cover;/* object-position: right; */transition: .30s ease-in-out;}/* end style */.yelp-event-image:hover {outline-offset: -30px;}/* end style */.yelp-business-type {font-size: 14px;text-transform: uppercase;font-family: sans-serif;background-color: black;color: white;padding: 3%;}/* end style */.yelp-business-description {}/* end style */.yelp-title { height:60px; text-transform: uppercase;font-family: sans-serif;font-size: 1.2em !important;line-height: 1.5em;}/* end style */#yelp-business-url {padding: 10px 20px;display: block;text-align: center;text-decoration: none;background-color: black;color: white;text-transform: uppercase;font-size: 14px;transition: .30s ease-in-out;}/* end style */.yelp-business-details {height: 150px;font-size: 16px !important;text-align: left;}/* end style */#yelp-business-url:hover {background-color: #cfcfcf;color: black;}/* end style */.cardAccordion {background-color: #e2e1e1;color: #444;cursor: pointer;padding: 18px;width: 100%;border: none;text-align: left;outline: none;font-size: 15px;transition: 0.4s;text-align: center;}/* end style */.openUp, .cardAccordion:hover {background-color: #ccc;}/* end style */.cardPanel {padding: 0 18px;/* display: none; */height: 0px;background-color: white;overflow: hidden;transition: 0.5s;}</style><div class="yelp-card-list-wrapper">`;

let accordionScript = `<script>console.log("Teako's packaged script works!"); var acc = document.getElementsByClassName("cardAccordion");var i;for (i = 0; i < acc.length; i++) {acc[i].addEventListener("click", function() {this.classList.toggle("openUp");var cardPanel = this.nextElementSibling;if (cardPanel.style.height === "300px") {cardPanel.style.height = "0px";} else {cardPanel.style.height = "300px";}});}</script>`;

/* Grab data from nowplayingutah */

exports.updateHotels = async function (hcmsToken, yelpToken) {
  request(
    {
      method: "GET",
      url: "https://api.yelp.com/v3/businesses/search?term=hotels&location=sandy city utah&limit=50",
      auth: {
        bearer: yelpToken,
      },
    },
    function (error, response, body) {
      let json = JSON.parse(body);

      for (var i = 0; i < json.businesses.length; i++) {
        let cardHTML = `<!-- START CARD -->
          <div class="yelp-single-card"><div class="yelp-event-content-wrapper"><a href="${
            json.businesses[i].url
          }" target="_blank"><img class="yelp-event-image" src="${
          json.businesses[i].image_url
        }" alt="${
          json.businesses[i].name
        }"></a><div class="yelp-business-description"><div><h2 class="yelp-title">${
          json.businesses[i].name
        }</h2><button class="cardAccordion">BUSINESS INFO</button><div class="cardPanel"><ul class="yelp-business-details"><li>Price: ${
          json.businesses[i].price
        }</li><li>Address & Map: <a href="https://maps.google.com/?q=${
          json.businesses[i].location.display_address[0] +
          " " +
          json.businesses[i].location.display_address[1]
        }&t=m" target="_blank">${
          json.businesses[i].location.display_address[0] +
          " " +
          json.businesses[i].location.display_address[1]
        }</a></li><li>Contact: ${
          json.businesses[i].display_phone
        }</li><li>Yelp Rating: ${
          json.businesses[i].rating
        }</li></ul></div><a id="yelp-business-url" href="${
          json.businesses[i].url
        }" target="_blank">See More</a></div></div></div></div>
          <!-- END CARD -->`;

        html = html + cardHTML;
      }

      html = html + `</div>` + accordionScript;

      console.log("HTML CARD BLOCKS****", html);
      updateHCMS(hcmsToken);
    }
  );
};

function updateHCMS(hcmsToken) {
  console.log("****************UPDATING HCMS CALLED!!! ");

  const optionsPutHTML = {
    method: "PUT",
    url: "https://content.civicplus.com/api/content/ut-sandycity/html/f03cd4b7-f35a-43c5-89e6-c4313c30c98a",
    auth: {
      bearer: hcmsToken,
    },
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        "html-title": {
          en: "Hotels In Sandy Powered By Yelp",
        },
        html: {
          en: html,
        },
      },
      categories: [],
      tags: ["teako", "Postman-Test"],
      permissionSet: {
        id: "898af621-7b19-41b9-a7fb-e35e0fe222e2",
      },
    }),
  };

  request.put(optionsPutHTML, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    console.log(`Status: ${res.statusCode}`);
    console.log(body);
  });
}
