import kosa8 from "../../kosa8.app.mjs";

export default {
  key: "kosa8-sleep-sandbox",
  name: "Sleep Sandbox",
  description: "Snapshot a kosa8 Cloud sandbox and free its memory. It wakes on the next command or with **Wake Sandbox**. [See the documentation](https://docs.kosa8.com/guides/cloud-openapi/)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
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
    const response = await this.kosa8.sleepSandbox({
      $,
      sandboxId: this.sandboxId,
    });
    $.export("$summary", `Successfully put sandbox ${this.sandboxId} to sleep`);
    return response;
  },
};
