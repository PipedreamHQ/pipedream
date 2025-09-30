import sendspark from "../../sendspark.app.mjs";

export default {
  key: "sendspark-create-dynamic-video",
  name: "Create Dynamic Video",
  description: "Creates a new dynamic video campaign. [See the documentation](https://help.sendspark.com/en/articles/9051823-api-automatically-create-dynamic-videos-via-api-integration)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sendspark,
    dynamicId: {
      propDefinition: [
        sendspark,
        "dynamicId",
      ],
    },
    contactName: {
      type: "string",
      label: "Name",
      description: "Name of the contact.",
    },
    contactEmail: {
      type: "string",
      label: "Email",
      description: "Email of the contact.",
    },
    company: {
      type: "string",
      label: "Company",
      description: "The name of the company.",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "The title of the job.",
      optional: true,
    },
    backgroundUrl: {
      type: "string",
      label: "Background URL",
      description: "What do you want to show in the contact video.",
    },
  },
  async run({ $ }) {
    const {
      sendspark,
      dynamicId,
      ...data
    } = this;

    const response = await sendspark.createDynamicVideoCampaign({
      $,
      dynamicId,
      data: {
        processAndAuthorizeCharge: true,
        prospectDepurationConfig: {
          forceCreation: false,
          payloadDepurationStrategy: "keep-first-valid",
        },
        prospect: data,
      },
    });

    $.export("$summary", `Successfully created dynamic video campaign with contact name ${this.contactName}`);
    return response;
  },
};
