import memberspot from "../../memberspot.app.mjs";

export default {
  key: "memberspot-list-offer-id-options",
  name: "List Offer ID Options",
  description: "Retrieves available options for the Offer ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    memberspot,
  },
  async run({ $ }) {
    const options = await memberspot.propDefinitions.offerId.options.call(this.memberspot);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
