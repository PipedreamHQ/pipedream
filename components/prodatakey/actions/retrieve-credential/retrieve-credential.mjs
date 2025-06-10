import prodatakey from "../../prodatakey.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "prodatakey-retrieve-credential",
  name: "Retrieve Credential",
  description: "Retrieve a specific credential using the system ID, holder ID, and credential ID. [See the documentation](https://developer.pdk.io/web/2.0/rest/credentials)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    prodatakey,
    systemId: {
      type: "string",
      label: "System ID",
    },
    holderId: {
      type: "string",
      label: "Holder ID",
    },
    credentialId: {
      propDefinition: [
        prodatakey,
        "credentialId",
        (c) => ({
          systemId: c.systemId,
          holderId: c.holderId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.prodatakey.retrieveCredential({
      systemId: this.systemId,
      holderId: this.holderId,
      credentialId: this.credentialId,
    });

    $.export("$summary", `Successfully retrieved credential with ID ${response.id}`);
    return response;
  },
};
