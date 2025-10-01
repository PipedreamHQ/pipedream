import klenty from "../../klenty.app.mjs";

export default {
  key: "klenty-add-prospect",
  name: "Add Prospect to List",
  description: "Adds a new prospect to a list in Klenty. [See the documentation](https://support.klenty.com/en/articles/8193937-klenty-s-post-apis#h_8848b48485)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    klenty,
    email: {
      propDefinition: [
        klenty,
        "email",
      ],
      optional: true,
    },
    firstName: {
      propDefinition: [
        klenty,
        "firstName",
      ],
    },
    list: {
      propDefinition: [
        klenty,
        "list",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.klenty.addProspectToList({
      $,
      data: {
        Email: this.email,
        FirstName: this.firstName,
        List: this.list,
      },
    });

    $.export("$summary", `Successfully added prospect ${this.prospectEmail} to list ${this.list}`);
    return response;
  },
};
