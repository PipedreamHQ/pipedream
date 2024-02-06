import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Show Or Movie Rated",
  version: "0.0.2",
  key: "trakt-new-show-or-movie-rated",
  description: "Emit new event on each new rated show or movie.",
  type: "source",
  dedupe: "unique",
  methods: {
    emitEvent(data) {
      const id = data?.show?.ids?.trakt ?? data?.movie?.ids?.trakt;

      this.$emit(data, {
        id: `${id} - ${data.rated_at}`,
        summary: `New ${this.type.slice(0, -1)} watched with ID ${id}`,
        ts: Date.parse(data.rated_at),
      });
    },
  },
  async run() {
    const resources = await this.trakt.getUserRating({
      type: this.type,
    });

    resources.reverse().forEach(this.emitEvent);
  },
};
