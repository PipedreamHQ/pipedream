// x-pd-ai: optimized
import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-get-user",
  name: "Get User",
  description: "Retrieve one Salesforce user by their record ID."
    + " Use **Get Current User** for the authenticated user instead of looking up an ID."
    + " Record owner fields such as `OwnerId` hold user IDs - pass one here to resolve it to a name and email."
    + " "
    + "[See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_get_field_values.htm)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    salesforce,
    userId: {
      propDefinition: [
        salesforce,
        "recordId",
        () => ({
          objType: "User",
        }),
      ],
    },
  },
  async run({ $ }) {
    const fields = (await this.salesforce.getFieldsForObjectType("User")).map(({ name }) => name);

    let query = `SELECT ${fields.join(", ")} FROM User WHERE Id = '${this.userId}'`;

    const { records } = await this.salesforce.query({
      $,
      query,
    });

    $.export("$summary", `Sucessfully retrieved user with ID ${this.userId}`);
    return records[0];
  },
};
