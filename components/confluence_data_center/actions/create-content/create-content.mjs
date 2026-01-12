import confluenceDataCenter from "../../confluence_data_center.app.mjs";
import { parseObjectEntries } from "../../common/utils.mjs";

export default {
  key: "confluence_data_center-create-content",
  name: "Create Content",
  description: "Creates a new page or blogpost in Confluence Data Center. [See the documentation](https://developer.atlassian.com/server/confluence/rest/v1022/api-group-content-resource/#api-rest-api-content-post)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
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
    title: {
      propDefinition: [
        confluenceDataCenter,
        "title",
      ],
    },
    status: {
      propDefinition: [
        confluenceDataCenter,
        "status",
      ],
    },
    spaceKey: {
      propDefinition: [
        confluenceDataCenter,
        "spaceKey",
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
    const response = await this.confluenceDataCenter.createContent({
      $,
      data: {
        type: this.type,
        title: this.title,
        status: this.status,
        space: this.spaceKey
          ? {
            key: this.spaceKey,
          }
          : undefined,
        position: this.position,
        body: {
          storage: {
            value: this.body,
            representation: "storage",
          },
        },
        metadata: this.metadata
          ? parseObjectEntries(this.metadata)
          : undefined,
      },
    });
    $.export("$summary", `Successfully created content with ID: ${response.id}`);
    return response;
  },
};
