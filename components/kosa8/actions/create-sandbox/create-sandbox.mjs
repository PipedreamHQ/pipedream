import kosa8 from "../../kosa8.app.mjs";

export default {
  key: "kosa8-create-sandbox",
  name: "Create Sandbox",
  description: "Create a sealed microVM sandbox on kosa8 Cloud. [See the documentation](https://docs.kosa8.com/guides/cloud-openapi/)",
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
    template: {
      propDefinition: [
        kosa8,
        "template",
      ],
    },
    region: {
      type: "string",
      label: "Region",
      description: "The region to run the sandbox in, e.g. `eu-hel1`. Use **List Templates** to find the regions available for the chosen template (the template's `regions` array). Leave empty to let kosa8 choose.",
      optional: true,
    },
    sleepAfterSeconds: {
      type: "integer",
      label: "Sleep After (seconds)",
      description: "Idle seconds before the sandbox sleeps, e.g. `300` (5 minutes). `0` means never. Default is `300`.",
      optional: true,
      min: 0,
      max: 604800,
    },
    ttlSeconds: {
      type: "integer",
      label: "Time To Live (seconds)",
      description: "Delete the sandbox automatically this many seconds after it is created, e.g. `3600` (1 hour). Leave empty to keep it until you delete it.",
      optional: true,
      min: 60,
      max: 7776000,
    },
  },
  async run({ $ }) {
    const response = await this.kosa8.createSandbox({
      $,
      data: {
        template: this.template,
        region: this.region,
        sleep_after_s: this.sleepAfterSeconds,
        ttl_s: this.ttlSeconds,
      },
    });
    $.export("$summary", `Successfully created sandbox ${response.sandbox?.id}`);
    return response;
  },
};
