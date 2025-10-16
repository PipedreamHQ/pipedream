import app from "../../recruit_crm.app.mjs";

export default {
  key: "recruit_crm-create-task",
  name: "Create Task",
  description: "Creates a new task. [See the documentation](https://docs.recruitcrm.io/docs/rcrm-api-reference/e9bb027660641-creates-a-new-task)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    title: {
      description: "The title of the task",
      propDefinition: [
        app,
        "title",
      ],
    },
    description: {
      description: "The description of the task",
      propDefinition: [
        app,
        "description",
      ],
    },
    reminder: {
      description: "Reminder ID of the task.",
      propDefinition: [
        app,
        "reminder",
      ],
    },
    startDate: {
      description: "The start date and time of the task. Example: `2020-06-29T05:36:22.000000Z`",
      propDefinition: [
        app,
        "startDate",
      ],
    },
    relatedToType: {
      propDefinition: [
        app,
        "relatedToType",
      ],
    },
    relatedTo: {
      label: "Related To",
      description: "Associated entity's slug. Example: `23123`",
      propDefinition: [
        app,
        "relatedTo",
        ({ relatedToType }) => ({
          relatedToType,
        }),
      ],
    },
    associatedCandidates: {
      type: "string[]",
      label: "Associated Candidates",
      description: "Comma separated candidate IDs. Example: `275,16318617835190000051Ond`",
      propDefinition: [
        app,
        "candidateId",
        () => ({
          mapper: ({
            slug: value, first_name: label,
          }) => ({
            label,
            value,
          }),
        }),
      ],
    },
    associatedCompanies: {
      type: "string[]",
      label: "Associated Companies",
      description: "Comma separated company IDs. Example: `275,16318617835190000051Ond`",
      propDefinition: [
        app,
        "companyId",
        () => ({
          mapper: ({
            slug: value, company_name: label,
          }) => ({
            label,
            value,
          }),
        }),
      ],
    },
    associatedContacts: {
      type: "string[]",
      label: "Associated Contacts",
      description: "Comma separated contact IDs. Example: `275,16318617835190000051Ond`",
      propDefinition: [
        app,
        "contactId",
        () => ({
          mapper: ({
            slug: value, first_name: label,
          }) => ({
            label,
            value,
          }),
        }),
      ],
    },
    associatedJobs: {
      type: "string[]",
      label: "Associated Jobs",
      description: "Comma separated job IDs. Example: `275,16318617835190000051Ond`",
      propDefinition: [
        app,
        "jobId",
        () => ({
          mapper: ({
            slug: value, name: label,
          }) => ({
            label,
            value,
          }),
        }),
      ],
    },
    associatedDeals: {
      type: "string[]",
      label: "Associated Deals",
      description: "Comma separated deal IDs. Example: `275,16318617835190000051Ond`",
      propDefinition: [
        app,
        "dealId",
        () => ({
          mapper: ({
            slug: value, name: label,
          }) => ({
            label,
            value,
          }),
        }),
      ],
    },
  },
  methods: {
    createTask(args = {}) {
      return this.app.post({
        path: "/tasks",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      createTask,
      ...data
    } = this;

    const response = await createTask({
      step,
      data,
    });

    step.export("$summary", `Successfully created task with ID \`${response.id}\``);

    return response;
  },
};
