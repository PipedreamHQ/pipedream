import base from "../common/base.mjs";

const { jira } = base.props;

export default {
  ...base,
  key: "jira-create-version",
  name: "Create Version",
  description: "Create Jira Version in project. [See docs here](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-project-versions/#api-rest-api-3-version-post)",
  version: "0.2.0",
  type: "action",
  props: {
    ...base.props,
    projectId: {
      propDefinition: [
        jira,
        "projectId",
        (c) => ({
          cloudId: c.cloudId,
        }),
      ],
    },
    name: {
      label: "Version Name",
      description: "The unique name of the version. The maximum length is 255 characters.",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.jira.createVersion({
      $,
      cloudId: this.cloudId,
      data: {
        name: this.version,
        projectId: this.projectId,
      },
    });

    $.export("$summary", "Successfully created version");

    return response;
  },
};
