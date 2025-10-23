import workday from "../../workday.app.mjs";

export default {
  key: "workday-get-content-details",
  name: "Get Content Details",
  description: "Get details of a learning content item by ID. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#learning/v1/get-/content/-ID-)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
    contentId: {
      propDefinition: [
        workday,
        "contentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.workday.getContent({
      id: this.contentId,
      $,
    });
    $.export("$summary", `Fetched details for content ID ${this.contentId}`);
    return response;
  },
};
