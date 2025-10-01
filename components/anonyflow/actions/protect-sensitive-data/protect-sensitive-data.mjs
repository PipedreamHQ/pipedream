import app from "../../anonyflow.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "anonyflow-protect-sensitive-data",
  name: "Protect Sensitive Data",
  description: "Encrypts sensitive data using AnonyFlow encryption service with a unique private key managed by AnonyFlow. [See the documentation](https://anonyflow.com/api)",
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
    anonyPacket(args = {}) {
      return this.app.post({
        path: "/anony-packet",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      anonyPacket,
      data,
      keys,
    } = this;

    const response = await anonyPacket({
      $,
      data: {
        data: utils.valueToObject(data),
        keys,
      },
    });
    $.export("$summary", `Successfully protected the data with status \`${response.status}\``);
    return response;
  },
};
