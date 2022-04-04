import tmdb from "../../tmdb.app.mjs";

export default {
  name: "New Discovered Movies",
  key: "tmdb-discover-new-movies",
  version: "0.0.1",
  description:
    "Emit new movies by different types of data like average rating, number of votes, genres and certifications.",
  type: "source",
  dedupe: "unique",
  props: {
    tmdb,
    genres: { propDefinition: [tmdb, "movie_genres"] },
  },
  async run() {
    const movies = await this.getDiscoverMovies();
    movies.forEach((movie) => {
      this.$emit({
        id: movie.id,
        summary: `Discovered new movie ${movie.name}`,
      });
    });
  },
};
