import whiteSwan from "../../white-swan.app.mjs";

export default {
  key: "white-swan-get-referred-clients-info",
  name: "Get Referred Clients Info",
  description: "Retrieves information about clients referred from the user's White Swan account. [See the documentation](https://api.white_swan.com)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    whiteSwan,
    clientEmail: {
      propDefinition: [
        whiteSwan,
        "clientEmail",
      ],
    },
    referralStatus: {
      propDefinition: [
        whiteSwan,
        "referralStatus",
        (c) => ({
          clientEmail: c.clientEmail,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.whiteSwan.getClientInfo({
      data: {
        clientEmail: this.clientEmail,
        referralStatus: this.referralStatus,
      },
    });
    $.export("$summary", `Retrieved info for client ${this.clientEmail}`);
    return response;
  },
};
