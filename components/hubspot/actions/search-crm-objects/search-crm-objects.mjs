// vandelay-test-dr
import hubspot from "../../hubspot.app.mjs";
import { parseObject } from "../../common/utils.mjs";
import { SEARCHABLE_OBJECT_TYPES } from "../../common/object-types.mjs";
import {
  DEFAULT_CONTACT_PROPERTIES,
  DEFAULT_COMPANY_PROPERTIES,
  DEFAULT_DEAL_PROPERTIES,
  DEFAULT_TICKET_PROPERTIES,
  DEFAULT_PRODUCT_PROPERTIES,
  DEFAULT_LINE_ITEM_PROPERTIES,
  DEFAULT_LEAD_PROPERTIES,
} from "../../common/constants.mjs";

const DEFAULT_PROPERTIES_MAP = {
  contact: DEFAULT_CONTACT_PROPERTIES,
  company: DEFAULT_COMPANY_PROPERTIES,
  deal: DEFAULT_DEAL_PROPERTIES,
  ticket: DEFAULT_TICKET_PROPERTIES,
  product: DEFAULT_PRODUCT_PROPERTIES,
  line_item: DEFAULT_LINE_ITEM_PROPERTIES,
  lead: DEFAULT_LEAD_PROPERTIES,
};

export default {
  key: "hubspot-search-crm-objects",
  name: "Search CRM Objects",
  description:
    "Search HubSpot CRM records (contacts, companies, deals, tickets, etc.) using text queries or filters."
    + " Returns matching records with properties, pagination, and total count."
    + " Use the `query` parameter for simple text search across default searchable fields"
    + " (contacts: firstname, lastname, email, phone, company;"
    + " companies: name, website, domain, phone;"
    + " deals: dealname, pipeline, dealstage, description)."
    + " Use `filterGroups` for advanced filtering with operators like EQ, NEQ, LT, GT, CONTAINS_TOKEN, IN, HAS_PROPERTY, etc."
    + " You can combine up to 5 filter groups (OR logic) with up to 6 filters each (AND logic within a group)."
    + " [See the documentation](https://developers.hubspot.com/docs/api/crm/search)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hubspot,
    objectType: {
      type: "string",
      label: "Object Type",
      description: "The CRM object type to search.",
      options: SEARCHABLE_OBJECT_TYPES,
    },
    query: {
      type: "string",
      label: "Query",
      description:
        "Text to search across default searchable properties of the object type."
        + " Uses simple text matching (contains)."
        + " Each object type has different searchable properties:"
        + " contacts (firstname, lastname, email, phone, company),"
        + " companies (name, website, domain, phone),"
        + " deals (dealname, pipeline, dealstage, description, dealtype),"
        + " tickets (subject, content, hs_pipeline_stage, hs_ticket_category, hs_ticket_id)."
        + " Max 200 characters.",
      optional: true,
    },
    filterGroups: {
      type: "string",
      label: "Filter Groups",
      description:
        "JSON array of filter groups for advanced filtering."
        + " Each group contains `filters` (AND logic within a group) and groups are OR'd together."
        + " Each filter has `propertyName`, `operator`, and `value`."
        + " Operators: EQ, NEQ, LT, LTE, GT, GTE, BETWEEN, IN, NOT_IN, HAS_PROPERTY, NOT_HAS_PROPERTY, CONTAINS_TOKEN, NOT_CONTAINS_TOKEN."
        + " Example: `[{\"filters\": [{\"propertyName\": \"lifecyclestage\", \"operator\": \"EQ\", \"value\": \"lead\"}]}]`."
        + " Max 5 groups, 6 filters per group, 18 total.",
      optional: true,
    },
    properties: {
      type: "string[]",
      label: "Properties",
      description:
        "Property names to include in results."
        + " If not specified, returns a default set of common properties for the object type."
        + " Use **Search Properties** to discover available property names.",
      optional: true,
    },
    sorts: {
      type: "string",
      label: "Sorts",
      description:
        "JSON array of sort rules. Only one sort rule is supported."
        + " Example: `[{\"propertyName\": \"createdate\", \"direction\": \"DESCENDING\"}]`."
        + " Default: sorted by createdate descending.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results per page. Max: 200, default: 100.",
      optional: true,
    },
    after: {
      type: "string",
      label: "After (Pagination Cursor)",
      description:
        "Paging cursor from a previous response for retrieving the next page of results.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};

    if (this.query) {
      data.query = this.query;
    }

    if (this.filterGroups) {
      data.filterGroups = parseObject(this.filterGroups);
    }

    if (this.properties?.length) {
      data.properties = this.properties;
    } else {
      data.properties = DEFAULT_PROPERTIES_MAP[this.objectType] || [];
    }

    if (this.sorts) {
      data.sorts = parseObject(this.sorts);
    } else {
      data.sorts = [
        {
          propertyName: "createdate",
          direction: "DESCENDING",
        },
      ];
    }

    if (this.limit) {
      data.limit = this.limit;
    }

    if (this.after) {
      data.after = this.after;
    }

    const response = await this.hubspot.searchCRM({
      $,
      object: this.objectType,
      data,
    });

    const count = response?.results?.length ?? 0;
    const total = response?.total ?? count;
    $.export(
      "$summary",
      `Found ${total} total result${total === 1
        ? ""
        : "s"}, returning ${count}`,
    );

    return response;
  },
};
