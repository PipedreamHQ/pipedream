import serverAvatarApp from "../../app/serveravatar.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Create Application Domain",
  description: "Add a new application domain for the application. [See the docs here](https://serveravatar.com/api-docs/endpoint/application-domain/create.html)",
  key: "serveravatar-create-application-domain",
  version: "0.0.1",
  type: "action",
  props: {
    serverId: {
      type: "integer",
      label: "Server Id",
      description: "The unique identifier of the server where the application is being hosted.",
    },
    applicationId: {
      type: "integer",
      label: "Application Id",
      description: "The unique identifier of the application.",
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "The additional domain/subdomain for your application.\n\nEx `app.domain.com`",
    },
    serverAvatarApp,
  },
  async run({ $ }) {
    const newAppDomainData = {
      server_id: this.serverId,
      application_id: this.applicationId,
      domain: this.domain,
    }
    return this.serverAvatarApp.createApplicationDomain($, newAppDomainData);
  },
});
