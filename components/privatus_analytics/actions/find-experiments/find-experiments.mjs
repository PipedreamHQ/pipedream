import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-find-experiments",
  name: "Find Experiments",
  description: "Lists the experiments of a site, or finds one by name, with its status. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": false,
    "readOnlyHint": true,
  },
  props: {
    app,
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Part of the experiment name, not case sensitive.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Only experiments with this status: draft, scheduled, running, paused, ended or all.",
      options: [
        "draft",
        "scheduled",
        "running",
        "paused",
        "ended",
        "all",
      ],
      default: "all",
      optional: true,
    },
    kind: {
      type: "string",
      label: "Kind",
      description: "Only page tests (page) or ad experiments (ad). Leave out for both.",
      options: [
        "page",
        "ad",
      ],
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    let items = await this.app.paginate({
      $,
      path: `/sites/${utils.segment(this.siteId)}/experiments.json`,
      params: utils.compact({
        status: this.status,
        kind: this.kind,
      }),
      maxResults: Infinity,
    });
    const wanted = (this.name || "").trim().toLowerCase();
    if (wanted) items = items.filter((experiment) => String(experiment.name).toLowerCase()
      .includes(wanted));
    items = items.slice(0, this.maxResults);
    $.export("$summary", `Found ${items.length} experiment${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
