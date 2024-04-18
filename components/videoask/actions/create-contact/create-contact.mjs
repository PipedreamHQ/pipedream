import videoask from "../../videoask.app.mjs";

export default {
  key: "videoask-create-contact",
  name: "Create Contact",
  description: "Creates a new contact directly in VideoAsk",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    videoask,
    contactInfo: {
      propDefinition: [
        videoask,
        "contactInfo",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.videoask.createContact(this.contactInfo);
    $.export("$summary", `Successfully created contact with ID: ${response.id}`);
    return response;
  },
};
