import app from "../../jobnimbus.app.mjs";

export default {
  key: "jobnimbus-find-contact-by-email",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  name: "Find Contact By Email",
  description: "Finds contact by email. [See the documentation](https://documenter.getpostman.com/view/3919598/S11PpG4x#46dff3eb-80ae-46b1-a399-eb80ab2a09bc)",
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
  },
  async run ({ $ }) {
    const resp = await this.app.getContacts({
      $,
      params: {
        filter: {
          must: [
            {
              term: {
                email: this.email,
              },
            },
          ],
        },
      },
    });
    $.export("$summary", "Contact has been retrieved successfully.");
    return resp;
  },
};
