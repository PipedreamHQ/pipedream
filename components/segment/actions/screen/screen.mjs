// legacy_hash_id: a_eli5j5
import { axios } from "@pipedream/platform";

export default {
  key: "segment-screen",
  name: "Record whenever a user sees a screen",
  description: "The screen method let you record whenever a user sees a screen of your mobile app (note requires userId or anonymousId)",
  version: "0.1.1",
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
    name: {
      type: "string",
      description: "Name of the screen",
      optional: true,
    },
    properties: {
      type: "object",
      description: "Free-form dictionary of properties of the screen, like name",
      optional: true,
    },
    timestamp: {
      type: "string",
      description: "Timestamp when the message itself took place, defaulted to the current time by the Segment Tracking API. It is an ISO-8601 date string.",
      optional: true,
    },
    userId: {
      type: "string",
      description: "Unique identifier for the user in your database",
      optional: true,
    },
  },
  async run({ $ }) {
    return await axios($, {
      method: "post",
      url: "https://api.segment.io/v1/screen",
      auth: {
        username: this.segment.$auth.write_key,
      },
      data: {
        anonymousId: this.anonymousId,
        context: this.context,
        integrations: this.integrations,
        name: this.name,
        properties: this.properties,
        timestamp: this.timestamp,
        userId: this.userId,
      },
    });
  },
};
