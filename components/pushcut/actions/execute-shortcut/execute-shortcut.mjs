import pushcut from "../../pushcut.app.mjs";

export default {
  key: "pushcut-execute-shortcut",
  name: "Execute Shortcut",
  description: "Schedules an Automation Server action request for a shortcut. [See the documentation](https://www.pushcut.io/webapi)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pushcut,
    shortcut: {
      propDefinition: [
        pushcut,
        "shortcut",
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
        shortcut: this.shortcut,
        timeout: this.timeout,
        delay: this.delay,
      },
      $,
    });

    $.export("$summary", `Successfully executed shortcut ${this.shortcut}.`);

    return response;
  },
};
