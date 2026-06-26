import app from "../../mindbody.app.mjs";

export default {
  key: "mindbody-get-client-details",
  name: "Get Client Details",
  description:
    "Returns the complete profile for a client (member), including contact info, active memberships, purchased services, account balance, and visit history."
    + " Requires the client's numeric ID — use **Search Clients** first to look up the ID by name or email."
    + " [See the documentation](https://developers.mindbodyonline.com/ui/documentation/public-api#/http/api-endpoints/client/get-client-complete-info)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    clientId: {
      propDefinition: [
        app,
        "clientId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getClientCompleteInfo({
      $,
      params: {
        ClientId: this.clientId,
      },
    });
    const { Client: client } = response;
    const firstName = client.FirstName || "";
    const lastName = client.LastName || "";
    $.export("$summary", `Retrieved complete profile for ${(firstName + " " + lastName).trim()} (ID: ${this.clientId})`);
    return response;
  },
};
