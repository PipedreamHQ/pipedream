import app from "../../postgrid_verify.app.mjs";

export default {
  name: "Parse Address",
  description: "Break an address apart into its components. [See the documentation](https://avdocs.postgrid.com/#cd929454-227c-4a31-9a0b-7896099e52d1).",
  key: "postgrid_verify-parse-address",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    address: {
      propDefinition: [
        app,
        "address",
      ],
    },
  },
  async run({ $ }) {
    const res = await this.app.parseAddress({
      address: this.address,
    });

    $.export("summary", `Address "${this.address}" successfully parsed.`);
    return res;
  },
};
