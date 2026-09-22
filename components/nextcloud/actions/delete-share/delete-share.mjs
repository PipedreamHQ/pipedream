import nextcloud from "../../nextcloud.app.mjs";

export default {
  key: "nextcloud-delete-share",
  name: "Delete Share",
  description: "Deletes a specific share in Nextcloud. [See the documentation](https://docs.nextcloud.com/server/latest/developer_manual/_static/openapi.html#/operations/files_sharing-shareapi-delete-share)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nextcloud,
    shareId: {
      propDefinition: [
        nextcloud,
        "shareId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.nextcloud.deleteShare({
      $,
      shareId: this.shareId,
    });
    $.export("$summary", `Share with ID ${this.shareId} successfully deleted`);
    return response;
  },
};
