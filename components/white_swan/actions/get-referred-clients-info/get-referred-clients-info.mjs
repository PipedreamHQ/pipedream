import whiteSwan from "../../white_swan.app.mjs";

export default {
  key: "white_swan-get-referred-clients-info",
  name: "Get Referred Clients Info",
  description: "Retrieves information about clients referred from the user's White Swan account. [See the documentation](https://docs.whiteswan.io/partner-knowledge-base/api-documentation/information-calls/referred-client-s)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    whiteSwan,
    clientEmail: {
      propDefinition: [
        whiteSwan,
        "clientEmail",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.whiteSwan.getClients({
      $,
      data: {
        client_email: this.clientEmail,
      },
    });
    $.export("$summary", `Retrieved info for client ${this.clientEmail}`);
    return response;
  },
};
