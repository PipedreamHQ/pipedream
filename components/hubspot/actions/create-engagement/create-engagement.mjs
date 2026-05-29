import { ConfigurationError } from "@pipedream/platform";
import { ENGAGEMENT_TYPE_OPTIONS } from "../../common/constants.mjs";
import common from "../common/common-create.mjs";

const ENGAGEMENT_SLUGS = ENGAGEMENT_TYPE_OPTIONS.map((o) => o.value);

/** Map common labels / plural UI names to CRM v4 association-label `to`/`from` segments. */
function normalizeToObjectTypeForAssociationLabels(raw) {
  if (raw == null || String(raw).trim() === "") {
    return null;
  }
  const lower = String(raw).trim()
    .toLowerCase();
  const map = {
    contacts: "contact",
    contact: "contact",
    companies: "company",
    company: "company",
    deals: "deal",
    deal: "deal",
    tickets: "ticket",
    ticket: "ticket",
    line_items: "line_item",
    line_item: "line_item",
    products: "product",
    product: "product",
    quotes: "quote",
    quote: "quote",
    meetings: "meeting",
    meeting: "meeting",
    calls: "call",
    call: "call",
    emails: "email",
    email: "email",
    notes: "note",
    note: "note",
    tasks: "task",
    task: "task",
    leads: "lead",
    lead: "lead",
  };
  return map[lower] ?? String(raw).trim();
}

/**
 * Coerce engagement type to CRM v3 object slug (e.g. NOTE / note → notes).
 * Returns null if unrecognized.
 */
function normalizeEngagementType(raw) {
  if (raw == null || String(raw).trim() === "") {
    return null;
  }
  const s = String(raw).trim()
    .toLowerCase();

  const synonym = {
    note: "notes",
    notes: "notes",
    task: "tasks",
    tasks: "tasks",
    meeting: "meetings",
    meetings: "meetings",
    email: "emails",
    emails: "emails",
    call: "calls",
    calls: "calls",
  };

  const resolved = ENGAGEMENT_SLUGS.includes(s)
    ? s
    : synonym[s];

  return ENGAGEMENT_SLUGS.includes(resolved)
    ? resolved
    : null;
}

function findAssociationByTypeId(results, typeIdNum) {
  return results?.find((r) => Number(r.typeId) === Number(typeIdNum))
    ?? null;
}

