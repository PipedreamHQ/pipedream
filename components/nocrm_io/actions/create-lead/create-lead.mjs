import nocrm_io from "../../nocrm_io.app.mjs";

export default {
  name: "Create Lead",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "nocrm_io-create-lead",
  description: "Creates a new lead. [See docs here](https://www.nocrm.io/api#leads)",
  type: "action",
  props: {
    nocrm_io,
    title: {
      label: "Title",
      description: "Lead's title. Usually it corresponds to the company name.",
      type: "string",
    },
    description: {
      label: "Description",
      description: "Lead's description. Usually it contains the information of the contact in the company.",
      type: "string",
    },
    userId: {
      propDefinition: [
        nocrm_io,
        "userId",
      ],
      description: "User's ID to assign the lead to the user.",
      optional: true,
    },
    tags: {
      label: "Tags",
      description: "An array of tags describing the lead.",
      type: "string[]",
      optional: true,
    },
    stepId: {
      propDefinition: [
        nocrm_io,
        "stepId",
      ],
      description: "Step's id for the lead.",
      optional: true,
    },
  },
  async run({ $ }) {
    const parsedTags = typeof this.tags === "string"
      ? JSON.parse(this.tags)
      : this.tags;

    const response = await this.nocrm_io.createLead({
      $,
      data: {
        title: this.title,
        description: this.description,
        user_id: this.userId,
        tags: parsedTags,
        step: this.stepId,
      },
    });

    if (response) {
      $.export("$summary", `Successfully create lead with id ${response.id}`);
    }

    return response;
  },
};
