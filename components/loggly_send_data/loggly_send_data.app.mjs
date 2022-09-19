import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "loggly_send_data",
  propDefinitions: {
    tags: {
      label: "Tags",
      description: "A comma-separated list of tags you'd like to apply to events (e.g. `foo,bar`). [See the docs](https://documentation.solarwinds.com/en/success_center/loggly/content/admin/tags.htm)",
      type: "string",
    },
    eventData: {
      label: "Event data",
      description: "The data you'd like to send to Loggly. [See the docs](https://documentation.solarwinds.com/en/success_center/loggly/content/admin/http-endpoint.htm)",
      type: "string",
    },
    contentType: {
      label: "Content type",
      description: "Plaintext, JSON, etc.",
      type: "string",
      optional: true,
      default: "text/plain",
      options: [
        "text/plain",
        "application/json",
      ],
    },
  },
  methods: {
    /**
     * This method sends log data to Loggly
     *
     * @param {string} tags - A comma-separated list of tags. See https://documentation.solarwinds.com/en/success_center/loggly/content/admin/tags.htm
     * @param {string} contentType - The content type of the data to send to Loggly
     * @param {string} data - The data to send to Loggly
     * @returns {Object} The HTTP response from Loggly
     */
    async logData({
      $, contentType, tags, data,
    }) {
      return await axios($, {
        method: "POST",
        url: `https://logs-01.loggly.com/inputs/${this.$auth.token}/tag/${tags}`,
        headers: {
          "user-agent": "@PipedreamHQ/pipedream v0.1",
          "content-type": contentType,
        },
        data,
      });
    },
  },
};
