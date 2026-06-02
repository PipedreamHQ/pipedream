import asana from "../../asana.app.mjs";
import common from "../common/common.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "asana-search-tasks",
  name: "Search Tasks",
  description: "Searches for a Task by name within a Project. [See the documentation](https://developers.asana.com/docs/get-multiple-tasks)",
  version: "0.4.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    project: {
      ...common.props.project,
      optional: true,
    },
    name: {
      label: "Name",
      description: "The task name to search for.",
      type: "string",
    },
    assignee: {
      label: "Assignee",
      description: "The assignee to filter tasks on",
      type: "string",
      optional: true,
      propDefinition: [
        asana,
        "users",
        ({ workspace }) => ({
          workspace,
        }),
      ],
    },
    section: {
      label: "Section",
      type: "string",
      description: "The section to filter tasks on. Must specify Project to list options.",
      optional: true,
      propDefinition: [
        asana,
        "sections",
        (c) => ({
          project: c.project,
        }),
      ],
    },
    completedSince: {
      label: "Completed Since",
      type: "string",
      description: "Only return tasks that are either incomplete or that have been completed since this time. ISO 8601 date string",
      optional: true,
    },
    modifiedSince: {
      label: "Modified Since",
      type: "string",
      description: "Only return tasks that have been modified since the given time. ISO 8601 date string",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        asana,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    if (!this.project && !this.section && !this.assignee) {
      throw new ConfigurationError("Must specify one of Project, Section, or Assignee");
    }

    if ((this.project || this.section) && this.assignee) {
      throw new ConfigurationError("Must specify only one of Assignee, Project, or Project + Section");
    }

    let hasMore, count = 0;
    const params = {
      completed_since: this.completedSince,
      modified_since: this.modifiedSince,
      limit: Math.min(this.maxResults, 100),
    };

    if (this.assignee) {
      params.assignee = this.assignee;
      params.workspace = this.workspace;
    } else if (this.section) {
      params.section = this.section;
    } else {
      params.project = this.project;
    }

    const results = [];

    do {
      const {
        data, next_page: next,
      } = await this.asana.getTasks({
        params,
        $,
      });

      hasMore = next;
      params.offset = next?.offset;

      if (data.length === 0) break;

      for (const task of data) {
        if (!task.name.includes(this.name)) continue;
        results.push(task);
        if (++count >= this.maxResults) {
          hasMore = false;
          break;
        }
      }
    } while (hasMore);

    $.export("$summary", `${results.length} task${results.length !== 1 ? "s" : ""} retrieved${results.length >= this.maxResults ? " (maxResults reached)" : ""}`);
    return results;
  },
};
