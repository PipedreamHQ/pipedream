import qntrl from "../../qntrl.app.mjs";

export default {
  key: "qntrl-create-job",
  name: "Create Job",
  description: "Creates a new job (card) in Qntrl. [See the documentation](https://core.qntrl.com/apidoc.html?type=reference&module=jobs&action=CreateJob)",
  version: "0.0.1",
  type: "action",
  props: {
    qntrl,
    orgId: {
      propDefinition: [
        qntrl,
        "orgId",
      ],
    },
    formId: {
      propDefinition: [
        qntrl,
        "formId",
        ({ orgId }) => ({
          orgId,
        }),
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the job.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the job.",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date of the job as a valid date string, e.g. `2024-03-13T09:30:00Z` or `2024-05-20`.",
      optional: true,
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description: "Additional parameters to send in this request. [See the documentation](https://core.qntrl.com/apidoc.html?type=reference&module=jobs&action=CreateJob) for all available parameters.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      qntrl, orgId, formId, dueDate, additionalOptions, ...data
    } = this;
    const response = await qntrl.createJob({
      $,
      orgId,
      data: {
        layout_id: formId,
        duedate: dueDate,
        ...data,
        ...additionalOptions,
      },
    });
    $.export("$summary", `Successfully created job (ID: ${response.id})`);
    return response;
  },
};
