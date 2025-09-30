import trakt from "../../trakt.app.mjs";
import utils from "../common/utils.mjs";

export default {
  name: "Add To Watchlist",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "trakt-add-to-watchlist",
  description: "Add one of more items to watchlist. [See the documentation](https://trakt.docs.apiary.io/#reference/sync/add-to-watchlist/get-watchlist)",
  type: "action",
  props: {
    trakt,
    movies: {
      description: "The movies name to be added to watchlist. E.g `John Wick: Chapter 4`",
      optional: true,
      propDefinition: [
        trakt,
        "movies",
      ],
    },
    shows: {
      description: "The TV show names to be added to watchlist. E.g `Breaking Bad`",
      optional: true,
      propDefinition: [
        trakt,
        "shows",
      ],
    },
  },
  async run({ $ }) {
    const movies = utils.parseStringToJson(this.movies, []);
    const shows = utils.parseStringToJson(this.shows, []);

    const response = await this.trakt.addToWatchlist({
      $,
      data: {
        movies: movies.map((movie) => ({
          title: movie,
        })),
        shows: shows.map((show) => ({
          title: show,
        })),
      },
    });

    if (response) {
      $.export("$summary", `Successfully added ${response.added.movies} movies and ${response.added.shows} shows to watchlist`);
    }

    return response;
  },
};
