import dockCerts from "../../dock_certs.app.mjs";

export default {
  key: "dock_certs-revoke-certificate",
  name: "Revoke Certificate",
  description: "Issue a new certificate to a specified user. [See the documentation](https://docs.api.dock.io/#revoke-unrevoke-credential)",
  version: "0.0.1",
  type: "action",
  props: {
    dockCerts,
    registry: {
      propDefinition: [
        dockCerts,
        "registry",
      ],
    },
    credentials: {
      propDefinition: [
        dockCerts,
        "credentials",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dockCerts.revokeCredential({
      registryId: this.registry,
      data: {
        action: "revoke",
        credentialIds: this.credentials,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully revoked certificate with ID ${response.id}`);
    }

    return response;
  },
};
