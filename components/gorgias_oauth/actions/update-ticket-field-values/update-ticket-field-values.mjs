import { ConfigurationError } from "@pipedream/platform";
import gorgias from "../../gorgias_oauth.app.mjs";
import constants from "../../common/constants.mjs";

// Prefix that turns a numeric custom field ID into a valid prop name. Prop names
// must be identifiers, so keying `additionalProps` by the raw ID renders nothing.
const CUSTOM_FIELD_PROP_PREFIX = "customField_";

// The custom fields belong to the account rather than to any one ticket, so the
// app prop is what `additionalProps` depends on. `propDefinition` matches the app
// by object identity, so both props must reference this same object.
const reloadingGorgias = {
  ...gorgias,
  reloadProps: true,
};

export default {
  key: "gorgias_oauth-update-ticket-field-values",
  name: "Update Ticket Field Values",
  description: "Set custom field values on a ticket. The connected account's ticket custom fields are exposed as individual optional props. Each field is written on its own request, so re-running after a failure is safe. [See the documentation](https://developers.gorgias.com/reference/update-ticket-custom-field)",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    gorgias: reloadingGorgias,
    ticketId: {
      propDefinition: [
        reloadingGorgias,
        "ticketId",
      ],
    },
  },
  methods: {
    getPropName(fieldId) {
      return `${CUSTOM_FIELD_PROP_PREFIX}${fieldId}`;
    },
    async getSettableCustomFields($) {
      const customFields = await this.gorgias.listAllCustomFields({
        $,
        objectType: constants.CUSTOM_FIELD_OBJECT_TYPE_TICKET,
      });
      return customFields.filter((field) => this.isSettableField(field));
    },
    isSettableField(field) {
      if (constants.UNSETTABLE_MANAGED_FIELD_TYPES.includes(field.managed_type)) {
        return false;
      }
      const {
        data_type: dataType,
        input_settings: inputSettings,
      } = field.definition;
      if (dataType === constants.CUSTOM_FIELD_DATA_TYPE_BOOLEAN) {
        return true;
      }
      // Gorgias rejects every value for a dropdown with no configured choices, so
      // surfacing one as a prop could only ever produce a failed run
      return inputSettings?.input_type !== constants.CUSTOM_FIELD_INPUT_TYPE_DROPDOWN
        || !!inputSettings.choices?.length;
    },
    /**
     * Validate and coerce one configured value. Every configured value is run
     * through this before the first request is sent, so one bad value cannot
     * leave the ticket half updated.
     */
    parseFieldValue(field, value) {
      const {
        data_type: dataType,
        input_settings: inputSettings,
      } = field.definition;

      // A boolean field rejects the string "true"; the platform already hands
      // back a real boolean, so it is passed straight through
      if (dataType === constants.CUSTOM_FIELD_DATA_TYPE_BOOLEAN) {
        return value;
      }

      if (dataType === constants.CUSTOM_FIELD_DATA_TYPE_NUMBER) {
        return this.parseNumberValue(field, value, inputSettings);
      }

      if (inputSettings?.input_type === constants.CUSTOM_FIELD_INPUT_TYPE_DROPDOWN) {
        const choices = (inputSettings.choices ?? []).map((choice) => `${choice}`);
        if (!choices.includes(`${value}`)) {
          throw new ConfigurationError(`Field "${field.label}" only accepts one of its ${choices.length} configured choices. Received: \`${value}\``);
        }
      }

      return value;
    },
    /**
     * Coerce a number field. Gorgias stores whatever JSON type it is sent, so a
     * numeric string would be persisted as a string; it also accepts decimals,
     * which is why the prop cannot be an `integer`. `min`/`max` are enforced by
     * the API too, but checking here keeps a bad bound from aborting the run
     * partway through.
     */
    parseNumberValue(field, value, inputSettings) {
      const parsed = Number(value);
      if (Number.isNaN(parsed)) {
        throw new ConfigurationError(`Field "${field.label}" expects a number. Received: \`${value}\``);
      }
      const bounds = this.getNumberBounds(inputSettings);
      if (bounds.min !== undefined && parsed < bounds.min) {
        throw new ConfigurationError(`Field "${field.label}" has a minimum of ${bounds.min}. Received: \`${value}\``);
      }
      if (bounds.max !== undefined && parsed > bounds.max) {
        throw new ConfigurationError(`Field "${field.label}" has a maximum of ${bounds.max}. Received: \`${value}\``);
      }
      return parsed;
    },
    getNumberBounds(inputSettings) {
      // Gorgias types `min`/`max` as `anyOf: [number, string]` and returns them as
      // strings, and `0` is a legitimate bound, so both need a presence check
      const toBound = (bound) => bound === undefined || bound === null || bound === ""
        ? undefined
        : Number(bound);
      return {
        min: toBound(inputSettings?.min),
        max: toBound(inputSettings?.max),
      };
    },
    getConfiguredValue(field) {
      const value = this[this.getPropName(field.id)];
      // `false` and `0` are valid values, so "not configured" cannot be a falsy
      // check. An empty string means the prop was revealed and left blank, which
      // Gorgias has a separate delete endpoint for.
      return value === undefined || value === ""
        ? undefined
        : value;
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.gorgias?.$auth?.oauth_access_token) {
      return props;
    }

    const customFields = await this.getSettableCustomFields();
    for (const field of customFields) {
      const {
        data_type: dataType,
        input_settings: inputSettings,
      } = field.definition;
      const isDropdown = inputSettings?.input_type
        === constants.CUSTOM_FIELD_INPUT_TYPE_DROPDOWN;
      const isNumber = dataType === constants.CUSTOM_FIELD_DATA_TYPE_NUMBER;
      const isBoolean = dataType === constants.CUSTOM_FIELD_DATA_TYPE_BOOLEAN;

      const bounds = isNumber
        ? this.getNumberBounds(inputSettings)
        : {};
      const constraints = [
        isNumber && "number",
        bounds.min !== undefined && `min ${bounds.min}`,
        bounds.max !== undefined && `max ${bounds.max}`,
      ].filter(Boolean);

      props[this.getPropName(field.id)] = {
        // Gorgias number fields accept decimals, so they cannot be `integer`
        type: isBoolean
          ? "boolean"
          : "string",
        label: field.label,
        description: [
          field.description || `Value for the \`${field.label}\` custom field`,
          constraints.length && `(${constraints.join(", ")})`,
        ].filter(Boolean).join(" "),
        optional: true,
        ...(isDropdown && !isBoolean && {
          options: inputSettings.choices.map((choice) => `${choice}`),
        }),
      };
    }
    return props;
  },
  async run({ $ }) {
    const customFields = await this.getSettableCustomFields($);

    const updates = [];
    for (const field of customFields) {
      const value = this.getConfiguredValue(field);
      if (value === undefined) {
        continue;
      }
      updates.push({
        field,
        value: this.parseFieldValue(field, value),
      });
    }

    if (!updates.length) {
      throw new ConfigurationError("No custom field values were provided. Expand the optional props to set at least one of this account's ticket custom fields.");
    }

    const response = [];
    for (const {
      field, value,
    } of updates) {
      response.push(await this.gorgias.updateTicketFieldValue({
        $,
        ticketId: this.ticketId,
        fieldId: field.id,
        value,
      }));
    }

    $.export("$summary", `Successfully updated ${response.length} field value${response.length === 1
      ? ""
      : "s"} on ticket ${this.ticketId}`);
    return response;
  },
};
