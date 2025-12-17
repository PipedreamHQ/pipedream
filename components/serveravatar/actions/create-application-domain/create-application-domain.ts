import serverAvatarApp from "../../app/serveravatar.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Create Application Domain",
  description: "Add a new application domain for the application. [See the docs here](https://serveravatar.com/api-docs/endpoint/application-domain/create.html)",
  key: "serveravatar-create-application-domain",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    serverAvatarApp,
    serverId: {
      type: "integer",
      label: "Server Identifier",
      description: "The unique identifier of the server where the application is being hosted.",
      async options() {
        return this.serverAvatarApp.listAllServersOptions();
      },
    },
    applicationId: {
      type: "integer",
      label: "Application Identifier",
      description: "The unique identifier of the application.",
      async options({ prevContext }) {
        return this.serverAvatarApp.listApplicationsOptions(this.serverId, prevContext);
      },
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "The additional domain/subdomain for your application.\n\nEx `app.domain.com`",
    },
  },
  async run({ $ }) {
    const newAppDomainData = {
      server_id: this.serverId,
      application_id: this.applicationId,
      domain: this.domain,
    };
    const result = await this.serverAvatarApp.createApplicationDomain($, newAppDomainData);
    $.export("$summary", `Domain "${result.applicationDomain.domain}" has been successfully added.`);
    return result;
  },
});
