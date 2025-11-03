import dockCerts from "../../dock_certs.app.mjs";

export default {
  key: "dock_certs-revoke-credential",
  name: "Revoke Credential",
  description: "Revoke an existing credential. [See the documentation](https://docs.api.dock.io/#revoke-unrevoke-credential)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dockCerts,
    credential: {
      propDefinition: [
        dockCerts,
        "credential",
        () => ({
          isRevoked: false,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { revocationRegistry } = await this.dockCerts.getCredential({
      credentialId: this.credential,
      $,
    });

    const response = await this.dockCerts.revokeCredential({
      registryId: revocationRegistry,
      data: {
        action: "revoke",
        credentialIds: [
          this.credential,
        ],
      },
      $,
    });

    if (response?.data?.revokeIds) {
      $.export("$summary", `Successfully revoked credential with ID ${response.data.revokeIds[0]}.`);
    }

    return response;
  },
};
