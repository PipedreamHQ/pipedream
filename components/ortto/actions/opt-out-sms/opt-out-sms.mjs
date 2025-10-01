import ortto from "../../ortto.app.mjs";

export default {
  key: "ortto-opt-out-sms",
  name: "Opt Out of SMS",
  description: "Allows a user to opt-out from all SMS communications. [See the documentation](https://help.ortto.com/a-250-api-reference)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ortto,
    userEmail: {
      propDefinition: [
        ortto,
        "userEmail",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ortto.updatePerson({
      data: {
        people: [
          {
            fields: {
              "str::email": this.userEmail,
              "bol::sp": false,
            },
          },
        ],
        async: false,
        merge_by: [
          "str::email",
        ],
      },
    });

    $.export("$summary", `Successfully opted out SMS for User ID: ${this.userEmail}`);
    return response;
  },
};
