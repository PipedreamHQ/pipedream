import common from "../../common/base.mjs";

export default {
  ...common,
  key: "highlevel_oauth-create-record",
  name: "Create Record",
  description: "Creates a custom object record. [See the documentation](https://highlevel.stoplight.io/docs/integrations/47e05e18c5d41-create-record)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ...common.props,
    schemaKey: {
      propDefinition: [
        common.props.app,
        "schemaKey",
      ],
      reloadProps: true,
    },
    ownerId: {
      propDefinition: [
        common.props.app,
        "userId",
      ],
      label: "Owner ID",
      description: "The ID of a user representing the owner of the record",
      optional: true,
    },
    followerIds: {
      propDefinition: [
        common.props.app,
        "userId",
      ],
      type: "string[]",
      label: "Follower IDs",
      description: "An array of user IDs representing followers of the record",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    /*   if (!this.schemaKey) {
      return props;
    }
    const { fields } = await this.app.getObject({
      schmeaKey: this.schemaKey,
    });
    for (const field of fields) {

    } */
    return props;
  },
  async run({ $ }) {
    const response = await this.app.createRecord({
      $,
      schemaKey: this.schemaKey,
      data: {
        locationId: this.app.getLocationId(),
        owners: [
          this.ownerId,
        ],
        followers: this.followerIds,
        properties: {},
      },
    });
    $.export("$summary", `Successfully created record with ID: ${response.record.id}`);
    return response;
  },
};
