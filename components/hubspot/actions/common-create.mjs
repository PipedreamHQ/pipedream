import hubspot from "../hubspot.app.mjs";
import {
  ObjectType, HUBSPOT_OWNER,
} from "../common/constants.mjs";

/**
 * Returns an options method for a CRM object type, intended to be used in
 * additionalProps
 *
 * @param {string} objectTypeName The object type name of the CRM object
 * @returns The options method
 */
function getOptionsMethod(objectTypeName) {
  switch (objectTypeName) {
  case HUBSPOT_OWNER:
    return (opts) => this.hubspot.getOwnersOptions(opts);
  case ObjectType.COMPANY:
    return (opts) => this.hubspot.getCompaniesOptions(opts);
  case ObjectType.CONTACT:
    return (opts) => this.hubspot.getContactsOptions(opts);
  case ObjectType.DEAL:
    return (opts) => this.hubspot.getDealsOptions(opts);
  case ObjectType.LINE_ITEM:
    return (opts) => this.hubspot.getLineItemsOptions(opts);
  case ObjectType.TICKET:
    return (opts) => this.hubspot.getTicketsOptions(opts);
  case ObjectType.QUOTE:
    return (opts) => this.hubspot.getQuotesOptions(opts);
  case ObjectType.CALL:
    return (opts) => this.hubspot.getCallsOptions(opts);
  case ObjectType.EMAIL:
    return (opts) => this.hubspot.getEmailsOptions(opts);
  case ObjectType.MEETING:
    return (opts) => this.hubspot.getMeetingsOptions(opts);
  case ObjectType.NOTE:
    return (opts) => this.hubspot.getNotesOptions(opts);
  case ObjectType.TASK:
    return (opts) => this.hubspot.getTasksOptions(opts);
  default:
    return undefined;
  }
}

export default {
  props: {
    hubspot,
  },
  methods: {
    getObjectType() {
      throw new Error("getObjectType is not implemented");
    },
    isRelevantProperty(property) {
      return !property.modificationMetadata?.readOnlyValue
        && !property.hidden
        && !property.label.includes("(legacy)")
        && (!property.options || property.options.length <= 500);
    },
    makePropDefinition(property) {
      let type = "string";
      if (property.fieldType === "checkbox") {
        type = "string[]";
      }
      let options = property.options?.length
        ? property.options?.filter((o) => !o.hidden)
          .map(({
            label, value,
          }) => ({
            label,
            value,
          }))
        : undefined;
      if (property.referencedObjectType) {
        const objectTypeName = this.hubspot.getObjectTypeName(property.referencedObjectType);
        options = getOptionsMethod(objectTypeName);
      }
      return {
        name: property.name,
        type,
        label: property.label,
        description: property.description,
        optional: true,
        options,
      };
    },
  },
  async additionalProps() {
    const { results: properties } = await this.hubspot.getProperties(this.getObjectType());
    return properties
      .filter(this.isRelevantProperty)
      .map(this.makePropDefinition)
      .reduce((props, {
        name, ...definition
      }) => {
        props[name] = definition;
        return props;
      }, {});
  },
  async run({ $ }) {
    const {
      hubspot,
      /* eslint-disable no-unused-vars */
      propertyGroups,
      $db,
      ...properties
    } = this;
    const objectType = this.getObjectType();

    const response = await hubspot.createObject(objectType, properties, $);

    const objectName = this.hubspot.getObjectTypeName(objectType);
    $.export("$summary", `Successfully created ${objectName}`);

    return response;
  },
};
