import common from "../../common/base.mjs";
import { parseObjectEntries } from "../../common/utils.mjs";

export default {
  ...common,
  key: "highlevel_oauth-update-record",
  name: "Update Record",
  description: "Updates a custom object record. [See the documentation](https://highlevel.stoplight.io/docs/integrations/b4c5fdbd3ec85-update-record)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    schemaKey: {
      propDefinition: [
        common.props.app,
        "schemaKey",
      ],
    },
    recordId: {
      propDefinition: [
        common.props.app,
        "recordId",
        (c) => ({
          schemaKey: c.schemaKey,
        }),
      ],
    },
    ownerId: {
      propDefinition: [
        common.props.app,
        "userId",
      ],
      label: "Owner ID",
      description: "The ID of a user representing the owner of the record. Only supported for custom objects.",
      optional: true,
    },
    followerIds: {
      propDefinition: [
        common.props.app,
        "userId",
      ],
      type: "string[]",
      label: "Follower IDs",
      description: "An array of user IDs representing followers of the record. Only supported for custom objects",
      optional: true,
    },
    properties: {
      propDefinition: [
        common.props.app,
        "properties",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.updateRecord({
      $,
      schemaKey: this.schemaKey,
      recordId: this.recordId,
      data: {
        locationId: this.app.getLocationId(),
        owners: [
          this.ownerId,
        ],
        followers: this.followerIds,
        properties: parseObjectEntries(this.properties),
      },
    });
    $.export("$summary", `Successfully updated record with ID: ${response.record.id}`);
    return response;
  },
};
