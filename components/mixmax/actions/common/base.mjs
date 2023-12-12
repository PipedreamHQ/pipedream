import mixmax from "../../mixmax.app.mjs";

export default {
  props: {
    mixmax,
  },
  async run({ $ }) {
    const response = await this.processEvent();
    $.export("$summary", this.getSummary(response));
    return response;
  },
};
