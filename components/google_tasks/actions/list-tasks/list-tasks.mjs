import app from "../../google_tasks.app.mjs";

export default {
  key: "google_tasks-list-tasks",
  name: "list tasks",
  description: "list tasks [See the docs here]()",
  version: "0.0.1",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    $.export("$summary", "Action successfully performed");
  },
};