export default {
  ...common,
  key: "hubspot-create-engagement",
  name: "Create Engagement",
  description:
    "Create a **task, meeting, email, call, or note** engagement with optional associations. "
    + "Set **Engagement Type** and pass engagement fields in **Object Properties** (HubSpot property names, e.g. `hs_note_body` for notes). "
    + "No `reloadProps` step and no **CONFIGURE_COMPONENT** requirement: association fields accept raw HubSpot IDs (use **Search CRM** or the Associations API to resolve `associationType` when needed). "
    + "For **only** a note on a contact by ID, **Add Note to Contact** (`hubspot-add-note-to-contact`) is still simpler. "
    + "[See the documentation](https://developers.hubspot.com/docs/api/crm/engagements)",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    engagementType: {
      type: "string",
      label: "Engagement Type",
      description:
        "One of: `notes`, `tasks`, `meetings`, `emails`, or `calls` (case-insensitive; `NOTE` / `note` map to `notes`). "
        + "Defines the CRM object type created and which properties belong in **Object Properties**. "
        + "For **note on contact by ID**, consider **Add Note to Contact** instead.",
      options: ENGAGEMENT_TYPE_OPTIONS,
    },
    toObjectType: {
      type: "string",
      label: "Associated Object Type",
      description:
        "HubSpot object type for the record to associate (e.g. `contact` or `contacts`, `companies`, `deals`, `tickets`). "
        + "**Required** when **Associated Object ID** and **Association Type ID** are set together. "
        + "Use the plural object name or your custom object’s API name / `fullyQualifiedName`.",
      optional: true,
    },
    toObjectId: {
      type: "string",
      label: "Associated Object ID",
      description:
        "Numeric record ID to associate (string is fine). Optional unless you set **Association Type ID**.",
      optional: true,
    },
    associationType: {
      type: "string",
      label: "Association Type ID",
      description:
        "HubSpot association `typeId` between this engagement type and **Associated Object Type** (integer as string or number). "
        + "Resolve via HubSpot associations API or **Search CRM**; omit if you are not associating a record.",
      optional: true,
    },
    objectProperties: {
      type: "object",
      label: "Object Properties",
      description:
        "Writable HubSpot properties for the engagement as key/value pairs (same shape as the CRM API `properties` object). "
        + "Example for a note: `{ \"hs_note_body\": \"Hello from Pipedream\" }`.",
    },
  },
  /**
   * Skip common-create’s schema-driven `additionalProps` so engagement fields stay in
   * `objectProperties` only — avoids `reloadProps` on `engagementType` and remote options
   * that require CONFIGURE_COMPONENT in MCP/agent hosts.
   */
  async additionalProps() {
    return {};
  },
  methods: {
    ...common.methods,
    getObjectType() {
      const normalized = normalizeEngagementType(this.engagementType);
      return normalized ?? this.engagementType;
    },
    isRelevantProperty(property) {
      return (
        common.methods.isRelevantProperty(property) &&
        !property.name.includes("hs_pipeline")
      );
    },
    createEngagement(objectType, properties, associations, $) {
      return this.hubspot.createObject({
        objectType,
        data: {
          properties,
          associations,
        },
        $,
      });
    },
  },
  async run({ $ }) {
    const {
      hubspot,
      /* eslint-disable no-unused-vars */
      engagementType,
      toObjectType,
      toObjectId,
      associationType,
      $db,
      objectProperties,
      ...otherProperties
    } = this;

    if (!engagementType) {
      throw new ConfigurationError(
        "`engagementType` is required (one of notes, tasks, meetings, emails, calls).",
      );
    }

    const objectType = normalizeEngagementType(engagementType);
    if (!objectType) {
      throw new ConfigurationError(
        "`engagementType` must resolve to one of: "
          + ENGAGEMENT_SLUGS.join(", ")
          + ". Common aliases map to these slugs (e.g. NOTE or note → notes). Got: "
          + JSON.stringify(String(engagementType).trim()),
      );
    }

    if ((toObjectId && !associationType) || (!toObjectId && associationType)) {
      throw new ConfigurationError(
        "Both **Associated Object ID** and **Association Type ID** must be set together, or both omitted.",
      );
    }

    if (toObjectId && associationType) {
      if (toObjectType == null || String(toObjectType).trim() === "") {
        throw new ConfigurationError(
          "**Associated Object Type** is required when **Associated Object ID** and **Association Type ID** are set "
            + "(needed to resolve the correct association label and category).",
        );
      }
    }

    const properties = objectProperties
      ? typeof objectProperties === "string"
        ? JSON.parse(objectProperties)
        : objectProperties
      : otherProperties;

    if (objectType === "notes" && properties && properties.hs_timestamp == null) {
      properties.hs_timestamp = new Date().toISOString();
    }

    const associationTypeId = associationType
      ? Number(associationType)
      : undefined;

    if (toObjectId && (Number.isNaN(associationTypeId) || associationTypeId <= 0)) {
      throw new ConfigurationError(
        "`associationType` must be a positive numeric HubSpot association type ID.",
      );
    }

    let associations;
    if (toObjectId) {
      const toLabelsType = normalizeToObjectTypeForAssociationLabels(toObjectType);
      if (!toLabelsType) {
        throw new ConfigurationError(
          "Could not normalize **Associated Object Type** for association lookup.",
        );
      }

      const { results = [] } = await this.hubspot.getAssociationTypes({
        $,
        fromObjectType: objectType,
        toObjectType: toLabelsType,
      });

      if (!results.length) {
        throw new ConfigurationError(
          `No association types were returned for ${objectType} → ${toLabelsType}. `
            + "Confirm CRM association settings/scopes or use **List Association Labels** for this pair.",
        );
      }

      const label = findAssociationByTypeId(results, associationTypeId);
      if (!label) {
        const available = results.map((r) => `${r.typeId} (${r.category})`).join("; ");
        throw new ConfigurationError(
          `No association label with typeId ${associationTypeId} for ${objectType} → ${toLabelsType}. `
            + `Available: ${available}`,
        );
      }

      associations = [
        {
          to: {
            id: toObjectId,
          },
          types: [
            {
              associationTypeId: label.typeId,
              associationCategory: label.category,
            },
          ],
        },
      ];
    }

    if (properties?.hs_task_reminders) {
      properties.hs_task_reminders = Date.parse(properties.hs_task_reminders);
    }

    const engagement = await this.createEngagement(
      objectType,
      properties,
      associations,
      $,
    );

    const objectName = hubspot.getObjectTypeName(objectType);
    const idPart = engagement?.id != null
      ? `${engagement.id}`
      : "unknown (missing id in HubSpot response — check portal scopes)";
    $.export("$summary", `Successfully created ${objectName} with ID ${idPart}`);

    return engagement;
  },
};
