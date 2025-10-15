import rapidUrlIndexer from "../../rapid_url_indexer.app.mjs";
import fs from "fs";

export default {
  key: "rapid_url_indexer-download-project-report",
  name: "Download Project Report",
  description: "Download the report for a specific project. [See the documentation](https://rapidurlindexer.com/indexing-api/).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rapidUrlIndexer,
    projectId: {
      propDefinition: [
        rapidUrlIndexer,
        "projectId",
      ],
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "A filename to save the report as in the `/tmp` directory. Include the `.csv` extension",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const response = await this.rapidUrlIndexer.downloadProjectReport({
      $,
      projectId: this.projectId,
    });

    const filepath = this.filename.includes("/tmp")
      ? this.filename
      : `/tmp/${this.filename}`;

    fs.writeFileSync(filepath, response);

    $.export("$summary", `Successfully downloaded report for Project with ID ${this.projectId}`);
    return filepath;
  },
};
