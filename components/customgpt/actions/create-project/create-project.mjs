import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";
import customgpt from "../../customgpt.app.mjs";

export default {
  key: "customgpt-create-project",
  name: "Create Project (Agent)",
  description: "Create a new agent by importing data either from a sitemap or an uploaded file. The system will process the provided data and generate a new agent based on the imported or uploaded information. [See the documentation](https://docs.customgpt.ai/reference/post_api-v1-projects)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    customgpt,
    name: {
      type: "string",
      label: "Project Name",
      description: "The name of the project (agent)",
    },
    sitemapPath: {
      type: "string",
      label: "Sitemap Path",
      description: "The path to the sitemap path to import data from. This is an optional prop and can be omitted if you want to upload a file instead.",
      optional: true,
    },
    file: {
      type: "string",
      label: "File Path",
      description: "The path to the file saved to the `/tmp` directory (e.g. `tmp/example.pdf`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.sitemapPath && this.file) {
      $.export("$error", "You cannot use both sitemap path and file at the same time.");
      return;
    }

    const data = new FormData();
    data.append("project_name", this.name);
    if (this.sitemapPath) data.append("sitemap_path", this.sitemapPath);
    if (this.file) {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(this.file);
      data.append("file", stream, {
        filename: metadata.name,
        contentType: metadata.contentType,
        knownLength: metadata.size,
      });
    }

    const response = await this.customgpt.createProject({
      $,
      maxBodyLength: Infinity,
      data,
      headers: data.getHeaders(),
    });

    $.export(
      "$summary",
      `Successfully created project with ID: "${response.data.id}"`,
    );

    return response;
  },
};

