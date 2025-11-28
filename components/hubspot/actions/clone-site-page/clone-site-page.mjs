import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-clone-site-page",
  name: "Clone Site Page",
  description:
    "Clone a site page in Hubspot. [See the documentation](https://developers.hubspot.com/docs/reference/api/cms/pages#post-%2Fcms%2Fv3%2Fpages%2Fsite-pages%2Fclone)",
  version: "0.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hubspot,
    pageId: {
      propDefinition: [
        hubspot,
        "pageId",
      ],
    },
    cloneName: {
      type: "string",
      label: "Clone Name",
      description: "The name of the cloned page.",
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.cloneSitePage({
      $,
      data: {
        id: this.pageId,
        cloneName: this.cloneName,
      },
    });

    $.export(
      "$summary",
      `Successfully cloned site page with ID: ${response.id}`,
    );

    return response;
  },
};
