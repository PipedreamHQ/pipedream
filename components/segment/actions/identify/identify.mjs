// legacy_hash_id: a_poik7m
import { axios } from "@pipedream/platform";

export default {
  key: "segment-identify",
  name: "Identify a user, tie them to their actions and record traits about them",
  description: "identify lets you tie a user to their actions and record traits about them. It includes a unique User ID and any optional traits you know about them (note requires userId or anonymousId)",
  version: "0.2.1",
  type: "action",
  props: {
    segment: {
      type: "app",
      app: "segment",
    },
    anonymousId: {
      type: "string",
      description: "A pseudo-unique substitute for a User ID, for cases when you dont have an absolutely unique identifier. A userId or an anonymousId is required.",
      optional: true,
    },
    context: {
      type: "object",
      description: "Dictionary of extra information that provides useful context about a message, but is not directly related to the API call like ip address or locale",
      optional: true,
    },
    integrations: {
      type: "object",
      description: "Dictionary of destinations to either enable or disable",
      optional: true,
    },
    timestamp: {
      type: "string",
      description: "Timestamp when the message itself took place, defaulted to the current time by the Segment Tracking API.  It is an ISO-8601 date string.",
      optional: true,
    },
    traits: {
      type: "object",
      description: "Free-form dictionary of traits of the user, like email or name.",
      optional: true,
    },
    userId: {
      type: "string",
      description: "Unique identifier for the user in your database. A userId or an anonymousId is required.",
      optional: true,
    },
  },
  async run({ $ }) {
    return await axios($, {
      method: "post",
      url: "https://api.segment.io/v1/identify",
      auth: {
        username: this.segment.$auth.write_key,
      },
      data: {
        anonymousId: this.anonymousId,
        context: this.context,
        integrations: this.integrations,
        timestamp: this.timestamp,
        traits: this.traits,
        userId: this.userId,
      },
    });
  },
};
