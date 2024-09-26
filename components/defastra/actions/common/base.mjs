import { ConfigurationError } from "@pipedream/platform";
import defastra from "../../defastra.app.mjs";

export default {
  props: {
    defastra,
    timeout: {
      type: "string",
      label: "Timeout",
      description: "The timeout parameters allows you to control the response time of the check, allowing you to choose between more detailed results and faster response times. [Please read this guide](https://docs.defastra.com/docs/response-time-timeout-settings).",
      optional: true,
      options: [
        "minimal",
        "normal",
        "extensive",
      ],
    },
    label: {
      type: "string",
      label: "Label",
      description: "A label is any string of text (max. 100 char) that can be attributed to any lookup. They are useful for organizing your data and can be used to search for data in the [Observer](https://docs.defastra.com/docs/what-is-the-observer), or visualize them on the dashboard.",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const fn = this.getFn();
      const response = await fn({
        data: {
          ...this.getData(),
          timeout: this.timeout,
          label: this.label,
        },
      });

      $.export("$summary", `Successfully performed risk analysis with Id: ${response.request_id}.`);

      return response;
    } catch ({ message }) {
      throw new ConfigurationError(JSON.parse(message).error_message);
    }
  },
};
