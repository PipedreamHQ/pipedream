import trakt from "../../trakt.app.mjs";
import constants from "../common/constants.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Show Or Movie Rated",
  version: "0.0.1",
  key: "trakt-new-show-or-movie-rated",
  description: "Emit new event on each new rated show or movie.",
  type: "source",
  dedupe: "unique",
  props: {
    trakt,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    type: {
      label: "Type",
      description: "The content type. E.g. `movies`",
      type: "string",
      options: constants.CONTENT_TYPES,
    },
  },
  methods: {
    emitEvent(data) {
      const id = data.show.ids.trakt ?? data.movie.ids.trakt;

      this.$emit(data, {
        id: `${id} - ${data.rated_at}`,
        summary: `New ${this.type.slice(0, -1)} watched with ID ${id}`,
        ts: Date.parse(data.rated_at),
      });
    },
  },
  async run() {
    const resources = await this.trakt.getUserWatched({
      type: this.type,
    });

    resources.reverse().forEach(this.emitEvent);
  },
};
