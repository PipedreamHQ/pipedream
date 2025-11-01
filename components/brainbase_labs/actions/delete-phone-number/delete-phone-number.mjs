import app from "../../brainbase_labs.app.mjs";

export default {
  key: "brainbase-delete-phone-number",
  name: "Delete Phone Number",
  description: "Delete a registered phone number for the team. [See the documentation](https://docs.usebrainbase.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    phoneNumberId: {
      propDefinition: [
        app,
        "phoneNumberId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deletePhoneNumber({
      $,
      phoneNumberId: this.phoneNumberId,
    });

    $.export("$summary", `Successfully deleted phone number with ID ${this.phoneNumberId}`);
    return response;
  },
};

