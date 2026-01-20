import salesforce from "../../salesforce_rest_api.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "salesforce_rest_api-delete-note",
  name: "Delete Note",
  description: "Delete a note from a Salesforce record. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_sobject_retrieve_delete.htm)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    salesforce,
    sobjectType: {
      type: "string",
      label: "Note Type",
      description: "The type of note to delete",
      async options() {
        return [
          "Note",
          "ContentNote",
        ];
      },
    },
    recordId: {
      type: "string",
      label: "Note ID",
      description: "The ID of the note to delete",
      async options() {
        try {
          return await this.salesforce.listRecordOptions({
            objType: this.sobjectType,
            nameField: "Title",
          }) ?? [];
        } catch (error) {
          const errorMessage = JSON.parse(error.message);
          if (errorMessage.length && errorMessage[0].message) {
            throw new ConfigurationError(`${errorMessage[0].message}`);
          }
          throw new ConfigurationError(`${error}`);
        }
      },
    },
  },
  async run({ $ }) {
    const response = await this.salesforce.deleteRecord({
      $,
      sobjectType: this.sobjectType,
      recordId: this.recordId,
    });
    $.export("$summary", `Successfully deleted note (ID: ${this.recordId})`);
    return response;
  },
};
