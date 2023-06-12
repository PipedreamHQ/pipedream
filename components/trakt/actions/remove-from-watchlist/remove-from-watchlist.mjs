import trakt from "../../trakt.app.mjs";

export default {
  name: "Remove From Watchlist",
  version: "0.0.1",
  key: "trakt-remove-from-watchlist",
  description: "Remove one of more items from watchlist. [See documentation here](https://trakt.docs.apiary.io/#reference/sync/remove-from-watchlist/remove-items-from-watchlist)",
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
    const movies = typeof this.movies === "string"
      ? JSON.stringify(this.movies)
      : this.movies;

    const shows = typeof this.shows === "string"
      ? JSON.stringify(this.shows)
      : this.shows;

    const response = await this.trakt.removeFromWatchlist({
      $,
      data: {
        movies,
        shows,
      },
    });

    if (response) {
      $.export("$summary", "Successfully removed movies and shows from watchlist");
    }

    return response;
  },
};
