import lemlist from "../../lemlist.app.mjs";

export default {
  key: "lemlist-get-lead",
  name: "Get Lead",
  description: "This action retrieves all the information of a specific lead using its email. [See the docs here](https://developer.lemlist.com/#get-a-specific-lead-by-email)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    lemlist,
    email: {
      propDefinition: [
        lemlist,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lemlist.getLead({
      $,
      email: this.email,
    });

    $.export("$summary", `Successfully retrieved ${this.email} lead!`);
    return response;
  },
};
