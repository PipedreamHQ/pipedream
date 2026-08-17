// x-pd-ai: optimized
import superCarl from "../../super_carl.app.mjs";
import {
  applyFieldSelection,
  countSummary,
  parseObjectProp,
  requireQueryOrFilters,
  SEARCH_PEOPLE_SAFE_DEFAULT_FIELDS,
  stripSearchPeopleDebugFields,
} from "../../common/utils.mjs";

export default {
  key: "super_carl-search-people",
  name: "Search People",
  description: "Search people by role, company history, expertise, location, network relationship, or recent activity. Keep Preview enabled for fast counts and lightweight rows; disable Preview when you need full rows and Evidence Format, since Evidence Format is ignored during preview. Use **Search Companies** first when a named employer is ambiguous. Person rows carry deep connection/evidence metadata and can be large — pass Fields (e.g. `name`, `linkedin_profile_url`, `headline`) to keep the result small when you only need a few values. Always pass Fields when Preview is off and you set Relationship Detail to `intro_paths` or Evidence Format to anything other than `none`: that combination alone can exceed the response size limit even with a handful of rows, so don't wait for a truncated first call to add Fields. Read-only against Super Carl's shared external people database: there is no way to edit, hide, or delete a person's profile through this or any other Super Carl tool. [See the documentation](https://supercarl.ai/docs#endpoints-people-search)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    superCarl,
    query: {
      propDefinition: [
        superCarl,
        "query",
      ],
    },
    filters: {
      propDefinition: [
        superCarl,
        "filters",
      ],
    },
    preview: {
      type: "boolean",
      label: "Preview",
      description: "Use the fast preview route. Turn off for full rows with selected evidence detail.",
      optional: true,
      default: true,
    },
    limit: {
      propDefinition: [
        superCarl,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        superCarl,
        "offset",
      ],
    },
    evidenceFormat: {
      propDefinition: [
        superCarl,
        "evidenceFormat",
      ],
    },
    relationshipDetail: {
      propDefinition: [
        superCarl,
        "relationshipDetail",
      ],
    },
    delegateUserId: {
      propDefinition: [
        superCarl,
        "delegateUserId",
      ],
    },
    fields: {
      propDefinition: [
        superCarl,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const filters = parseObjectProp(this.filters, "Filters");
    requireQueryOrFilters({
      query: this.query,
      filters,
    });

    const response = await this.superCarl.searchPeople({
      $,
      preview: this.preview,
      data: {
        query: this.query,
        filters,
        limit: this.limit,
        offset: this.offset,
        evidence_format: this.preview
          ? undefined
          : this.evidenceFormat,
        relationship_detail: this.relationshipDetail,
        delegate_user_id: this.delegateUserId,
      },
    });

    $.export("$summary", countSummary({
      total: response?.pagination?.total,
      rows: response?.users,
      rowLabel: "people",
    }));

    const trimmed = stripSearchPeopleDebugFields(response);

    if (this.fields?.length) {
      return {
        ...trimmed,
        users: applyFieldSelection(trimmed?.users, this.fields),
      };
    }

    // Safety net: `preview: false` combined with relationship/evidence detail
    // carries enough per-row history to blow the MCP output ceiling on its
    // own (see SEARCH_PEOPLE_SAFE_DEFAULT_FIELDS), so a caller who didn't
    // pass `fields` here would otherwise get a truncated-to-file result and
    // see none of the data — not even the relationship info they asked for.
    const isVerboseRowMode = this.preview === false
      && ((this.relationshipDetail && this.relationshipDetail !== "none")
        || (this.evidenceFormat && this.evidenceFormat !== "none"));

    return isVerboseRowMode
      ? {
        ...trimmed,
        users: applyFieldSelection(trimmed?.users, SEARCH_PEOPLE_SAFE_DEFAULT_FIELDS),
      }
      : trimmed;
  },
};
