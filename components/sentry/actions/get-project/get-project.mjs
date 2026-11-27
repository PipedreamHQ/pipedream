import app from "../../sentry.app.mjs";
import { DEFAULT_PROJECT_FIELDS } from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "sentry-get-project",
  name: "Get Project",
  description: "Retrieve the settings and metadata of one Sentry project: platform, creation date, status, teams, features and first-event time."
    + " Use when the user asks about a project itself. Use **List Organization Projects** first to find the project slug."
    + " For the issues in a project use **List Project Issues**; for its events use **List Project Events**."
    + " Returns only the selected fields (always includes `id`); by default: " + DEFAULT_PROJECT_FIELDS.join(", ") + "."
    + " Example: organizationIdOrSlug=\"acme-corp\", projectIdOrSlug=\"web-frontend\" → the project's platform, creation date and teams."
    + " [See the documentation](https://docs.sentry.io/api/projects/retrieve-a-project/)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    organizationIdOrSlug: {
      propDefinition: [
        app,
        "organizationIdOrSlug",
      ],
    },
    projectIdOrSlug: {
      propDefinition: [
        app,
        "projectIdOrSlug",
      ],
    },
    fields: {
      propDefinition: [
        app,
        "fieldsSelection",
      ],
      description: "Top-level project fields to return, e.g. `[\"id\",\"slug\",\"platform\",\"dateCreated\"]`. `id` is always included. Omit to get the default set listed in the action description.",
    },
  },
  async run({ $ }) {
    const project = await this.app.getProject(this.organizationIdOrSlug, this.projectIdOrSlug);
    const names = this.fields?.length
      ? this.fields
      : DEFAULT_PROJECT_FIELDS;
    $.export("$summary", `Retrieved project ${project.slug ?? this.projectIdOrSlug}`);
    return utils.pickFields(project, names);
  },
};
