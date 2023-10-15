import productlane from "../../productlane.app.mjs";

export default {
  key: "productlane-create-feedback",
  name: "Create Feedback",
  description: "Create new feedback in Productlane",
  version: "0.0.1",
  type: "action",
  props: {
    productlane,
    email: {
      propDefinition: [
        productlane,
        "email",
      ],
    },
    notify: {
      propDefinition: [
        productlane,
        "notify",
      ],
    },
    origin: {
      propDefinition: [
        productlane,
        "origin",
      ],
    },
    painlevel: {
      propDefinition: [
        productlane,
        "painlevel",
      ],
    },
    text: {
      propDefinition: [
        productlane,
        "text",
      ],
    },
    projectId: {
      propDefinition: [
        productlane,
        "projectId",
      ],
    },
  },
  async run({ $ }) {
    const feedback = {
      email: this.email,
      notify: this.notify,
      origin: this.origin,
      painlevel: this.painlevel,
      text: this.text,
      projectId: this.projectId,
    };

    const response = await this.productlane.createFeedback(feedback);
    $.export("$summary", `Successfully created feedback with ID: ${response.id}`);
    return response;
  },
};
