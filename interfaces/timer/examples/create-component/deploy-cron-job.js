const axios = require("axios");
require("dotenv").config();
const data = require("./api-payload.json");

axios({
  method: "POST",
  url: "https://api.pipedream.com/v1/sources",
  headers: {
    Authorization: `Bearer ${process.env.PIPEDREAM_API_KEY}`,
  },
  data,
})
  .then((res) => console.log(res))
  .catch((err) => console.log(`Error: ${err}`));
