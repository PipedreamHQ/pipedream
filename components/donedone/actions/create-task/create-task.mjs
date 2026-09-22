import donedone from "../../donedone.app.mjs";

export default {
  key: "donedone-create-task",
  name: "Create Task",
  description: "Create a new task in the selected project. [See the documentation](https://app.swaggerhub.com/apis-docs/DoneDone/DoneDone-2-Public-API/1.0.0-oas3#/Tasks/post__account_id__internal_projects__internal_project_id__tasks)",
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
    title: {
      type: "string",
      label: "Title",
      description: "The title of the task",
    },
    statusId: {
      propDefinition: [
        donedone,
        "statusId",
        (c) => ({
          accountId: c.accountId,
          projectId: c.projectId,
        }),
      ],
    },
    priorityId: {
      propDefinition: [
        donedone,
        "priorityId",
        (c) => ({
          accountId: c.accountId,
          projectId: c.projectId,
        }),
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the task",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date of the task. Example: `Oct 15, 2019`",
      optional: true,
    },
    assigneeId: {
      propDefinition: [
        donedone,
        "assigneeId",
        (c) => ({
          accountId: c.accountId,
          projectId: c.projectId,
        }),
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        donedone,
        "tags",
        (c) => ({
          accountId: c.accountId,
          projectId: c.projectId,
        }),
      ],
    },
    watcherIds: {
      propDefinition: [
        donedone,
        "watcherIds",
        (c) => ({
          accountId: c.accountId,
          projectId: c.projectId,
        }),
      ],
    },
    atMentionIds: {
      propDefinition: [
        donedone,
        "atMentionIds",
        (c) => ({
          accountId: c.accountId,
          projectId: c.projectId,
        }),
      ],
    },
    linkableTaskIds: {
      propDefinition: [
        donedone,
        "linkableTaskIds",
        (c) => ({
          accountId: c.accountId,
          projectId: c.projectId,
        }),
      ],
    },
    conversationId: {
      propDefinition: [
        donedone,
        "conversationId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
  },
  methods: {
    ensureHtml(str) {
      const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(str);
      return hasHtmlTags
        ? str
        : `<p>${str}</p>`;
    },
  },
  async run({ $ }) {
    const response = await this.donedone.createTask({
      $,
      accountId: this.accountId,
      projectId: this.projectId,
      data: {
        title: this.title,
        description: this.description
          ? this.ensureHtml(this.description)
          : undefined,
        dueDate: this.dueDate,
        assigneeID: this.assigneeId,
        statusID: this.statusId,
        priorityID: this.priorityId,
        listTags: this.tags,
        listWatchersIDs: this.watcherIds,
        listAtMentionUserIDs: this.atMentionIds,
        listLinkableTaskIDs: this.linkableTaskIds,
        originatingConversationID: this.conversationId,
      },
    });
    $.export("$summary", `Successfully created task with ID \`${response.id}\``);
    return response;
  },
};
