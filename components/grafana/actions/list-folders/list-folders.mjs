// vandelay-test-dr
import grafana from "../../grafana.app.mjs";

export default {
  key: "grafana-list-folders",
  name: "List Folders",
  description:
    "List all dashboard folders. Folders organize dashboards"
    + " into logical groups."
    + " Use folder UIDs with **Search Dashboards** to filter by"
    + " folder, or with **Save Dashboard** to place a dashboard"
    + " in a specific folder.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    grafana,
  },
  async run({ $ }) {
    const folders = await this.grafana.listFolders($);

    const count = Array.isArray(folders)
      ? folders.length
      : 0;

    $.export(
      "$summary",
      `Found ${count} folder${count === 1
        ? ""
        : "s"}`,
    );

    return folders;
  },
};
