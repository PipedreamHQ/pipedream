import unisender from "../../unisender.app.mjs";

export default {
  props: {
    unisender,
  },
  async run({ $ }) {
    const response = await this.processEvent($);

    if (response.error) {
      throw new Error(response.error);
    }

    $.export("$summary", this.getSummary(response));
    return response;
  },
};
