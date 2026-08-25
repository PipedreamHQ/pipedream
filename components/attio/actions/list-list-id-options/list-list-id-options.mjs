// x-pd-ai: optimized
import attio from "../../attio.app.mjs";

export default {
  key: "attio-list-list-id-options",
  name: "List List ID Options",
  description: "List the workspace's lists as {value, label} options, to discover a **List ID** to pass to other actions (e.g. Delete List Entry). Use when you need a list's id and don't have it. Takes no input. Example: call with no arguments; returns e.g. `[{ \"value\": \"33ebdbe9-e529-47c9-b894-0ba25e9c15c0\", \"label\": \"Hot Leads\" }]`. [See the documentation](https://developers.attio.com/reference/get_v2-lists)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    attio,
  },
  async run({ $ }) {
    const options = await attio.propDefinitions.listId.options.call(this.attio, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
