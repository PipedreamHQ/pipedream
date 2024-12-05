import {
  convertFieldsToProps, getAdditionalFields,
} from "../../common/props-utils.mjs";
import salesforce from "../../salesforce_rest_api.app.mjs";
import { additionalFields } from "../common/base-create-update.mjs";

export default {
  key: "salesforce_rest_api-upsert-record",
  name: "Upsert Record",
  description: "Create or update a record of a given object. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_upsert.htm)",
  version: "0.0.1",
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
    externalIdFieldName: {
      type: "string",
      label: "External ID Field",
      description: "The name of the field used as the external ID. If a record exists with this field having the value specified in `External ID Value`, it will be updated, otherwise a new record will be created.",
    },
    externalIdValue: {
      type: "string",
      label: "External ID Value",
      description: "The value of the external ID field specified above. If a record exists with this value, it will be updated, otherwise a new record will be created.",
    }
  },
  methods: {
    getAdditionalFields,
    convertFieldsToProps,
  },
  async additionalProps() {
    const { objectType } = this;
    const fields = await this.salesforce.getFieldsForObjectType(objectType);

    const requiredFields = fields.filter((field) => {
      return field.createable && field.updateable && !field.nillable && !field.defaultedOnCreate;
    });

    const requiredFieldProps = this.convertFieldsToProps(requiredFields);

    return {
      docsInfo: {
        type: "alert",
        alertType: "info",
        content: `[See the documentation](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_${objectType.toLowerCase()}.htm) for information on all available fields.`,
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
      additionalFields,
      externalIdFieldName,
      externalIdValue,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.upsertRecord(objectType, {
      $,
      externalIdFieldName,
      externalIdValue,
      data: {
        ...data,
        ...getData(),
      },
    });
    $.export("$summary", `Successfully ${response.created ? 'created' : 'updated'} ${objectType} record (ID: ${response.id})`);
    return response;
  },
};
