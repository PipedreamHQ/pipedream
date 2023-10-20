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
      reloadProps: true,
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
    itemId: {
      propDefinition: [
        app,
        "itemId",
        (configuredProps) => ({
          appId: configuredProps.appId,
        }),
      ],
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
    async getSpaceFields() {
      const apps = await this.app.getApps({
        spaceId: this.spaceId,
      });
      const spaceFields = [];
      for (const app of apps) {
        let { fields } = await this.app.getApp({
          appId: app.app_id,
        });
        fields = fields?.map((field) => ({
          ...field,
          app_label: app.url_label,
        })) || [];
        spaceFields.push(...fields);
      }
      return spaceFields;
    },
    getIfUpdate() {
      return false;
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.spaceId && isNaN(this.appId)) {
      return props;
    }
    const fields = !isNaN(this.appId)
      ? (await this.app.getApp({
        appId: this.appId,
      })).fields
      : await this.getSpaceFields();

    props.fieldIds = {
      type: "integer[]",
      label: "Fields",
      description: `Fields to ${this.getIfUpdate()
        ? "update"
        : "create"}`,
      options: fields.map(({
        field_id: value, label, app_label,
      }) => ({
        value,
        label: `${label}${app_label
          ? " - for use with App \"" + app_label + "\""
          : ""}`,
      })),
      reloadProps: true,
    };

    if (!this.fieldIds?.length) {
      return props;
    }

    for (const id of this.fieldIds) {
      const field = fields.find(({ field_id }) => field_id === id );
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
