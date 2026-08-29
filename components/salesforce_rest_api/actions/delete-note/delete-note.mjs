// x-pd-ai: optimized
import salesforce from "../../salesforce_rest_api.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "salesforce_rest_api-delete-note",
  name: "Delete Note Or Content Note",
  description: "Delete a note or content note from a Salesforce record."
    + " This moves the note to the Recycle Bin, where it stays recoverable for up to 15 days - storage limits can purge it sooner."
    + " Use **Find Records** on `Note` or `ContentNote` to get the ID first."
    + " "
    + "[See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_sobject_retrieve_delete.htm)",
  version: "0.0.4",
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
      label: "Note ID Or Content Note ID",
      description: "The ID of the note or content note to delete",
      async options() {
        try {
          return await this.salesforce.listRecordOptions({
            objType: this.sobjectType,
            nameField: "Title",
          }) ?? [];
        } catch (error) {
          let errorMessage;
          try {
            errorMessage = JSON.parse(error.message);
          } catch {
            throw new ConfigurationError(`${error.message || error}`);
          }
          if (errorMessage?.length && errorMessage[0]?.message) {
            throw new ConfigurationError(`${errorMessage[0].message}`);
          }
          throw new ConfigurationError(error.message || String(error));
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
