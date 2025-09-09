import {
  convertFieldsToProps, getAdditionalFields,
} from "../../common/props-utils.mjs";
import salesforce from "../../salesforce_rest_api.app.mjs";
import { additionalFields } from "../common/base-create-update.mjs";

export default {
  key: "salesforce_rest_api-update-email-template",
  name: "Update Email Template",
  description: "Updates an email template. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_update_fields.htm)",
  version: "0.0.3",
  type: "action",
  props: {
    salesforce,
    recordId: {
      propDefinition: [
        salesforce,
        "recordId",
        () => ({
          objType: "EmailTemplate",
        }),
      ],
      description: "The email template to update.",
    },
    fieldsToUpdate: {
      propDefinition: [
        salesforce,
        "fieldsToUpdate",
        () => ({
          objType: "EmailTemplate",
        }),
      ],
      reloadProps: true,
    },
  },
  methods: {
    getAdditionalFields,
    convertFieldsToProps,
  },
  async additionalProps() {
    const { fieldsToUpdate } = this;
    const fields = await this.salesforce.getFieldsForObjectType("EmailTemplate");

    const selectedFields = fields.filter(({ name }) => fieldsToUpdate.includes(name));
    const selectedFieldProps = this.convertFieldsToProps(selectedFields);

    return {
      docsInfo: {
        type: "alert",
        alertType: "info",
        content: "[See the documentation](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_emailtemplate.htm) for information on all available fields.",
      },
      ...selectedFieldProps,
      additionalFields,
    };
  },
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      recordId,
      fieldsToUpdate,
      getAdditionalFields: getData,
      convertFieldsToProps,
      docsInfo,
      additionalFields,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await this.salesforce.updateRecord("EmailTemplate", {
      $,
      id: recordId,
      data: {
        ...data,
        ...getData(),
      },
    });
    $.export("$summary", `Successfully updated Email Template record (ID: ${recordId})`);
    return response;
  },
};
