import app from "../../envoy.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { ConfigurationError } from "@pipedream/platform";
import constants from "../common/constants.mjs";

export default {
  key: "envoy-visitor-signed-status",
  name: "New event when a visitor changes its signed status",
  description: "Emit new event for each visitor who signed in or out. [See the docs](https://developers.envoy.com/hub/reference/entries-2).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    signedStatus: {
      type: "string[]",
      label: "Signed Status",
      description: "Should emit events for which signed status.",
      options: constants.SIGNED_STATUS_OPTS,
    },
    timer: {
      type: "$.interface.timer",
      label: "Watching timer",
      description: "How often to watch the summaries.",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    emit(meta, signedStatus) {
      const ts = Date.parse(meta.createdAt);
      this.$emit(meta, {
        id: `${meta.id}-${meta.signedInAt}-${meta.signedOutAt}`,
        summary: `Visitor ${signedStatus}: ${meta.fullName}`,
        ts,
      });
    },
  },
  async run({ $ }) {
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    if (this.signedStatus.length === 0) {
      throw new ConfigurationError("Signed status is required.");
    }

    const signedInResponse = await this.app.listAllEntriesPages($, {
      signedInAtAfter: today.toISOString(),
      sort: "SIGNED_IN_AT",
      order: "ASC",
    });

    // emitting signed in
    if (this.signedStatus.find((status) => (status === constants.SIGNED_IN))) {
      for (const entry of signedInResponse.filter((entry) => (entry.signedOutAt === null))) {
        this.emit(entry, constants.SIGNED_IN.toLocaleLowerCase());
      }
    }

    // emitting signed out
    if (this.signedStatus.find((status) => (status === constants.SIGNED_OUT))) {
      for (const entry of signedInResponse.filter((entry) => (entry.signedOutAt !== null))) {
        this.emit(entry, constants.SIGNED_OUT.toLocaleLowerCase());
      }
    }
  },
};
