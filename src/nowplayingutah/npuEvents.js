var request = require("request");

/* STYLES OF THE CARD */
let html = `<style media='screen'>.npu-card-list-wrapper {max-width: 1200px;margin: 0 auto;}.npu-card-list-wrapper {width: 100%;text-align: center;}.npu-single-card {width: 350px;}.npu-single-card {display: inline-block;margin: 2px auto;padding: 3px;background-color: #ffffff00;}.npu-event-content-wrapper {width: 300px !important;margin: 0 auto;padding: 5% 0;}.npu-event-image {outline: 3px solid #e4eded;outline-offset: -15px;width: 300px !important;height: 300px !important;object-fit: cover;transition: .30s ease-in-out;}.npu-event-image:hover {outline-offset: -30px;}.npu-event-date {font-size: 14px;text-transform: uppercase;font-family: sans-serif;background-color: black;color: white;padding: 3%;}.npu-event-description {}.npu-event-title {text-transform: uppercase;font-family: sans-serif;font-size: 1.2em !important;line-height: 1.5em;height: 90px;}#npu-ticket-url {padding: 10px 20px;display: block;text-align: center;text-decoration: none;background-color: black;color: white;text-transform: uppercase;font-size: 14px;transition: .30s ease-in-out;}.npu-event-details {height: 150px;font-size: 16px !important;text-align: left;}#npu-ticket-url:hover {background-color: #cfcfcf;color: black;}.cardAccordion {background-color: #e2e1e1;color: #444;cursor: pointer;padding: 18px;width: 100%;border: none;text-align: left;outline: none;font-size: 15px;transition: 0.4s;text-align: center;}.openUp, .cardAccordion:hover {background-color: #ccc;}.cardPanel {padding: 0 18px;height: 0px;background-color: white;overflow: hidden;transition: 0.5s;}</style><div class='npu-card-list-wrapper'>`;

let accordionScript = `<script>console.log('Teakos packaged script works!'); var acc = document.getElementsByClassName('cardAccordion');var i;for (i = 0; i < acc.length; i++) {acc[i].addEventListener('click', function() {this.classList.toggle('openUp');var cardPanel = this.nextElementSibling;if (cardPanel.style.height === '300px') {cardPanel.style.height = '0px';} else {cardPanel.style.height = '300px';}});}</script>`;

/* Grab data from nowplayingutah */
exports.updateNpuEvents = async function (hcmsToken) {
  request(
    {
      method: "GET",
      url: "https://www.nowplayingutah.com/api/v1/syndication/events/?limit=30&output=json&hcmsToken=F5nhq8MoWtt2MXe6GDPAoumYQY0SqQ6vWWDdhAJb_253149",
    },
    function (error, response, body) {
      let json = JSON.parse(body);

      try {
        for (var i = 0; i < json.data.length; i++) {
          // Check if zipcode is Sandy
          if (
            json.data[i].venueZip == "84047" ||
            json.data[i].venueZip == "84070" ||
            json.data[i].venueZip == "84090" ||
            json.data[i].venueZip == "84091" ||
            json.data[i].venueZip == "84092" ||
            json.data[i].venueZip == "84093" ||
            json.data[i].venueZip == "84094"
          ) {
            console.log("Sandy", json.data[i].venueZip);

            let cardHTML = `<!-- START CARD --> <div class='npu-single-card sandy-events'><div class='npu-event-content-wrapper'><a href='${json.data[i].eventTicketUrl}' target='_blank'><img class='npu-event-image' src='${json.data[i].eventImage}' alt='Now Playing Utah Event' ${json.data[i].eventName}></a><div class='npu-event-description'><div class='npu-event-date'>${json.data[i].eventDatesTimes[0].date} | ${json.data[i].eventDatesTimes[0].time}</div><div><h2 class='npu-event-title'>${json.data[i].eventName}</h2><button class='cardAccordion'>EVENT DETAILS</button><div class='cardPanel'><ul class='npu-event-details'><li>Status: ${json.data[i].eventSummary}</li><li>Venue: ${json.data[i].venueName}</li><li><a href='https://maps.google.com/?q=${json.data[i].venueAddress1} ${json.data[i].venueCity}, UT ${json.data[i].venueZip}&t=m' target='_blank'>${json.data[i].venueAddress1} ${json.data[i].venueCity}, UT ${json.data[i].venueZip}</a></li><li>${json.data[i].eventTicketInfo}</li></ul></div><a id='npu-ticket-url' href='${json.data[i].eventTicketUrl}'>Get Tickets</a></div></div></div></div> <!-- END CARD -->`;
            html = html + cardHTML;
          } else {
            console.log("Salt Lake", json.data[i].venueZip);

            let cardHTML = `<!-- START CARD --><div class='npu-single-card all-events'><div class='npu-event-content-wrapper'><a href='${json.data[i].eventTicketUrl}' target='_blank'><img class='npu-event-image' src='${json.data[i].eventImage}' alt='Now Playing Utah Event' ${json.data[i].eventName}></a><div class='npu-event-description'><div class='npu-event-date'>${json.data[i].eventDatesTimes[0].date} | ${json.data[i].eventDatesTimes[0].time}</div><div><h2 class='npu-event-title'>${json.data[i].eventName}</h2><button class='cardAccordion'>EVENT DETAILS</button><div class='cardPanel'><ul class='npu-event-details'><li>Status: ${json.data[i].eventSummary}</li><li>Venue: ${json.data[i].venueName}</li><li><a href='https://maps.google.com/?q=${json.data[i].venueAddress1} ${json.data[i].venueCity}, UT ${json.data[i].venueZip}&t=m' target='_blank'>${json.data[i].venueAddress1} ${json.data[i].venueCity}, UT ${json.data[i].venueZip}</a></li><li>${json.data[i].eventTicketInfo}</li></ul></div><a id='npu-ticket-url' href='${json.data[i].eventTicketUrl}'>Get Tickets</a></div></div></div></div><!-- END CARD -->`;
            html = html + cardHTML;
          }
        }

        console.log("CARDS PREPPED WITH ZIPS ", html);

        html = html + `</div>` + accordionScript;

        console.log("HTML CARD BLOCKS****", html);
        updateHCMS(hcmsToken);
      } catch (error) {
        console.log(error);
      }
    }
  );

  function updateHCMS(hcmsToken) {
    console.log("****************UPDATING HCMS CALLED!!! ");

    const optionsPutHTML = {
      method: "PUT",
      url: "https://content.civicplus.com/api/content/ut-sandycity/html/04f2b6c7-7aad-43d5-aa66-85d50e037499",
      auth: {
        bearer: hcmsToken,
      },
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          "html-title": {
            en: "See Local Events From Now Playing Utah",
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
        return console.log("***********HCMS ERROR!", err);
      }
      console.log(`***********HCMS RESPONSE: ${res.statusCode}`);
      console.log(body);
    });
  }
};
