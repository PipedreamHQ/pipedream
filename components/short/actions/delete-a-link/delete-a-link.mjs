import shortApp from "../../short.app.mjs";

export default {
  key: "short-delete-a-link",
  name: "Delete Link",
  description: "Delete a Short Link. [See the documentation](https://developers.short.io/reference/linksbylinkiddelete).",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shortApp,
    shortLink: {
      propDefinition: [
        shortApp,
        "link",
      ],
    },
  },
  async run({ $ }) {
    const url = new URL(this.shortLink);
    const domain = url.host;
    const path = url.pathname.split("/").join("");
    const linkInfo = await this.shortApp.getLinkInfo(domain, path);

    const response = await this.shortApp.deleteLink($, linkInfo.idString);
    $.export("$summary", `Successfully deleted the link: ${linkInfo.idString}`);
    return response;
  },
};
