import contentSnare from "../../content_snare.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "content_snare-create-client",
  name: "Create Client",
  description: "Creates a new client on Content Snare. Requires at least one company name, the client's email, and full name. Other attributes such as phone are optional. [See the documentation](https://api.contentsnare.com/partner_api/v1/documentation)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    contentSnare,
    companyName: {
      propDefinition: [
        contentSnare,
        "companyName",
      ],
    },
    clientEmail: {
      propDefinition: [
        contentSnare,
        "clientEmail",
      ],
    },
    clientFullName: {
      propDefinition: [
        contentSnare,
        "clientFullName",
      ],
    },
    clientPhone: {
      propDefinition: [
        contentSnare,
        "clientPhone",
      ],
      optional: true,
    },
    additionalProps: {
      propDefinition: [
        contentSnare,
        "additionalProps",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const clientData = {
      companyName: this.companyName,
      clientEmail: this.clientEmail,
      clientFullName: this.clientFullName,
      ...(this.clientPhone && { clientPhone: this.clientPhone }),
      ...(this.additionalProps && { ...this.additionalProps }),
    };

    const response = await this.contentSnare.generateClient(clientData);

    $.export("$summary", `Successfully created client: ${this.clientFullName}`);
    return response;
  },
};