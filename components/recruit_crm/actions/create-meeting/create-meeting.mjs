import app from "../../recruit_crm.app.mjs";

export default {
  key: "recruit_crm-create-meeting",
  name: "Create Meeting",
  description: "Creates a new meeting. [See the documentation](https://docs.recruitcrm.io/docs/rcrm-api-reference/ca9713d31352a-creates-a-new-meeting)",
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
      propDefinition: [
        app,
        "title",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the meeting. Example: `Video call (https://examplelink)`",
      optional: true,
    },
    reminder: {
      propDefinition: [
        app,
        "reminder",
      ],
    },
    startDate: {
      propDefinition: [
        app,
        "startDate",
      ],
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date and time of the meeting. Example: `2020-06-29T06:36:22.000000Z`",
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
    attendeeContacts: {
      type: "string[]",
      label: "Attendee Contacts",
      description: "Comma separated contact IDs. Example: `21345,33123`",
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
    attendeeCandidates: {
      type: "string[]",
      label: "Attendee Candidates",
      description: "Comma separated candidate IDs. Example: `2543,65478`",
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
    createMeeting(args  = {}) {
      return this.app.post({
        path: "/meetings",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      createMeeting,
      ...data
    } = this;

    const response = await createMeeting({
      step,
      data,
    });

    step.export("$summary", `Successfully created meeting with ID \`${response.id}\``);

    return response;
  },
};
