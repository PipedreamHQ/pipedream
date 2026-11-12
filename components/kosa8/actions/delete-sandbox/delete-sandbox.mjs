import kosa8 from "../../kosa8.app.mjs";

export default {
  key: "kosa8-delete-sandbox",
  name: "Delete Sandbox",
  description: "Delete a kosa8 Cloud sandbox. [See the documentation](https://docs.kosa8.com/guides/cloud-openapi/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
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
    const response = await this.kosa8.deleteSandbox({
      $,
      sandboxId: this.sandboxId,
    });
    $.export("$summary", `Successfully deleted sandbox ${this.sandboxId}`);
    return response;
  },
};
