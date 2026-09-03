import { ConfigurationError } from "@pipedream/platform";
import elasticSecurity from "../../elastic_security.app.mjs";
import {
  CASE_OWNER, DEFAULT_CASE_CONNECTOR,
} from "../../common/constants.mjs";

export default {
  key: "elastic_security-create-or-update-case",
  name: "Create or Update Case",
  description: "Create a new Elastic Security case, or update an existing one when `caseId` is provided, via POST /api/cases or PATCH /api/cases."
    + " Use this to open a new case, or to edit a case's title, description, severity, tags, category, assignees, or status."
    + " When `caseId` is provided, the tool fetches the case's current `version` internally before updating — never guess or supply a version yourself."
    + " Run **Find Cases** first to obtain a `caseId` for updates. Use **Add Case Comment** to attach comments instead of this tool."
    + " `title` and `description` are required when creating (no `caseId`)."
    + " Example: calling with `title: \"Perimeter Breach\"`, `description: \"...\"`, `severity: \"high\"` returns `{ id: \"a1c1...\", title: \"Perimeter Breach\", status: \"open\", version: \"Wzc1LDFd\", ... }`; calling again with that `caseId` and `status: \"closed\"` returns the same case updated."
    + " [See the create documentation](https://www.elastic.co/docs/api/doc/kibana/operation/operation-createcasedefaultspace) and the [update documentation](https://www.elastic.co/docs/api/doc/kibana/operation/operation-updatecasedefaultspace)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    elasticSecurity,
    caseId: {
      propDefinition: [
        elasticSecurity,
        "caseId",
      ],
      description: "The ID of an existing case to update. Omit this to create a new case instead. Run **Find Cases** first to obtain valid case IDs.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Case title (max 160 characters). Required when creating a new case (no `caseId`).",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Case description (max 30000 characters). Required when creating a new case (no `caseId`).",
      optional: true,
    },
    severity: {
      propDefinition: [
        elasticSecurity,
        "severity",
      ],
      description: "Case severity. One of: `low`, `medium`, `high`, `critical`.",
      optional: true,
    },
    status: {
      propDefinition: [
        elasticSecurity,
        "status",
      ],
      description: "New case status. Only applies when updating an existing case (`caseId` provided) — the create API has no status field.",
      optional: true,
    },
    tags: {
      propDefinition: [
        elasticSecurity,
        "tags",
      ],
      description: "Tags to apply to the case. Run **List Tags** first to reuse existing tags instead of creating near-duplicates. On update, this replaces the case's existing tag set entirely.",
      optional: true,
    },
    category: {
      type: "string",
      label: "Category",
      description: "Case category (max 50 characters).",
      optional: true,
    },
    assignees: {
      type: "string[]",
      label: "Assignees",
      description: "User profile IDs to assign to the case (max 10). Example: `[\"u_abc123\"]`. Run **Find Assignable Users** first to discover valid `profile_uid` values. On update, this replaces the case's existing assignee set entirely.",
      optional: true,
    },
    syncAlerts: {
      type: "boolean",
      label: "Sync Alerts",
      description: "Whether to sync the status of attached alerts with the case status. Defaults to `true` on create.",
      optional: true,
    },
  },
  async run({ $ }) {
    const assignees = this.assignees
      ? this.assignees.map((uid) => ({
        uid,
      }))
      : undefined;

    if (!this.caseId) {
      if (!this.title || !this.description) {
        throw new ConfigurationError("`title` and `description` are required when creating a new case (no `caseId` provided).");
      }
      const response = await this.elasticSecurity.createCase({
        $,
        data: {
          title: this.title,
          description: this.description,
          severity: this.severity,
          tags: this.tags ?? [],
          category: this.category,
          assignees,
          settings: {
            syncAlerts: this.syncAlerts ?? true,
          },
          connector: DEFAULT_CASE_CONNECTOR,
          owner: CASE_OWNER,
        },
      });
      $.export("$summary", `Created case "${response.title}" (${response.id})`);
      return response;
    }

    const current = await this.elasticSecurity.getCase({
      $,
      caseId: this.caseId,
    });
    const response = await this.elasticSecurity.updateCase({
      $,
      data: {
        cases: [
          {
            id: this.caseId,
            version: current.version,
            title: this.title,
            description: this.description,
            severity: this.severity,
            status: this.status,
            tags: this.tags,
            category: this.category,
            assignees,
            settings: this.syncAlerts === undefined
              ? undefined
              : {
                syncAlerts: this.syncAlerts,
              },
          },
        ],
      },
    });
    const [
      updated,
    ] = response;
    $.export("$summary", `Updated case "${updated.title}" (${updated.id})`);
    return updated;
  },
};
