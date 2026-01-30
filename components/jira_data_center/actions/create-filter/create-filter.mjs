import jiraDataCenter from "../../jira_data_center.app.mjs";

export default {
  name: "Create Filter",
  key: "jira_data_center-create-filter",
  description: "Creates a filter. [See the documentation](https://developer.atlassian.com/server/jira/platform/rest/v10002/api-group-filter/#api-api-2-filter-post)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    jiraDataCenter,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the filter",
    },
    jql: {
      propDefinition: [
        jiraDataCenter,
        "jql",
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the filter",
      optional: true,
    },
    editable: {
      type: "boolean",
      label: "Editable",
      description: "Whether the filter is editable",
      optional: true,
    },
    favourite: {
      type: "boolean",
      label: "Favourite",
      description: "Whether the filter is favourite",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.jiraDataCenter.createFilter({
      $,
      data: {
        name: this.name,
        description: this.description,
        jql: this.jql,
        editable: this.editable,
        favourite: this.favourite,
      },
    });
    $.export("$summary", `Successfully created filter with ID \`${response.id}\``);
    return response;
  },
};
