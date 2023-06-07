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
      label: "Movies",
      description: "The movies name to be added to watchlist. E.g `John Wick: Chapter 4`",
      type: "string[]",
      optional: true,
    },
    shows: {
      label: "TV Shows",
      description: "The TV show names to be added to watchlist. E.g `Breaking Bad`",
      type: "string[]",
      optional: true,
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
