import salesforce_rest_api from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-salesforce-find-create-record",
  name: "Get Field Values from Object Record and optionally create one is none is found. ",
  description:
    "Finds a specified Salesforce record by a field. Optionally, create one if none is found. [API Doc](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_get_field_values.htm)",
  version: "0.0.1",
  type: "action",
  props: {
    salesforce_rest_api,
    sobject_name: {
      type: "string",
      label: "Object name",
      description:
        "Salesforce standard object type of the record to get field values from.",
    },
    sobject_id: {
      type: "string",
      label: "Object id",
      description:
        "Id of the Salesforce standard object to get field values from.",
    },
    sobject_fields: {
      type: "string[]",
      label: "Fields to get values from",
      description:
        "list of the Salesforce standard object's fields to get values from.",
    },
    createIfNotFound: {
      type: "boolean",
      label: "Create new object",
      description: "Create a new object if none is found",
      reloadProps: true,
    },
  },
  async additionalProps() {
    return {
      sobject: {
        type: "object",
        label: "Salesforce standard object",
        description: `Data of the Salesforce standard object record to create.
          Salesforce standard objects are described in [Standard Objects](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_list.htm) section of the [SOAP API Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_quickstart_intro.htm).`,
      },
    };
  },
  async run() {
    const {
      sobject_fields,
      sobject_name,
      sobject_id,
      sobject,
      createIfNotFound,
    } = this;
    let createData;
    try {
      createData = await this.salesforce_rest_api.getSObject(
        sobject_name,
        sobject_id,
        sobject_fields && { fields: sobject_fields.join(",") }
      );
    } catch (error) {}

    if (createIfNotFound && !createData) {
      const response = await this.salesforce_rest_api.createSObject(
        "Account",
        sobject
      );
      return response;
    }
    return createData;
  },
};
