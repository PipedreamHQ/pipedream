import linkly from "../../linkly.app.mjs";

export default {
  key: "linkly-get-link",
  name: "Get Link",
  description: "Fetches a previously produced Linkly link. The link id prop is required to uniquely identify the link.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    linkly,
    linkId: {
      propDefinition: [
        linkly,
        "linkId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.linkly.getLink({
      linkId: this.linkId,
    });
    $.export("$summary", `Successfully fetched link with ID: ${this.linkId}`);
    return response;
  },
};
