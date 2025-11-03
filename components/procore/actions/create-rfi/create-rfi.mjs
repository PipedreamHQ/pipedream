import app from "../../procore.app.mjs";

export default {
  key: "procore-create-rfi",
  name: "Create RFI",
  description: "Create a new RFI. [See the documentation](https://developers.procore.com/reference/rest/rfis?version=latest#create-rfi).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
    },
    projectId: {
      optional: false,
      propDefinition: [
        app,
        "projectId",
        ({ companyId }) => ({
          companyId,
        }),
      ],
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The Subject of the RFI",
    },
    questionBody: {
      type: "string",
      label: "Question Body",
      description: "The Body of the Question",
    },
    rfiManagerId: {
      propDefinition: [
        app,
        "rfiPotentialManagerId",
        ({
          companyId, projectId,
        }) => ({
          companyId,
          projectId,
        }),
      ],
    },
    assigneIds: {
      type: "string[]",
      label: "Assignee IDs",
      description: "The Assignee IDs of the RFI",
      optional: false,
      propDefinition: [
        app,
        "potentialAssigneeId",
        ({
          companyId, projectId,
        }) => ({
          companyId,
          projectId,
        }),
      ],
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "The Reference of the RFI",
      optional: true,
    },
    isPrivate: {
      type: "boolean",
      label: "Private",
      description: "Whether the RFI is private or not",
      optional: true,
    },
    locationId: {
      propDefinition: [
        app,
        "locationId",
        ({
          companyId, projectId,
        }) => ({
          companyId,
          projectId,
        }),
      ],
    },
  },
  methods: {
    createRfi({
      projectId, ...args
    } = {}) {
      return this.app.post({
        path: `/projects/${projectId}/rfis`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createRfi,
      companyId,
      projectId,
      subject,
      questionBody,
      rfiManagerId,
      assigneIds,
      reference,
      isPrivate,
      locationId,
    } = this;

    const response = await createRfi({
      $,
      companyId,
      projectId,
      data: {
        rfi: {
          subject,
          question: {
            body: questionBody,
          },
          rfi_manager_id: rfiManagerId,
          reference,
          private: isPrivate,
          location_id: locationId,
          assignee_ids: assigneIds,
        },
      },
    });
    $.export("$summary", `Successfully created RFI with ID \`${response.id}\`.`);
    return response;
  },
};
