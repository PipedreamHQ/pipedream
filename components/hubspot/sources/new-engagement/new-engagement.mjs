import common from "../common/common.mjs";
import { ENGAGEMENT_TYPES } from "../../common/object-types.mjs";
import { DEFAULT_LIMIT } from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-engagement",
  name: "New Engagement",
  description: "Emit new event for each new engagement created. This action returns a maximum of 5000 records at a time, make sure you set a correct time range so you don't miss any events",
  version: "0.0.19",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    types: {
      type: "string[]",
      label: "Engagement Types",
      description: "Filter results by the type of engagment",
      options: ENGAGEMENT_TYPES,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getTs(engagement) {
      return engagement.engagement.createdAt;
    },
    generateMeta(engagement) {
      const {
        id,
        type,
      } = engagement.engagement;
      const ts = this.getTs(engagement);
      return {
        id,
        summary: type,
        ts,
      };
    },
    isRelevant(engagement, createdAfter) {
      if (this.getTs(engagement) < createdAfter) {
        return false;
      }
      if (this.types?.length) {
        return this.types.includes(engagement.engagement.type);
      }
      return true;
    },
  },
  async run() {
    const createdAfter = this._getAfter();
    const params = {
      params: {
        limit: DEFAULT_LIMIT,
      },
    };

    await this.paginateUsingHasMore(
      params,
      this.hubspot.getEngagements.bind(this),
      "results",
      createdAfter,
      20,
    );
  },
  sampleEmit,
};
