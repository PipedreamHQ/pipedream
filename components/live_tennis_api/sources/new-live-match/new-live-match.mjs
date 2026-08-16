import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../live_tennis_api.app.mjs";

export default {
  key: "live_tennis_api-new-live-match",
  name: "New Live Match",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Emit new event when a match goes live. [See the documentation](https://docs.livetennisapi.com/reference.html)",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Live Tennis API on this schedule.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    tour: {
      propDefinition: [
        app,
        "tour",
      ],
    },
  },
  async run({ $ }) {
    const {
      app, tour,
    } = this;

    const response = await app.listMatches({
      $,
      params: {
        status: "live",
        tour,
        limit: 200,
      },
    });

    const matches = response?.data ?? [];
    for (const match of matches) {
      const ts = match.scheduled_time
        ? Date.parse(match.scheduled_time)
        : Date.now();
      this.$emit(match, {
        id: match.id,
        summary: `Live: ${match.players?.p1?.name ?? "TBD"} vs ${match.players?.p2?.name ?? "TBD"} (${match.tournament ?? "Unknown"})`,
        ts,
      });
    }
  },
};
