import { ConfigurationError } from "@pipedream/platform";
import {
  DEFAULT_LIMIT, MAX_INITIAL_EVENTS,
} from "../../common/constants.mjs";
import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-event",
  name: "New Events",
  description: "Emit new event for each new Hubspot event. Note: Only available for Marketing Hub Enterprise, Sales Hub Enterprise, Service Hub Enterprise, or CMS Hub Enterprise accounts",
  version: "0.0.48",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    objectType: {
      propDefinition: [
        common.props.hubspot,
        "objectType",
      ],
    },
    objectIds: {
      propDefinition: [
        common.props.hubspot,
        "objectIds",
        (c) => ({
          objectType: c.objectType,
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      try {
        await this.hubspot.getEvents({
          params: {
            objectType: this.objectType,
            objectId: this.objectIds[0],
          },
        });
      } catch {
        throw new ConfigurationError(
          "Error occurred. Please verify that your Hubspot account is one of: Marketing Hub Enterprise, Sales Hub Enterprise, Service Hub Enterprise, or CMS Hub Enterprise",
        );
      }
      // Emit a small, capped sample of pre-existing events on deploy, then pin
      // the cursor to deploy time so run() only ever emits genuinely new events
      // (and the user's deploy-time opt-out is honored). Pinning to deploy time
      // is safe because every pre-existing event predates it.
      const deployTs = Date.now();
      const params = await this.getParams(null);
      await this.processResults(null, params);
      this._setAfter(deployTs);
    },
  },
  methods: {
    ...common.methods,
    getTs() {
      return Date.now();
    },
    generateMeta(result) {
      const {
        id, eventType,
      } = result;
      return {
        id,
        summary: eventType,
        ts: this.getTs(),
      };
    },
    getParams() {
      return null;
    },
    getEventParams(objectId, occurredAfter) {
      return {
        params: {
          limit: DEFAULT_LIMIT,
          objectType: this.objectType,
          objectId,
          occurredAfter,
        },
      };
    },
    async processResults(after) {
      // Deploy (initial) pass: emit a single source-wide sample capped at
      // MAX_INITIAL_EVENTS across ALL selected object IDs. paginate() resets its
      // cap per call, so looping it once per objectId would emit up to
      // MAX_INITIAL_EVENTS * objectIds.length. The deploy() hook pins the cursor
      // to deploy time, so a representative sample is all that's needed here.
      if (!after) {
        let remaining = MAX_INITIAL_EVENTS;
        for (const objectId of this.objectIds) {
          if (remaining <= 0) {
            break;
          }
          const { results = [] } = await this.hubspot.getEvents(
            this.getEventParams(objectId, after),
          );
          for (const result of results) {
            this.emitEvent(result);
            if (--remaining <= 0) {
              break;
            }
          }
        }
        return;
      }

      // Subsequent runs: emit every event created after the cursor, per ID.
      for (const objectId of this.objectIds) {
        const params = this.getEventParams(objectId, after);
        await this.paginate(
          params,
          this.hubspot.getEvents.bind(this),
          "results",
          after,
        );
      }
    },
  },
  sampleEmit,
};
