import pcloud from "../../pcloud.app.mjs";

export default {
  props: {
    pcloud,
  },
  async run({ $ }) {
    const response = await this.pcloud._withRetries(() => this.runRequest());
    $.export("$summary", this.getSummary());
    return response;
  },
};
