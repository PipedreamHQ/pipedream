import zerotier from "../../zerotier.app.mjs";

export default {
  key: "zerotier-update-network-member",
  type: "action",
  version: "0.0.1",
  name: "Update Network Member",
  description:
    "Update a specific member (node) within a network. Can authorize, rename, hide a member (as well as other updates). [See docs here](https://docs.zerotier.com/central/v1/#operation/updateNetworkMember)",
  props: {
    zerotier,
    networkId: {
      propDefinition: [
        zerotier,
        "networkId",
      ],
    },
    nodeId: {
      propDefinition: [
        zerotier,
        "nodeId",
        (c) => ({
          networkId: c.networkId,
        }),
      ],
    },
    memberHidden: {
      propDefinition: [
        zerotier,
        "memberHidden",
      ],
    },
    memberName: {
      propDefinition: [
        zerotier,
        "memberName",
      ],
    },
    memberDescription: {
      propDefinition: [
        zerotier,
        "memberDescription",
      ],
    },
    memberAuthorized: {
      propDefinition: [
        zerotier,
        "memberAuthorized",
      ],
    },
    memberActiveBridge: {
      propDefinition: [
        zerotier,
        "memberActiveBridge",
      ],
    },
    memberNoAutoAssignIps: {
      propDefinition: [
        zerotier,
        "memberNoAutoAssignIps",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      hidden: this.memberHidden,
      name: this.memberName,
      description: this.memberDescription,
      config: {
        authorized: this.memberAuthorized,
        activeBridge: this.memberActiveBridge,
        noAutoAssignIps: this.memberNoAutoAssignIps,
      },
    };
    const response = await this.zerotier.updateNetworkMember({
      networkId: this.networkId,
      nodeId: this.nodeId,
      data: data,
      $,
    });

    $.export("$summary", `Successfully updated network "${this.networkId}" member "${this.nodeId}"`);

    return response;
  },
};
