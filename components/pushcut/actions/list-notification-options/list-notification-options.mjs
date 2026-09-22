import pushcut from "../../pushcut.app.mjs";

export default {
  key: "pushcut-list-notification-options",
  name: "List Notification Options",
  description: "Retrieves available options for the Notification field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pushcut,
  },
  async run({ $ }) {
    const options = await pushcut.propDefinitions.notification.options.call(this.pushcut, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
