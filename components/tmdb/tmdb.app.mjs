import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "the_movie_database",
  propDefinitions: {
    language: {
      type: "string",
      description: "Specify a language to query translatable fields with.",
      label: "Language",
    },
    movie_genres: {
      type: "string[]",
      label: "Genres",
      description: "Include movies with the following genres",
      async options() {
        const res = await this.getMovieGenres();
        console.log(res);
        return res.data.genres.map((genre) => ({
          value: genre.id,
          label: genre.name,
        }));
      },
    },
  },
  methods: {
    async _request(opts) {
      opts.url = `https://https://api.themoviedb.org/3${opts.path}`;
      opts.headers = {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
      console.log(this.$auth, opts.url);
      return axios(opts.$ ?? this, opts);
    },
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    async getMovieGenres() {
      return this._request({ path: "/genre/movie/list" });
    },
  },
};
