import microsoftGraphApi from "../../microsoft_graph_api.app.mjs";

export default {
  key: "microsoft_graph_api-get-manager",
  name: "Get Manager",
  description: "Get the user's manager information. Returns the user or organizational contact assigned as the user's manager. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-manager?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    microsoftGraphApi,
    userId: {
      type: "string",
      label: "User ID",
      description: "The user ID or user principal name. Leave empty to get the signed-in user's manager.",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const manager = await this.microsoftGraphApi.getManager({
        userId: this.userId || undefined,
      });

      const managerData = {
        id: manager.id,
        name: manager.displayName,
        email: manager.mail,
        jobTitle: manager.jobTitle,
        mobilePhone: manager.mobilePhone,
      };

      $.export("$summary", `Successfully retrieved manager: ${managerData.name || managerData.id}`);

      return managerData;
    } catch (error) {
      if (error?.response?.status === 404) {
        const noManagerData = {
          id: null,
          name: null,
          email: null,
          jobTitle: null,
          mobilePhone: null,
          message: "No manager is set for this user",
        };

        $.export("$summary", "No manager is set for this user");

        return noManagerData;
      }

      throw new Error(`Failed to get manager: ${error.message}`);
    }
  },
};
