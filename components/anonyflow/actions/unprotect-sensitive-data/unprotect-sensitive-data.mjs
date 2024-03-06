import anonyflow from "../../anonyflow.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "anonyflow-unprotect-sensitive-data",
  name: "Unprotect Sensitive Data",
  description: "Decrypts protected data using AnonyFlow decryption service with a unique private key, managed by AnonyFlow. [See the documentation](https://anonyflow.com/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    anonyflow,
    encryptedData: {
      propDefinition: [
        anonyflow,
        "encryptedData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.anonyflow.decryptData({
      encryptedData: this.encryptedData,
    });

    $.export("$summary", "Successfully decrypted the data");
    return response;
  },
};
