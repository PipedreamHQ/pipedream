import trakt from "../../trakt.app.mjs";
import utils from "../common/utils.mjs";

export default {
  name: "Remove From Watchlist",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "trakt-remove-from-watchlist",
  description: "Remove one of more items from watchlist. [See the documentation](https://trakt.docs.apiary.io/#reference/sync/remove-from-watchlist/remove-items-from-watchlist)",
  type: "action",
  props: {
    trakt,
    movies: {
      description: "The movies name to be removed from watchlist. E.g `John Wick: Chapter 4`",
      optional: true,
      propDefinition: [
        trakt,
        "movies",
      ],
    },
    shows: {
      description: "The TV show names to be removed from watchlist. E.g `Breaking Bad`",
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

    const response = await this.trakt.removeFromWatchlist({
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
      $.export("$summary", `Successfully removed ${response.deleted.movies} movies and ${response.deleted.shows} shows to watchlist`);
    }

    return response;
  },
};
