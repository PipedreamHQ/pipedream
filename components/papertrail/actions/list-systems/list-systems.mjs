import papertrail from "../../papertrail.app.mjs";

export default {
  key: "papertrail-list-systems",
  name: "List Systems",
  description: "List all log senders (systems) in the account. [See the documentation](https://www.papertrail.com/help/settings-api/#list-systems)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    papertrail,
  },
  async run({ $ }) {
    const systems = await this.papertrail.listSystems({
      $,
    });
    const count = Array.isArray(systems)
      ? systems.length
      : 0;
    $.export(
      "$summary",
      `Retrieved ${count} system${count === 1
        ? ""
        : "s"}`,
    );
    return systems;
  },
};
