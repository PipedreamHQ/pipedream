import mobygames from "../../mobygames.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "mobygames-list-games",
  name: "List Games",
  description: "Provides a list of games matching the filters given in the query parameters, ordered by id. [See the documentation](https://www.mobygames.com/info/api/#games)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    mobygames,
    genreId: {
      propDefinition: [
        mobygames,
        "genreId",
      ],
    },
    platformId: {
      propDefinition: [
        mobygames,
        "platformId",
      ],
    },
    queryParams: {
      propDefinition: [
        mobygames,
        "queryParams",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mobygames.getGames({
      genreId: this.genreId,
      platformId: this.platformId,
      queryParams: this.queryParams,
    });

    $.export("$summary", "Successfully retrieved the list of games");
    return response;
  },
};
