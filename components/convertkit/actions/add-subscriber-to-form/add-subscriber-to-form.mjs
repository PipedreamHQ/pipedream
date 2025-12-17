import convertkit from "../../convertkit.app.mjs";

export default {
  key: "convertkit-add-subscriber-to-form",
  name: "Add subscriber to a form",
  description: "Add subscriber to a form. [See docs here](https://developers.convertkit.com/#add-subscriber-to-a-form)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    convertkit,
    subscriber: {
      propDefinition: [
        convertkit,
        "subscriber",
        () => ({
          returnField: "email_address",
        }),
      ],
    },
    form: {
      propDefinition: [
        convertkit,
        "form",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.convertkit.addSubscriberToForm(this.subscriber, this.form, $);
    if (response) {
      $.export("$summary", "Successfully added subscriber to form");
    }
    return response;
  },
};
