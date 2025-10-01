import nextcloud from "../../nextcloud.app.mjs";

export default {
  key: "nextcloud-create-share",
  name: "Create Share",
  description: "Creates a new share link from the specified path in Nextcloud. [See the documentation](https://docs.nextcloud.com/server/latest/developer_manual/_static/openapi.html#/operations/files_sharing-shareapi-create-share)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nextcloud,
    path: {
      propDefinition: [
        nextcloud,
        "path",
      ],
      description: "The path of the file or folder to share",
    },
  },
  async run({ $ }) {
    const { ocs: { data } } = await this.nextcloud.createShare({
      $,
      data: {
        path: this.path,
        shareType: 3,
      },
    });
    $.export("$summary", `Successfully created share link: ${data.url}`);
    return data;
  },
};
