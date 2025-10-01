import nextcloud from "../../nextcloud.app.mjs";

export default {
  key: "nextcloud-get-shares",
  name: "Get Shares",
  description: "Retrieves a list of shares based on the specified criteria in Nextcloud. [See the documentation](https://docs.nextcloud.com/server/latest/developer_manual/_static/openapi.html#/operations/files_sharing-shareapi-get-shares)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    nextcloud,
    path: {
      propDefinition: [
        nextcloud,
        "path",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const { ocs: { data } } = await this.nextcloud.listShares({
      $,
      params: {
        path: this.path,
      },
    });
    $.export("$summary", `Successfully retrieved ${data.length} share${data.length === 1
      ? ""
      : "s"}`);
    return data;
  },
};
