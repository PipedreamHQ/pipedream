import kosa8 from "../../kosa8.app.mjs";

export default {
  key: "kosa8-get-sandbox",
  name: "Get Sandbox",
  description: "Get a kosa8 Cloud sandbox, including its state and cost so far. [See the documentation](https://docs.kosa8.com/guides/cloud-openapi/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.kosa8.getSandbox({
      $,
      sandboxId: this.sandboxId,
    });
    $.export("$summary", `Successfully retrieved sandbox ${this.sandboxId}`);
    return response;
  },
};
