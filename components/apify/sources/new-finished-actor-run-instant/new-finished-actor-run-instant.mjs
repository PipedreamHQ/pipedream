import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";
import apify from "../../apify.app.mjs";

export default {
  ...common,
  key: "apify-new-finished-actor-run-instant",
  name: "New finished Actor run (instant)",
  description: "Emit new event when a selected Actor is run and finishes. [See the documentation](https://docs.apify.com/api/v2/webhooks-post)",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
    apify,
    actorSource: {
      type: "string",
      label: "Search Actors from",
      description: "Where to search for Actors. Set to **Apify Store Actors** to browse the public [Apify Store](https://apify.com/store), or **Recently used Actors** for Actors you've run before.",
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
    getEmptyConditionMessage() {
      return "No Actor selected. If the list was empty, set \"Search Actors from\" to \"Apify Store Actors\" and pick an Actor before deploying.";
    },
    getSummary(body) {
      return `A new Actor run ${body.eventData.actorRunId} has finished`;
    },
  },
  sampleEmit,
};
