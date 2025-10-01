import app from "../../anonyflow.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "anonyflow-unprotect-sensitive-data",
  name: "Unprotect Sensitive Data",
  description: "Decrypts protected data using AnonyFlow decryption service with a unique private key, managed by AnonyFlow. [See the documentation](https://anonyflow.com/api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    data: {
      propDefinition: [
        app,
        "data",
      ],
    },
    keys: {
      propDefinition: [
        app,
        "keys",
      ],
    },
  },
  methods: {
    deanonyPacket(args = {}) {
      return this.app.post({
        path: "/deanony-packet",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      deanonyPacket,
      data,
      keys,
    } = this;

    const response = await deanonyPacket({
      $,
      data: {
        data: utils.valueToObject(data),
        keys,
      },
    });
    $.export("$summary", `Successfully unprotected the data with status \`${response.status}\``);
    return response;
  },
};
