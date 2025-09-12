import {
  convertFieldsToProps, getAdditionalFields,
} from "../../common/props-utils.mjs";
import salesforce from "../../salesforce_rest_api.app.mjs";
import { additionalFields } from "../common/base-create-update.mjs";

export default {
  key: "salesforce_rest_api-upsert-record",
  name: "Upsert Record",
  description: "Create or update a record of a given object. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_upsert.htm)",
  version: "0.0.4",
  type: "action",
  props: {
    salesforce,
    objectType: {
      propDefinition: [
        salesforce,
        "objectType",
      ],
      description: "The type of object to create a record of",
      reloadProps: true,
    },
  },
  methods: {
    getAdditionalFields,
    convertFieldsToProps,
    async upsertRecord(sobjectName, {
      externalIdFieldName, externalIdValue, ...args
    }) {
      const url = `${this.salesforce._sObjectTypeApiUrl(sobjectName)}/${externalIdFieldName}/${externalIdValue}`;
      return this.salesforce._makeRequest({
        url,
        method: "PATCH",
        ...args,
      });
    },
  },
  async additionalProps() {
    const { objectType } = this;
    const fields = await this.salesforce.getFieldsForObjectType(objectType);

    const requiredFields = fields.filter((field) => {
      return field.createable && field.updateable && !field.nillable && !field.defaultedOnCreate;
    });

    const externalIdFieldOptions = fields.filter((field) => field.externalId).map(({
      label, name,
    }) => ({
      label,
      value: name,
    }));

    const requiredFieldProps = this.convertFieldsToProps(requiredFields);

    return {
      docsInfo: {
        type: "alert",
        alertType: "info",
        content: `[See the documentation](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_${objectType.toLowerCase()}.htm) for information on all available fields.`,
      },
      externalIdFieldName: {
        type: "string",
        label: "External ID Field",
        description: "The field to use as the external ID to identify the record.",
        options: externalIdFieldOptions,
      },
      docsInfoExtId: {
        type: "alert",
        alertType: "info",
        content: "If you don't see any fields in the above list, you probably need to create one in Salesforce's Object Manager. Only a field marked as an external id field can be used to identify a record.",
      },
      externalIdValue: {
        type: "string",
        label: "External ID Value",
        description: "The value of the external ID field selected above. If a record with this value exists, it will be updated, otherwise a new one will be created.",
      },
      updateOnly: {
        type: "boolean",
        label: "Update Only",
        description: "If enabled, the action will only update an existing record, but not create one.",
        optional: true,
      },
      ...requiredFieldProps,
      additionalFields,
    };
  },
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      objectType,
      getAdditionalFields: getData,
      convertFieldsToProps,
      docsInfo,
      docsInfoExtId,
      additionalFields,
      externalIdFieldName,
      externalIdValue,
      updateOnly,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await this.upsertRecord(objectType, {
      $,
      externalIdFieldName,
      externalIdValue,
      params: {
        updateOnly,
      },
      data: {
        ...data,
        ...getData(),
      },
    });
    $.export("$summary", `Successfully ${response.created
      ? "created"
      : "updated"} ${objectType} record (ID: ${response.id})`);
    return response;
  },
};
