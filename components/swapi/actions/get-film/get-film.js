const swapi = require("../../swapi.app.js");
const axios = require("axios");

module.exports = {
  key: "swapi-get-film",
  name: "Get Film",
  version: "0.0.13",
  description: "Get a film",
  type: "action",
  props: {
    swapi,
    film: {
      propDefinition: [
        swapi,
        "film",
      ],
    },
  },
  async run() {
    return (await axios({
      url: `https://swapi.dev/api/films/${this.film}`,
    })).data;
  },
};
