import confluenceDataCenter from "../../confluence_data_center.app.mjs";
import { parseObjectEntries } from "../../common/utils.mjs";

export default {
  key: "confluence_data_center-update-content",
  name: "Update Content",
  description: "Updates a page or blogpost in Confluence Data Center. [See the documentation](https://developer.atlassian.com/server/confluence/rest/v1022/api-group-content-resource/#api-rest-api-content-contentid-put)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    confluenceDataCenter,
    type: {
      propDefinition: [
        confluenceDataCenter,
        "type",
      ],
    },
    contentId: {
      propDefinition: [
        confluenceDataCenter,
        "contentId",
        ({ type }) => ({
          type,
        }),
      ],
    },
    title: {
      propDefinition: [
        confluenceDataCenter,
        "title",
      ],
    },
    position: {
      propDefinition: [
        confluenceDataCenter,
        "position",
      ],
    },
    body: {
      propDefinition: [
        confluenceDataCenter,
        "body",
      ],
    },
    metadata: {
      propDefinition: [
        confluenceDataCenter,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    const { version: { number } } = await this.confluenceDataCenter.getContentById({
      $,
      id: this.contentId,
    });
    const version = number + 1;
    const response = await this.confluenceDataCenter.updateContent({
      $,
      id: this.contentId,
      data: {
        type: this.type,
        title: this.title,
        position: this.position,
        body: this.body
          ? {
            storage: {
              value: this.body,
              representation: "storage",
            },
          }
          : undefined,
        metadata: this.metadata
          ? parseObjectEntries(this.metadata)
          : undefined,
        version: {
          number: version,
        },
      },
    });
    $.export("$summary", `Successfully updated content with ID: ${this.contentId}`);
    return response;
  },
};
