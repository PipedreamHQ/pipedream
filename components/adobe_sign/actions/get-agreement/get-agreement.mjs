import adobe_sign from "../../adobe_sign.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "adobe_sign-get-agreement",
  name: "Get Agreement",
  description: "Retrieves the current status of a specified agreement. [See the documentation](https://opensource.adobe.com/acrobat-sign/developer_guide/index.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    adobe_sign,
    agreementId: {
      propDefinition: [
        adobe_sign,
        "agreementId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.adobe_sign.getAgreementStatus({
      agreementId: this.agreementId,
    });
    $.export("$summary", `Retrieved the status for agreement ID ${this.agreementId}`);
    return response;
  },
};
