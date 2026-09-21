import app from "../../writer.app.mjs";
import {
  APPLICATION_DEFAULT_FIELDS,
  MAX_RESULTS,
} from "../../common/constants.mjs";
import { pluck } from "../../common/utils.mjs";

export default {
  key: "writer-list-applications",
  name: "List Applications",
  description: "List the no-code applications (agents) in your Writer workspace. "
    + "Use this to see which saved agents exist and to resolve an agent's `id`, then call **Get Application** to inspect its inputs and **Run Application** to run it. "
    + "Handles an empty workspace gracefully (returns an empty list). "
    + `Auto-paginates up to ${MAX_RESULTS} applications. `
    + "Example: to list the content-generation agents and see just their names, call with `type=\"generation\"` and `fields=[\"name\"]` -> returns records like `{ id: \"...\", name: \"Blog Writer\" }`. "
    + "[See the documentation](https://dev.writer.com/api-reference/application-api/list-applications)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    type: {
      type: "string",
      label: "Application Type",
      description: "Filter by application type. `generation` for content-generation agents or `research` for research agents. Defaults to `generation` when omitted.",
      options: [
        "generation",
        "research",
      ],
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      optional: true,
      description: "Field names to return for each application (`id` is always included). "
        + `Defaults to: ${APPLICATION_DEFAULT_FIELDS.join(", ")}. `
        + "Available fields include `name`, `type`, `status`, `created_at`, `updated_at`. Pass only what you need to keep responses small.",
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const results = await this.app.paginate({
      $,
      resourceFn: this.app.listApplications,
      params: {
        type: this.type,
      },
      max: this.maxResults,
    });

    const fields = this.fields?.length
      ? this.fields
      : APPLICATION_DEFAULT_FIELDS;
    const output = results.map((item) => pluck(item, fields));

    $.export("$summary", `Found ${output.length} application${output.length === 1
      ? ""
      : "s"}`);
    return output;
  },
};
