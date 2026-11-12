import kosa8 from "../../kosa8.app.mjs";

export default {
  key: "kosa8-wake-sandbox",
  name: "Wake Sandbox",
  description: "Restore a sleeping kosa8 Cloud sandbox now. [See the documentation](https://docs.kosa8.com/guides/cloud-openapi/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    kosa8,
    sandboxId: {
      propDefinition: [
        kosa8,
        "sandboxId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.kosa8.wakeSandbox({
      $,
      sandboxId: this.sandboxId,
    });
    $.export("$summary", `Successfully woke sandbox ${this.sandboxId}`);
    return response;
  },
};
