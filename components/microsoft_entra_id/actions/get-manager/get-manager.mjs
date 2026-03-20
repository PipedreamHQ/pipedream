import microsoftEntraId from "../../microsoft_entra_id.app.mjs";

export default {
  key: "microsoft_entra_id-get-manager",
  name: "Get Manager",
  description: "Get the user's manager information. Returns the user or organizational contact assigned as the user's manager. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-manager?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftEntraId,
    userId: {
      propDefinition: [
        microsoftEntraId,
        "userId",
      ],
      optional: true,
      description: "Leave empty to use the signed-in user.",
    },
  },
  async run({ $ }) {
    try {
      const manager = await this.microsoftEntraId.getManager({
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
      const status = error?.statusCode ?? error?.response?.status;
      if (status === 404) {
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
