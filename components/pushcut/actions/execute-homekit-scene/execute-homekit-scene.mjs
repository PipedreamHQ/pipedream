import pushcut from "../../pushcut.app.mjs";

export default {
  key: "pushcut-execute-homekit-scene",
  name: "Execute Homekit Scene",
  description: "Schedules an Automation Server action request for a homekit scene. [See the documentation](https://www.pushcut.io/webapi)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pushcut,
    homekit: {
      propDefinition: [
        pushcut,
        "homekitScene",
      ],
    },
    timeout: {
      propDefinition: [
        pushcut,
        "timeout",
      ],
    },
    delay: {
      propDefinition: [
        pushcut,
        "delay",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pushcut.executeAction({
      data: {
        homekit: this.homekit,
        timeout: this.timeout,
        delay: this.delay,
      },
      $,
    });

    $.export("$summary", `Successfully executed homekit ${this.homekit}.`);

    return response;
  },
};
