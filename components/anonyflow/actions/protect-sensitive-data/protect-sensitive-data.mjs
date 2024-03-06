import anonyflow from "../../anonyflow.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "anonyflow-protect-sensitive-data",
  name: "Protect Sensitive Data",
  description: "Encrypts sensitive data using AnonyFlow encryption service with a unique private key managed by AnonyFlow. [See the documentation](https://anonyflow.com/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    anonyflow,
    sensitiveData: {
      propDefinition: [
        anonyflow,
        "sensitiveData",
      ],
    },
  },
  async run({ $ }) {
    const encryptedResponse = await this.anonyflow.encryptData({
      sensitiveData: this.sensitiveData,
    });
    $.export("$summary", "Sensitive data encrypted successfully");
    return encryptedResponse;
  },
};
