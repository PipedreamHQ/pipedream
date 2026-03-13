import app from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-get-all-leads",
  name: "Get All Leads",
  description: "Get all leads from Pipedrive. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Leads#getLeads)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return. If not provided, all leads will be returned.",
      optional: true,
    },
    ownerId: {
      label: "Owner ID",
      description: "If supplied, only leads matching the given user will be returned. However, **Filter ID** takes precedence over **Owner ID** when supplied.",
      propDefinition: [
        app,
        "userId",
      ],
    },
    personId: {
      propDefinition: [
        app,
        "personId",
      ],
      description: "If supplied, only leads matching the given person will be returned. However, **Filter ID** takes precedence over **Person ID** when supplied.",
      optional: true,
    },
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
      description: "If supplied, only leads matching the given organization will be returned. However, **Filter ID** takes precedence over **Organization ID** when supplied.",
      optional: true,
    },
    filterId: {
      propDefinition: [
        app,
        "filterId",
      ],
      description: "The ID of the filter to use. Takes precedence over **Owner ID**, **Person ID**, and **Organization ID** when supplied.",
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "The field names and sorting mode separated by a comma (`field_name_1 ASC, field_name_2 DESC`). Only first-level field keys are supported (no nested keys). Valid fields: `id, title, owner_id, creator_id, was_seen, expected_close_date, next_activity_id, add_time, update_time`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      maxResults,
      ownerId,
      personId,
      organizationId,
      filterId,
      sort,
    } = this;

    const leads = await app.getPaginatedResources({
      fn: app.getLeads,
      params: {
        ...(ownerId && {
          owner_id: ownerId,
        }),
        ...(personId && {
          person_id: personId,
        }),
        ...(organizationId && {
          organization_id: organizationId,
        }),
        ...(filterId && {
          filter_id: filterId,
        }),
        ...(sort && {
          sort: sort,
        }),
      },
      max: maxResults,
    });

    $.export("$summary", `Successfully retrieved ${leads.length} lead${leads.length === 1
      ? ""
      : "s"}`);
    return leads;
  },
};
