import { ConfigurationError } from "@pipedream/platform";
import boloforms from "../../boloforms.app.mjs";

export default {
  props: {
    boloforms,
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject will be sent.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message will be sent.",
    },
  },
  async run({ $ }) {
    const response = await this.boloforms.dispatchDocument({
      $,
      data: this.getData(this),
    });

    if (response.error) {
      throw new ConfigurationError(response.error);
    }

    $.export("$summary", this.getSummary());
    return response;
  },
};
