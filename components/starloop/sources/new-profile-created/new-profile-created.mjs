import app from "../../starloop.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "starloop-new-profile-created",
  name: "New Profile Created",
  description: "This source triggers when a new profile is created in Starloop.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  async run() {
    const { profile_ids: profiles } = await this.app.listIds();

    profiles.forEach((profile) => {
      this.$emit(profile, {
        id: profile.id,
        summary: `New Profile: ${profile.id}`,
        ts: Date.now(),
      });
    });
  },
};
