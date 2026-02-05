import donedone from "../../donedone.app.mjs";

export default {
  key: "donedone-add-people-to-project",
  name: "Add People to Project",
  description: "Add people to a project. [See the documentation](https://app.swaggerhub.com/apis-docs/DoneDone/DoneDone-2-Public-API/1.0.0-oas3#/Projects/put__account_id__internal_projects__internal_project_id__people)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    donedone,
    accountId: {
      propDefinition: [
        donedone,
        "accountId",
      ],
    },
    projectId: {
      propDefinition: [
        donedone,
        "projectId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
    peopleIds: {
      propDefinition: [
        donedone,
        "assigneeId",
        (c) => ({
          accountId: c.accountId,
          projectId: c.projectId,
        }),
      ],
      type: "string[]",
      label: "People IDs",
      description: "The IDs of the people to add to the project",
    },
  },
  async run({ $ }) {
    const response = await this.donedone.addPeopleToProject({
      $,
      accountId: this.accountId,
      projectId: this.projectId,
      data: {
        listPeopleIDs: this.peopleIds,
      },
    });
    $.export("$summary", `Successfully added people to project with ID \`${this.projectId}\``);
    return response;
  },
};
