import { ConfigurationError } from "@pipedream/platform";
import { FIELD_TYPES } from "../../common/utils.mjs";
import dealcloud from "../../dealcloud.app.mjs";

const TRUTHY = [
  "true",
  "yes",
  "1",
];
const FALSY = [
  "false",
  "no",
  "0",
];

export default {
  props: {
    dealcloud,
    entryTypeId: {
      propDefinition: [
        dealcloud,
        "entryTypeId",
      ],
    },
    fields: {
      type: "object",
      label: "Fields",
      description: "The field values to write, as a map of field to value. Each key may be the field's API name, its display name, or its numeric field ID — for example `{ \"Name\": \"Acme Corp\", \"City\": \"Boston\" }`. Use **Get Records** on the same object to see the available fields. Multi-select fields accept either an array or a comma-separated string, boolean fields accept `true`/`false`, and calculated fields cannot be written to.",
    },
    ignoreNearDups: {
      propDefinition: [
        dealcloud,
        "ignoreNearDups",
      ],
    },
  },
  methods: {
    isUpdate() {
      return false;
    },
    getEntryId() {
      return -1;
    },
    // Identify a field the way a user would recognise it, since a key can be
    // supplied three different ways and the error needs to point at the right one.
    _describeField(field) {
      return `${field.name} (API name \`${field.apiName}\`, ID \`${field.id}\`)`;
    },
    // Coerce a value into the shape the cells API expects for that field's type.
    // Everything arrives as a string when the map is filled in by hand, so a
    // number field given "42" has to become 42 rather than "42".
    _coerceValue(field, value) {
      if (value === undefined || value === null || value === "") {
        return null;
      }

      if (field.isMultiSelect) {
        const list = Array.isArray(value)
          ? value
          : String(value).split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        return list.map((item) => this._coerceScalar(field, item));
      }

      if (Array.isArray(value)) {
        throw new ConfigurationError(`${this._describeField(field)} is not a multi-select field, so it takes a single value rather than a list.`);
      }

      return this._coerceScalar(field, value);
    },
    _coerceScalar(field, value) {
      switch (field.fieldType) {
      case FIELD_TYPES.NUMBER:
      case FIELD_TYPES.COUNTER: {
        const num = Number(value);
        if (!Number.isFinite(num)) {
          throw new ConfigurationError(`${this._describeField(field)} is a number field, but got \`${value}\`.`);
        }
        return num;
      }
      case FIELD_TYPES.BOOLEAN: {
        if (typeof value === "boolean") {
          return value;
        }
        const normalized = String(value).trim()
          .toLowerCase();
        if (TRUTHY.includes(normalized)) {
          return true;
        }
        if (FALSY.includes(normalized)) {
          return false;
        }
        throw new ConfigurationError(`${this._describeField(field)} is a boolean field, but got \`${value}\`. Use \`true\` or \`false\`.`);
      }
      default:
        return value;
      }
    },
    // Resolve every key in the `fields` map against the object's schema and build
    // the storeRequests payload. Matching is case-insensitive and accepts the
    // field's API name, display name, or numeric ID, because an agent filling
    // this in has only the description to go on.
    async buildRequestData() {
      const entries = Object.entries(this.fields ?? {});
      if (!entries.length) {
        throw new ConfigurationError("Fields is empty. Provide at least one field value to write.");
      }

      const schema = await this.dealcloud.getEntryTypeFields({
        entryTypeId: this.entryTypeId,
      });

      const byKey = new Map();
      for (const field of schema) {
        byKey.set(String(field.id), field);
        if (field.apiName) {
          byKey.set(field.apiName.toLowerCase(), field);
        }
        if (field.name) {
          byKey.set(field.name.toLowerCase(), field);
        }
      }

      const storeRequests = [];
      const seen = new Set();
      for (const [
        key,
        value,
      ] of entries) {
        const rawKey = String(key).trim();
        const field = byKey.get(rawKey.toLowerCase()) ?? byKey.get(rawKey);
        if (!field) {
          const known = schema.map(({ apiName }) => apiName).filter(Boolean)
            .join(", ");
          throw new ConfigurationError(`No field \`${key}\` on this object. Available fields: ${known}.`);
        }
        if (field.isCalculated) {
          throw new ConfigurationError(`${this._describeField(field)} is a calculated field and cannot be written to.`);
        }
        if (seen.has(field.id)) {
          throw new ConfigurationError(`${this._describeField(field)} was given more than once. Each field may only appear once in Fields.`);
        }
        seen.add(field.id);

        storeRequests.push({
          entryId: this.getEntryId(),
          fieldId: field.id,
          ignoreNearDups: this.ignoreNearDups,
          value: this._coerceValue(field, value),
        });
      }

      // Creating an entry has to satisfy the object's required fields. An update
      // only touches the fields it names, so the rest keep their stored values.
      if (!this.isUpdate()) {
        const missing = schema
          .filter((field) => field.isRequired && !field.isCalculated && !seen.has(field.id))
          .map((field) => field.apiName || field.name);
        if (missing.length) {
          throw new ConfigurationError(`Missing required field(s) for this object: ${missing.join(", ")}.`);
        }
      }

      return {
        storeRequests,
      };
    },
  },
};
