// x-pd-ai: optimized
import {
  convertFieldsToProps, getAdditionalFields,
} from "../../common/props-utils.mjs";
import salesforce from "../../salesforce_rest_api.app.mjs";
import { additionalFields } from "../common/base-create-update.mjs";

export default {
  key: "salesforce_rest_api-update-record",
  name: "Update Record",
  description: "Update a Salesforce record of any object type, choosing fields interactively."
    + " Prefer **Update CRM Record** in agent and API contexts - this action builds its field list dynamically, so the available inputs are not visible until an object type is chosen."
    + " Only the fields you supply change; everything else is left as-is."
    + " "
    + "[See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_update_fields.htm)",
  version: "0.3.8",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    salesforce,
    sobjectType: {
      propDefinition: [
        salesforce,
        "objectType",
      ],
      description: "The type of object to update a record of.",
      reloadProps: true,
    },
    recordId: {
      propDefinition: [
        salesforce,
        "recordId",
        (c) => ({
          objType: c.sobjectType,
        }),
      ],
      description:
        "The record to update.",
    },
    fieldsToUpdate: {
      propDefinition: [
        salesforce,
        "fieldsToUpdate",
        (c) => ({
          objType: c.sobjectType,
        }),
      ],
      optional: true,
      reloadProps: true,
    },
  },
  methods: {
    getAdditionalFields,
    convertFieldsToProps,
  },
  async additionalProps() {
    const {
      sobjectType, fieldsToUpdate,
    } = this;
    const fields = await this.salesforce.getFieldsForObjectType(sobjectType);

    // Only generate props for manually selected fields if any were selected
    let selectedFieldProps = {};
    if (fieldsToUpdate && fieldsToUpdate.length > 0) {
      const selectedFields = fields.filter(({ name }) => fieldsToUpdate.includes(name));
      selectedFieldProps = this.convertFieldsToProps(selectedFields);
    }

    return {
      docsInfo: {
        type: "alert",
        alertType: "info",
        content: `[See the documentation](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_${sobjectType.toLowerCase()}.htm) for information on all available fields.`,
      },
      ...selectedFieldProps,
      additionalFields,
    };
  },
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      sobjectType,
      recordId,
      fieldsToUpdate,
      getAdditionalFields: getData,
      convertFieldsToProps,
      docsInfo,
      additionalFields,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await this.salesforce.updateRecord(sobjectType, {
      $,
      id: recordId,
      data: {
        ...data,
        ...getData(),
      },
    });
    $.export("$summary", `Successfully updated ${sobjectType} record (ID: ${recordId})`);
    return response;
  },
};
