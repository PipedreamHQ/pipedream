const axios = require("axios");

module.exports = {
  type: "app",
  app: "swapi",
  propDefinitions: {
    film: {
      type: "string",
      async options() {
        return (await axios({
          url: "https://swapi.dev/api/films",
        })).data.results.map(function(film, index) {
          return {
            label: film.title,
            value: index + 1,
          };
        });
      },
    },
  },
};
