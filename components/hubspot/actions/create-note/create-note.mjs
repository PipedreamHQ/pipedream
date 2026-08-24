// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import { ASSOCIATION_CATEGORY } from "../../common/constants.mjs";
import common from "../common/common-create.mjs";
import { parseObjectProperties } from "../../common/utils.mjs";

export default {
  ...common,
  key: "hubspot-create-note",
  name: "Create Note",
  description:
    "Create a HubSpot CRM **note**. Put the note text in **Object Properties** as `hs_note_body` (e.g. `{ \"hs_note_body\": \"Reviewed the Q3 numbers\" }`). "
    + "For **only** a contact ID + note body, **Add Note to Contact** is simpler. "
    + "To associate the note with another record, supply `toObjectType`, `toObjectId`, and `associationType` together. "
    + "[See the documentation](https://developers.hubspot.com/docs/api/crm/objects/notes)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    toObjectType: {
      propDefinition: [
        common.props.hubspot,
        "objectType",
      ],
      label: "Associated Object Type",
      description:
        "Type of CRM object to associate this note with (e.g. contact). Set before `toObjectId` / `associationType`.",
      optional: true,
    },
    toObjectId: {
      propDefinition: [
        common.props.hubspot,
        "objectId",
        (c) => ({
          objectType: c.toObjectType,
        }),
      ],
      label: "Associated Object",
      description:
        "Record ID to associate. MCP: use **CONFIGURE_COMPONENT** with `propName` `toObjectId` after `toObjectType` is set to load options.",
      optional: true,
    },
    associationType: {
      propDefinition: [
        common.props.hubspot,
        "associationType",
        (c) => ({
          fromObjectType: "notes",
          toObjectType: c.toObjectType,
        }),
      ],
      description:
        "Association type ID for note → other object. Required with `toObjectId`.",
      optional: true,
    },
    objectProperties: {
      type: "object",
      label: "Object Properties",
      description:
        "The note properties as a JSON object. At minimum set `hs_note_body`. "
        + "Example: `{ \"hs_note_body\": \"Followed up with the customer\" }`.",
    },
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return "notes";
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
      /* eslint-disable no-unused-vars */
      hubspot,
      toObjectType,
      toObjectId,
      associationType,
      $db,
      objectProperties,
      ...otherProperties
    } = this;

    if ((toObjectId && !associationType) || (!toObjectId && associationType)) {
      throw new ConfigurationError(
        "Both `toObjectId` and `associationType` must be entered",
      );
    }

    const properties = objectProperties
      ? parseObjectProperties(objectProperties)
      : otherProperties;

    const objectType = this.getObjectType();

    // HubSpot notes require hs_timestamp; default it so an agent doesn't have to know that.
    if (properties.hs_timestamp == null) {
      properties.hs_timestamp = new Date().toISOString();
    }

    const associations = toObjectId
      ? [
        {
          to: {
            id: toObjectId,
          },
          types: [
            {
              associationTypeId: associationType,
              associationCategory: ASSOCIATION_CATEGORY.HUBSPOT_DEFINED,
            },
          ],
        },
      ]
      : undefined;

    if (properties.hs_task_reminders) {
      properties.hs_task_reminders = Date.parse(properties.hs_task_reminders);
    }

    const engagement = await this.createEngagement(
      objectType,
      properties,
      associations,
      $,
    );

    $.export("$summary", "Successfully created note");

    return engagement;
  },
};
