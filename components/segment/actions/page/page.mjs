// legacy_hash_id: a_YEiPdk
import { axios } from "@pipedream/platform";

export default {
  key: "segment-page",
  name: "Record page views on your website",
  description: "The page method lets you record page views on your website, along with optional extra information about the page being viewed (note requires userId or anonymousId)",
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
    name: {
      type: "string",
      description: "Name of the page",
      optional: true,
    },
    properties: {
      type: "object",
      description: "Free-form dictionary of properties of the page, like url and referrer",
      optional: true,
    },
    timestamp: {
      type: "string",
      description: "Timestamp when the message itself took place, defaulted to the current time by the Segment Tracking API. It is an ISO-8601 date string.",
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
      url: "https://api.segment.io/v1/page",
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
