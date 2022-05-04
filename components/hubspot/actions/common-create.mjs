import hubspot from "../hubspot.app.mjs";
import {
  OBJECT_TYPE, HUBSPOT_OWNER,
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
  case OBJECT_TYPE.COMPANY:
    return (opts) => this.hubspot.getCompaniesOptions(opts);
  case OBJECT_TYPE.CONTACT:
    return (opts) => this.hubspot.getContactsOptions(opts);
  case OBJECT_TYPE.DEAL:
    return (opts) => this.hubspot.getDealsOptions(opts);
  case OBJECT_TYPE.LINE_ITEM:
    return (opts) => this.hubspot.getLineItemsOptions(opts);
  case OBJECT_TYPE.TICKET:
    return (opts) => this.hubspot.getTicketsOptions(opts);
  case OBJECT_TYPE.QUOTE:
    return (opts) => this.hubspot.getQuotesOptions(opts);
  case OBJECT_TYPE.CALL:
    return (opts) => this.hubspot.getCallsOptions(opts);
  case OBJECT_TYPE.EMAIL:
    return (opts) => this.hubspot.getEmailsOptions(opts);
  case OBJECT_TYPE.MEETING:
    return (opts) => this.hubspot.getMeetingsOptions(opts);
  case OBJECT_TYPE.NOTE:
    return (opts) => this.hubspot.getNotesOptions(opts);
  case OBJECT_TYPE.TASK:
    return (opts) => this.hubspot.getTasksOptions(opts);
  default:
    return () => [];
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
        && (!property.hidden || property.name === "hs_email_direction") // hack - Hubspot's "hs_email_direction" property is hidden AND required
        && !property.label.includes("(legacy)")
        && (!property.options || property.options.length <= 500) // too many prop options cause the action to fail
        && !(property.fieldType === "checkbox"); // checkbox (string[]) props must be semicolon separated strings
    },
    makePropDefinition(property) {
      let type = "string";
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
};
