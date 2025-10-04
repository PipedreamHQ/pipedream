import app from "../../postgrid_verify.app.mjs";

export default {
  name: "Verify Address",
  description: "Verify, standardize, and correct an address written on a single line. Ensure that you add the ISO 2-letter country code to the end of the line for best results. [See the documentation](https://avdocs.postgrid.com/#1061f2ea-00ee-4977-99da-a54872de28c2).",
  key: "postgrid_verify-verify-address",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    address: {
      propDefinition: [
        app,
        "address",
      ],
      description: "The address you want to verify, written on a single line.",
    },
  },
  async run({ $ }) {
    const res = await this.app.verifyAddress({
      address: this.address,
    });

    if (res.data.status === "failed") {
      throw new Error(`Address verification failed. Please verify the written address. - ${JSON.stringify(res.data.errors)}`);
    }
    $.export("summary", `Address "${this.address}" successfully verified.`);
    return res;
  },
};
