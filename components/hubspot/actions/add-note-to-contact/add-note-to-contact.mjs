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
    "Create a CRM note and associate it with a contact by contact ID. "
    + "Use this action for a simple note on one contact (flat configuration, friendly to AI tools). "
    + "For full control over all HubSpot note properties, use **Create Note** instead. "
    + "Do not use **Create Engagement** for this use case. "
    + "[See the documentation](https://developers.hubspot.com/docs/api/crm/engagements)",
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
      type: "string",
      label: "Contact ID",
      description: "HubSpot CRM contact record ID to attach the note to.",
    },
    noteBody: {
      type: "string",
      label: "Note Body",
      description: "The note text (maps to HubSpot property `hs_note_body`).",
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
