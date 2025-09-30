import app from "../../piggy.app.mjs";

export default {
  name: "Find Or Create Contact",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "piggy-find-or-create-contact",
  description: "Find or create a contact. [See the documentation](https://docs.piggy.eu/v3/oauth/contacts#:~:text=Possible%20errors-,Find%20or%20Create%20Contact,-Find%20Contact%20by)",
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "Email of the contact",
    },
  },
  async run({ $ }) {
    const response = await this.app.findOrCreateContact({
      $,
      data: {
        email: this.email,
      },
    });

    if (response) {
      $.export("$summary", "Successfully retrieved or created contact");
    }

    return response;
  },
};
