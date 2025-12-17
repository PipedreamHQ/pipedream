import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";
import apify from "../../apify.app.mjs";

export default {
  ...common,
  key: "apify-new-finished-actor-run-instant",
  name: "New Finished Actor Run (Instant)",
  description: "Emit new event when a selected Actor is run and finishes.",
  version: "0.0.8",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
    apify,
    actorSource: {
      type: "string",
      label: "Search Actors from",
      description: "Where to search for Actors. Valid options are Store and Recently used Actors.",
      options: [
        {
          label: "Apify Store Actors",
          value: "store",
        },
        {
          label: "Recently used Actors",
          value: "recently-used",
        },
      ],
      default: "recently-used",
      reloadProps: true,
    },
  },
  additionalProps() {
    const props = {};

    if (this.actorSource) {
      props.actorId = {
        ...apify.propDefinitions.actorId, // it doesn't contain options() method
        options: async ({ page }) => {
          return await this.apify.getActorOptions({
            page,
            actorSource: this.actorSource,
          });
        },
      };
    }

    return props;
  },
  methods: {
    ...common.methods,
    getCondition() {
      return {
        actorId: this.actorId,
      };
    },
    getSummary(body) {
      return `A new Actor run ${body.eventData.actorRunId} has finished`;
    },
  },
  sampleEmit,
};
