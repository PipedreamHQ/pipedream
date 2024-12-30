import contentstack from "../../contentstack.app.mjs";
import {
  parseArray, parseEntry,
} from "../../common/utils.mjs";

const createDocLink = "https://www.contentstack.com/docs/developers/apis/content-management-api#create-an-entry";
const updateDocLink = "https://www.contentstack.com/docs/developers/apis/content-management-api#update-an-entry";

export default {
  props: {
    contentstack,
    contentType: {
      propDefinition: [
        contentstack,
        "contentType",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    if (!this.contentType) {
      return {};
    }
    try {
      return await this.buildFieldProps(this.contentType);
    } catch {
      return {
        entryObj: {
          type: "object",
          label: "Entry",
          description: `Enter the entry object as JSON. [See the documentation](${this.isUpdate()
            ? updateDocLink
            : createDocLink}) for more information.`,
        },
      };
    }
  },
  methods: {
    getType(field) {
      if (field.data_type === "boolean") {
        return "boolean";
      }
      if (field.data_type === "json") {
        return "object";
      }
      return field.multiple
        ? "string[]"
        : "string";
    },
    isUpdate() {
      return false;
    },
    async getOptions(field) {
      if (field.data_type === "reference") {
        const referenceContentType = field.reference_to[0];
        const { entries } = await this.contentstack.listEntries({
          contentType: referenceContentType,
        });
        return entries?.map(({
          uid: value, title: label,
        }) => ({
          value,
          label: label ?? value,
        })) || [];
      }
      if (field.data_type === "file") {
        const { assets } = await this.contentstack.listAssets();
        return assets?.map(({
          uid: value, title: label,
        }) => ({
          value,
          label: label ?? value,
        })) || [];
      }
      return undefined;
    },
    async buildFieldProps(contentType) {
      const props = {};
      const { content_type: { schema } } = await this.contentstack.getContentType({
        contentType,
      });
      for (const field of schema) {
        props[field.uid] = {
          type: this.getType(field),
          label: field.display_name ?? field.uid,
          description: `Value of field ${field.display_name}. Field type: \`${field.data_type}\``,
          optional: this.isUpdate()
            ? true
            : !field.mandatory,
          options: await this.getOptions(field),
        };
      }
      return props;
    },
    async buildEntry() {
      if (this.entryObj) {
        return parseEntry(this.entryObj);
      }
      const { content_type: { schema } } = await this.contentstack.getContentType({
        contentType: this.contentType,
      });
      const entry = {};
      for (const field of schema) {
        if (!this[field.uid]) {
          continue;
        }
        if (field.data_type === "reference") {
          if (field.multiple) {
            const referenceField = parseArray(this[field.uid]);
            entry[field.uid] = referenceField?.map((value) => ({
              uid: value,
              _content_type_uid: field.reference_to[0],
            }));
          } else {
            entry[field.uid] = {
              uid: this[field.uid],
              _content_type_uid: field.reference_to[0],
            };
          }
          continue;
        }
        entry[field.uid] = this[field.uid];
      }
      return parseEntry(entry);
    },
  },
};
