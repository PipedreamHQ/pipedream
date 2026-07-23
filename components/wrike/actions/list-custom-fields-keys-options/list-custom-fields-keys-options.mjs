// x-pd-ai: optimized
import wrike from "../../wrike.app.mjs";
import {
  CUSTOM_FIELD_APPLICABLE_ENTITY_TYPE_OPTIONS,
  CUSTOM_FIELD_TYPE_OPTIONS,
  CUSTOM_FIELD_INHERITANCE_TYPE_OPTIONS,
  CUSTOM_FIELD_FIELD_OPTIONS,
} from "../../common/constants.mjs";
import { stringifyJson } from "../../common/utils.mjs";

export default {
  key: "wrike-list-custom-fields-keys-options",
  name: "List Custom Fields Keys Options",
  description: "Retrieves available custom fields so callers can copy field IDs into free-form customFields props in other actions. [See the documentation](https://developers.wrike.com/reference/getcustomfieldsempty)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    wrike,
    applicableEntityTypes: {
      type: "string[]",
      label: "Applicable Entity Types",
      description: "Filter by applicable entity types. One or more of: `User`, `WorkItem`. Defaults to `WorkItem`.",
      optional: true,
      options: CUSTOM_FIELD_APPLICABLE_ENTITY_TYPE_OPTIONS,
    },
    types: {
      type: "string[]",
      label: "Types",
      description: "Filter by custom field types. One or more of: `Multiple`, `Percentage`, `Text`, `Duration`, `CalculatedNumeric`, `Date`, `CalculatedDate`, `Numeric`, `Contacts`, `Checkbox`, `Currency`, `DropDown`, `LinkToDatabase`.",
      optional: true,
      options: CUSTOM_FIELD_TYPE_OPTIONS,
    },
    inheritanceTypes: {
      type: "string[]",
      label: "Inheritance Types",
      description: "Filter by custom field inheritance types. One or more of: `All`, `Tasks`, `Projects`, `Folders`.",
      optional: true,
      options: CUSTOM_FIELD_INHERITANCE_TYPE_OPTIONS,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Filter by custom field title.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional fields to include in the response. One or more of: `dataUsageStatistics`.",
      optional: true,
      options: CUSTOM_FIELD_FIELD_OPTIONS,
    },
  },
  async run({ $ }) {
    const params = {
      applicableEntityTypes: stringifyJson(this.applicableEntityTypes),
      types: stringifyJson(this.types),
      inheritanceTypes: stringifyJson(this.inheritanceTypes),
      title: this.title,
      fields: stringifyJson(this.fields),
    };

    const customFields = await this.wrike.listCustomFields({
      $,
      params,
    });
    $.export("$summary", `Successfully retrieved ${customFields.length} custom field${customFields.length === 1
      ? ""
      : "s"}`);
    return customFields;
  },
};
