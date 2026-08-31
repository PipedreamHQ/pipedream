// x-pd-ai: optimized
import dataiku from "../../dataiku.app.mjs";

export default {
  key: "dataiku-list-datasets",
  name: "List Datasets",
  description: "List the datasets of a DSS project. Use this to discover a dataset's `name` — the identifier **Build Dataset** needs to build it — along with its `type` (e.g. `Filesystem`) and connection parameters. Use **List Projects** first if you do not know the project key. Requires the `READ_CONF` privilege on the project. [See the documentation](https://doc.dataiku.com/dss/api/15/rest/#datasets-datasets-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dataiku,
    projectKey: {
      propDefinition: [
        dataiku,
        "projectKey",
      ],
    },
    tags: {
      propDefinition: [
        dataiku,
        "tags",
      ],
    },
    foreign: {
      type: "boolean",
      label: "Include Foreign Datasets",
      description: "Set to `true` to also list datasets that belong to other projects but are exposed to this one. Defaults to `false`, which lists only the project's own datasets.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dataiku.listDatasets({
      $,
      projectKey: this.projectKey,
      params: {
        foreign: this.foreign,
        tags: this.tags?.length
          ? this.tags.join(",")
          : undefined,
      },
    });
    $.export("$summary", `Found ${response?.length} dataset(s) in project ${this.projectKey}`);
    return response;
  },
};
