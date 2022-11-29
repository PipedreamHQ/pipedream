import app from "../../podio.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  props: {
    app,
    orgId: {
      propDefinition: [
        app,
        "orgId",
      ],
    },
    spaceId: {
      propDefinition: [
        app,
        "spaceId",
        (configuredProps) => ({
          orgId: configuredProps.orgId,
        }),
      ],
    },
    appId: {
      propDefinition: [
        app,
        "appId",
        (configuredProps) => ({
          spaceId: configuredProps.spaceId,
        }),
      ],
      reloadProps: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "The tags to put on the item",
      optional: true,
    },
    reminder: {
      propDefinition: [
        app,
        "reminder",
      ],
    },
  },
  methods: {
    getFields() {
      const fields = {};
      for (let key of Object.keys(this)) {
        if (key.startsWith("field_")) {
          fields[key.split("_")[1]] = utils.extractPropValues(this[key]);
        }
      }
      return fields;
    },
    getIfUpdate() {
      return false;
    },
  },
  async additionalProps() {
    const props = {};
    const { fields } = await this.app.getApp({
      appId: this.appId,
    });
    for (const field of fields) {
      if (field.type != "calculation") {
        const newProp = {
          type: utils.getType(field),
          label: field.label,
          description: utils.getFieldDesc(field, this.getIfUpdate()),
          optional: this.getIfUpdate() ?
            true :
            !field.config.required,
        };
        if (field.type == "category") {
          newProp.options = field.config.settings.options.map(( option ) => {
            return {
              value: option.id.toString(),
              label: option.text,
            };
          });
        }
        props[`field_${field.field_id}`] = newProp;
      }
    }
    return props;
  },
};
