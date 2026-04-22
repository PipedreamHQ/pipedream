import { ConfigurationError } from "@pipedream/platform";
import hubspot from "../../hubspot.app.mjs";

/** HubSpot CRM v4 labels pair for note → contact (matches Create Note association wiring). */
const FROM_OBJECT_TYPE = "notes";
const TO_OBJECT_TYPE = "contact";

/**
 * Pick a single association type when HubSpot returns multiple labels.
 * Prefer HUBSPOT_DEFINED; tie-break by lowest typeId (stable default).
 */
function pickDefaultAssociationType(results) {
  if (!results?.length) {
    return null;
  }
  const hubspotDefined = results.filter(
    (r) => r.category === "HUBSPOT_DEFINED",
  );
  const pool = hubspotDefined.length
    ? hubspotDefined
    : results;
  return pool.slice().sort((a, b) => a.typeId - b.typeId)[0];
}

export default {
  key: "hubspot-add-note-to-contact",
  name: "Add Note to Contact",
  description:
    "MCP and AI agents: **Prefer this action** when the user wants to **leave a note on a HubSpot contact** using a **contact ID** and note text. "
    + "Exposes only `hubspot`, `contactId`, and `noteBody` (no engagement-type step, no `reloadProps`, no dynamic HubSpot schema fields). "
    + "Do **not** use **Create Engagement** for this workflow. "
    + "For every writable note property or non-contact associations, use **Create Note** instead. "
    + "[See the documentation](https://developers.hubspot.com/docs/api/crm/objects/notes)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hubspot,
    contactId: {
      propDefinition: [
        hubspot,
        "objectId",
        () => ({
          objectType: "contact",
        }),
      ],
      label: "Contact ID",
      description:
        "Select a contact or enter a **contact record ID**. Search uses HubSpot's contact list; if you only have an email, find the contact here or via **Search CRM Objects** first.",
    },
    noteBody: {
      type: "string",
      label: "Note Body",
      description:
        "Plain text of the note. Stored in HubSpot as property `hs_note_body`.",
    },
  },
  async run({ $ }) {
    const { results = [] } = await this.hubspot.getAssociationTypes({
      $,
      fromObjectType: FROM_OBJECT_TYPE,
      toObjectType: TO_OBJECT_TYPE,
    });

    const associationType = pickDefaultAssociationType(results);
    if (!associationType) {
      throw new ConfigurationError(
        "No note→contact association types were returned for this HubSpot account. "
          + "Confirm CRM association settings and scopes, or create the association using **List Association Labels** for "
          + `${FROM_OBJECT_TYPE} → ${TO_OBJECT_TYPE}.`,
      );
    }

    const response = await this.hubspot.createObject({
      objectType: FROM_OBJECT_TYPE,
      data: {
        properties: {
          hs_note_body: this.noteBody,
          hs_timestamp: new Date().toISOString(),
        },
        associations: [
          {
            to: {
              id: this.contactId,
            },
            types: [
              {
                associationTypeId: associationType.typeId,
                associationCategory: associationType.category,
              },
            ],
          },
        ],
      },
      $,
    });

    $.export(
      "$summary",
      `Successfully added a note to contact ${this.contactId}`,
    );

    return response;
  },
};
