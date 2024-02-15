import mobygames from "../../mobygames.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "mobygames-list-genres",
  name: "List Genres",
  description: "Provides a list of genres which may be used for filtering games via the MobyGames API. [See the documentation](https://www.mobygames.com/info/api/#genres)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    mobygames,
  },
  async run({ $ }) {
    const genres = await this.mobygames.getGenres();
    $.export("$summary", "Successfully retrieved genres");
    return genres.map((genre) => ({
      genre_category: genre.genre_category,
      genre_category_id: genre.genre_category_id,
      genre_description: genre.genre_description,
      genre_id: genre.genre_id,
      genre_name: genre.genre_name,
    }));
  },
};
