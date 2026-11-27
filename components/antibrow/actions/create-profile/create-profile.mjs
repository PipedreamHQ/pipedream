import antibrow from "../../antibrow.app.mjs";

export default {
  key: "antibrow-create-profile",
  name: "Create Profile",
  description: "Create a cloud-synced browser profile. The profile keeps its cookies, storage and fingerprint configuration between runs. [See the documentation](https://antibrow.com/docs/sdk)",
  version: "0.0.1",
  type: "action",
  props: {
    antibrow,
    name: {
      type: "string",
      label: "Name",
      description: "Name for the new profile, unique within your account",
    },
    proxyId: {
      propDefinition: [
        antibrow,
        "proxyId",
      ],
    },
  },
  async run({ $ }) {
    const {
      name, proxyId,
    } = this;
    const response = await this.antibrow.createProfile({
      $,
      data: {
        name,
        ...(proxyId
          ? {
            config: {
              proxy: {
                kind: "managed",
                managedProxyId: proxyId,
              },
            },
          }
          : {}),
      },
    });
    $.export("$summary", `Successfully created profile \`${name}\``);
    return response;
  },
};
