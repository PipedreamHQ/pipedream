import rapidUrlIndexer from "../../rapid_url_indexer.app.mjs";

export default {
  key: "rapid_url_indexer-submit-project",
  name: "Submit Project",
  description: "Submit a new project for indexing. [See the documentation](https://rapidurlindexer.com/indexing-api/).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    rapidUrlIndexer,
    name: {
      type: "string",
      label: "Project Name",
      description: "The name of the project",
    },
    urls: {
      type: "string[]",
      label: "URLs",
      description: "An array of URLs to index. URLs must start with either “http://” or “https://”.",
    },
    notifyOnStatusChange: {
      type: "boolean",
      label: "Notify on Status Change",
      description: "If set to `true`, you will receive email notifications when the project status changes",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rapidUrlIndexer.submitProject({
      $,
      data: {
        project_name: this.name,
        urls: this.urls,
        notify_on_status_change: this.notifyOnStatusChange,
      },
    });
    $.export("$summary", `${response.message}`);
    return response;
  },
};
