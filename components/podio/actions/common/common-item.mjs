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
    fileIds: {
      type: "string[]",
      label: "File IDs",
      description: "Temporary files that have been uploaded and should be attached to this item",
      optional: true,
    },
  },
  methods: {
    async getFields() {
      const fields = {};
      for (let key of Object.keys(this)) {
        if (key.startsWith("field_")) {
          const fieldName = key.split("_")[1];
          const fieldId = await this.getFieldId(this.appId, fieldName);
          if (fieldId) {
            fields[fieldId] = utils.extractPropValues(this[key]);
          }
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
      return this.eliminateDuplicateFields(spaceFields);
    },
    eliminateDuplicateFields(fields) {
      const seen = new Set();
      return fields.filter((field) => {
        const isDuplicate = seen.has(field.label);
        seen.add(field.label);
        return !isDuplicate;
      });
    },
    async getFieldId(appId, fieldName) {
      const { fields } = await this.app.getApp({
        appId,
      });
      const field = fields.find(({ label }) => label === fieldName);
      if (!field) {
        console.log(`Field "${fieldName}" not found in app with ID ${appId}.`);
      }
      return field?.field_id;
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

    props.fieldNames = {
      type: "string[]",
      label: "Fields",
      description: `Fields to ${this.getIfUpdate()
        ? "update"
        : "create"}`,
      options: fields.map(({ label }) => label),
      reloadProps: true,
    };

    if (!this.fieldNames?.length) {
      return props;
    }

    for (const fieldName of this.fieldNames) {
      const field = fields.find(({ label }) => fieldName === label );
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
        props[`field_${field.label}`] = newProp;
      }
    }
    return props;
  },
};
