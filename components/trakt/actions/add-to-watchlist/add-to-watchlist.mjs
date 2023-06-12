import trakt from "../../trakt.app.mjs";

export default {
  name: "Add To Watchlist",
  version: "0.0.1",
  key: "trakt-add-to-watchlist",
  description: "Add one of more items to watchlist. [See documentation here](https://trakt.docs.apiary.io/#reference/sync/add-to-watchlist/get-watchlist)",
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
    const movies = typeof this.movies === "string"
      ? JSON.stringify(this.movies)
      : this.movies;

    const shows = typeof this.shows === "string"
      ? JSON.stringify(this.shows)
      : this.shows;

    const response = await this.trakt.addToWatchlist({
      $,
      data: {
        movies,
        shows,
      },
    });

    if (response) {
      $.export("$summary", "Successfully added movies and shows to watchlist");
    }

    return response;
  },
};
