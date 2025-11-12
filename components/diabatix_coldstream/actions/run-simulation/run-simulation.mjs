import coldstream from "../../diabatix_coldstream.app.mjs";

export default {
  key: "diabatix_coldstream-run-simulation",
  name: "Run Simulation",
  description: "Starts a new simulation in ColdStream with specified parameters and submits the created case. [See the documentation](https://coldstream.readme.io/reference/post_cases-submit)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    coldstream,
    organizationId: {
      propDefinition: [
        coldstream,
        "organizationId",
      ],
    },
    projectId: {
      propDefinition: [
        coldstream,
        "projectId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
    },
    caseName: {
      type: "string",
      label: "Case Name",
      description: "The name of the case.",
    },
    credits: {
      type: "integer",
      label: "Credits",
      description: "The credits to the case.",
    },
    resolution: {
      type: "string",
      label: "Resolution",
      description: "The resolution of the case.",
      options: [
        {
          label: "Conceptual",
          value: "0",
        },
        {
          label: "Detailed",
          value: "1",
        },
        {
          label: "Draft",
          value: "2",
        },
      ],
    },
    estimatedTime: {
      type: "string",
      label: "Estimated Time",
      description: "The estimated time for the case.",
      optional: true,
    },
    processingMethod: {
      type: "string",
      label: "Processing Method",
      description: "The method of the case.",
      options: [
        {
          label: "Correlation",
          value: "0",
        },
        {
          label: "Cfd",
          value: "1",
        },
        {
          label: "CfdReinforced",
          value: "2",
        },
      ],
      optional: true,
    },
    priorityLevel: {
      type: "string",
      label: "Priority Level",
      description: "The priority of the case.",
      options: [
        {
          label: "Low",
          value: "0",
        },
        {
          label: "Medium",
          value: "1",
        },
        {
          label: "High",
          value: "2",
        },
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const createCaseResponse = await this.coldstream.createCase({
      $,
      data: {
        projectId: this.projectId,
        name: this.caseName,
        type: 1,
      },
    });

    const caseId = createCaseResponse.id;

    const submitCaseResponse = await this.coldstream.submitCase({
      $,
      data: {
        caseId,
        credits: this.credits,
        resolution: this.resolution,
        estimatedTime: this.estimatedTime,
        processingMethod: this.processingMethod,
        priorityLevel: this.priorityLevel,
      },
    });

    $.export("$summary", `Successfully started and submitted thermal simulation case with ID ${caseId}`);
    return submitCaseResponse;
  },
};
