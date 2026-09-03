import jira_service_desk from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-list-cloud-id-options",
  name: "List Cloud ID Options",
  description: "Lists the Atlassian sites you can raise requests on, as `{label, value}` options, to discover the `cloudId` every other Jira Service Desk tool needs. Takes no input beyond the account. Example: returns `[{ \"label\": \"acme\", \"value\": \"822faf0d-5427-420e-9016-999d3dc76918\" }]`. Use **List Sites** instead if you want the full site records. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/#3-1-get-the-cloudid-for-your-site)",
  version: "0.1.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    jira_service_desk,
  },
  async run({ $ }) {
    const sites = await this.jira_service_desk.getSites({
      $,
    });
    const options = sites
      ?.filter?.(({ scopes }) => scopes?.includes("write:servicedesk-request"))
      ?.map?.(({
        id, name,
      }) => ({
        label: name,
        value: id,
      })) ?? [];
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
