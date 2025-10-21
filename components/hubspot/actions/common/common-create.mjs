import {
  OBJECT_TYPE, HUBSPOT_OWNER,
} from "../../common/constants.mjs";
import appProp from "./common-app-prop.mjs";

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
    ...appProp.props,
  },
  methods: {
    getObjectType() {
      throw new Error("getObjectType is not implemented");
    },
    isRelevantProperty(property) {
      return !property.modificationMetadata?.readOnlyValue
        && (!property.hidden || property.name === "hs_email_direction") // hack - Hubspot's "hs_email_direction" property is hidden AND required
        && !property.label.includes("(legacy)")
        && (!property.options || property.options.length <= 500); // too many prop options cause the action to fail
    },
    makeLabelValueOptions(property) {
      const options = property.options
        .filter((o) => !o.hidden)
        .map(({
          label, value,
        }) => ({
          label,
          value,
        }))
        .filter(({ label }) => label);

      return options.length
        ? options
        : undefined;
    },
    async makePropDefinition(property, requiredProperties) {
      let type = "string";
      let options = this.makeLabelValueOptions(property);
      let useQuery;

      if (property.referencedObjectType) {
        const objectTypeName = this.hubspot.getObjectTypeName(property.referencedObjectType);
        options = getOptionsMethod(objectTypeName);
        useQuery = true;
      }

      if (property.name === "hs_timestamp") {
        property.description += ". Enter date in ISO-8601 format. Example: `2024-06-25T15:43:49.214Z`";
      }

      const objectType = this.hubspot.getObjectTypeName(this.getObjectType());
      let reloadProps;
      if (property.name === "hs_pipeline") {
        options = await this.hubspot.getPipelinesOptions(objectType);
        reloadProps = true;
      }
      if (property.name === "hs_pipeline_stage") {
        options = await this.hubspot.getPipelineStagesOptions(objectType, this.hs_pipeline);
      }
      if (property.name === "hs_all_assigned_business_unit_ids") {
        try {
          options = await this.hubspot.getBusinessUnitOptions();
        } catch {
          console.log("Could not load business units");
        }
        property.description += " For use with the Business Units Add-On.";
      }

      return {
        type,
        name: property.name,
        label: property.label,
        description: property.description,
        optional: !requiredProperties.includes(property.name),
        options,
        reloadProps,
        useQuery,
      };
    },
  },
  async additionalProps(existingProps) {
    const objectType = this.getObjectType();
    try {
      const schema = await this.hubspot.getSchema({
        objectType,
      });
      const { results: properties } = await this.hubspot.getProperties({
        objectType,
      });
      const relevantProperties = properties.filter(this.isRelevantProperty);

      const propDefinitions = [];
      if (this.propertyGroups && !relevantProperties?.length) {
        propDefinitions.push({
          type: "alert",
          alertType: "info",
          name: "infoAlert",
          content: `No writable properties found for Property Group(s): ${this.propertyGroups.join(", ")}`,
        });
      }

      for (const property of relevantProperties) {
        propDefinitions.push(await this.makePropDefinition(property, schema.requiredProperties));
      }

      if (existingProps.objectProperties) {
        existingProps.objectProperties.hidden = true;
        existingProps.objectProperties.optional = true;
      }
      if (existingProps.propertyGroups) {
        existingProps.propertyGroups.hidden = false;
      }

      return propDefinitions
        .reduce((props, {
          name, ...definition
        }) => {
          props[name] = definition;
          return props;
        }, {});
    } catch {
      if (existingProps.propertyGroups) {
        existingProps.propertyGroups.optional = true;
      }
      return {};
    }
  },
};
