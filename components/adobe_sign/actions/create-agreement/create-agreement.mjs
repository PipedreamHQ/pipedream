import adobe_sign from "../../adobe_sign.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "adobe_sign-create-agreement",
  name: "Create Agreement",
  description: "Creates a new agreement and sends it to the specified email. [See the documentation](https://secure.na1.adobesign.com/public/docs/restapi/v6)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    adobe_sign,
    email: {
      propDefinition: [
        adobe_sign,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      participantSetsInfo: [
        {
          memberInfos: [
            {
              email: this.email,
            },
          ],
          order: 1,
          role: "SIGNER",
        },
      ],
    };

    const response = await this.adobe_sign.createAgreement({
      email: this.email,
      ...data,
    });

    $.export("$summary", `Created agreement and sent to ${this.email}`);
    return response;
  },
};
