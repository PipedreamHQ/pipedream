import voilanorbert from "../../voilanorbert.app.mjs";

export default {
  type: "action",
  props: {
    voilanorbert,
  },
  async run({ $ }) {
    const response = await this.processEvent({
      $,
    });

    $.export("$summary", this.getSummary(response));
  },
};
