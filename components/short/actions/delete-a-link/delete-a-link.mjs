import shortApp from "../../short.app.mjs";

export default {
  key: "short-delete-a-link",
  name: "Delete a Short Link",
  description: "Delete a Short Link. [See the docs](https://developers.short.io/reference/linksbylinkiddelete).",
  version: "0.0.8",
  type: "action",
  props: {
    shortApp,
    domainId: {
      propDefinition: [
        shortApp,
        "domainId",
      ],
    },
    linkIdString: {
      propDefinition: [
        shortApp,
        "link",
        ({ domainId }) => ({
          domainId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { linkIdString } = this;
    const response = await this.shortApp.deleteLink($, linkIdString);
    $.export("$summary", `Successfully deleted the link: ${linkIdString}`);
    return response;
  },
};
