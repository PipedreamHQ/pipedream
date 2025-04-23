import common from "../../common/base.mjs";

export default {
  ...common,
  key: "highlevel_oauth-update-record",
  name: "Update Record",
  description: "Updates a custom object record. [See the documentation](https://highlevel.stoplight.io/docs/integrations/b4c5fdbd3ec85-update-record)",
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
  },
  async additionalProps() {
    /*   const props = {};
    if (!this.schemaKey) {
      return props;
    }
    const { fields } = await this.app.getObject({
      schmeaKey: this.schemaKey,
    });
    for (const field of fields) {

    }
    return props; */
  },
  async run({ $ }) {
    const response = await this.app.updateRecord({
      $,
    });
    $.export("$summary", `Successfully updated record with ID: ${response.record.id}`);
    return response;
  },
};
