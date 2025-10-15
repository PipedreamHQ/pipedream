import {
  convertFieldsToProps, getAdditionalFields,
} from "../../common/props-utils.mjs";
import salesforce from "../../salesforce_rest_api.app.mjs";
import { additionalFields } from "../common/base-create-update.mjs";

export default {
  key: "salesforce_rest_api-create-record",
  name: "Create Record",
  description: "Create a record of a given object. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_sobject_create.htm)",
  version: "0.3.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
  },
  async additionalProps() {
    const { objectType } = this;
    const fields = await this.salesforce.getFieldsForObjectType(objectType);

    const requiredFields = fields.filter((field) => {
      return field.createable && !field.nillable && !field.defaultedOnCreate;
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
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.createRecord(objectType, {
      $,
      data: {
        ...data,
        ...getData(),
      },
    });
    $.export("$summary", `Successfully created ${objectType} record (ID: ${response.id})`);
    return response;
  },
};
