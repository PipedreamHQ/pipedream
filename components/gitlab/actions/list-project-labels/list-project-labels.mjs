import gitlab from "../../gitlab.app.mjs";
import {
  paginate,
  summarizeLabel,
} from "../../common/utils.mjs";

export default {
  key: "gitlab-list-project-labels",
  name: "List Project Labels",
  description: "List the labels defined in a project. Call this before applying labels with **Create Merge Request**: GitLab *creates* a label it does not recognize rather than rejecting it, so an invented or mis-cased name silently adds a new project label instead of applying the intended one. Each result's `name` is the value to pass back; the `description` is worth reading because label names are often abbreviations. Narrow a long list with **Search**. [See the documentation](https://docs.gitlab.com/api/labels/#list-labels)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    gitlab,
    projectId: {
      propDefinition: [
        gitlab,
        "projectIdStatic",
      ],
    },
    search: {
      type: "string",
      label: "Search",
      description: "Return only labels whose name or description contains this text (case-insensitive). Leave blank for every label in the project.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        gitlab,
        "maxResults",
      ],
      description: "Maximum number of labels to return in total, paginating as needed. Defaults to `100`. A project with a large label set may need more.",
    },
  },
  async run({ $ }) {
    const {
      items, truncated,
    } = await paginate({
      requestFn: (params) => this.gitlab.listLabels(this.projectId, {
        $,
        params,
      }),
      params: {
        search: this.search,
      },
      maxResults: this.maxResults,
    });

    const labels = items.map(summarizeLabel);

    const matching = this.search
      ? ` matching "${this.search}"`
      : "";
    const suffix = truncated
      ? " — capped at Max Results, there may be more"
      : "";
    $.export("$summary", `Retrieved ${labels.length} label${labels.length === 1
      ? ""
      : "s"} in ${this.projectId}${matching}${suffix}`);

    return labels;
  },
};
