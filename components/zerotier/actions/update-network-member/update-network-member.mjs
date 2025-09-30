import zerotier from "../../zerotier.app.mjs";

export default {
  key: "zerotier-update-network-member",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    const {
      memberHidden = null,
      memberName = null,
      memberDescription = null,
      memberAuthorized = null,
      memberActiveBridge = null,
      memberNoAutoAssignIps = null,
    } = this;
    const data = {
      hidden: memberHidden,
      name: memberName,
      description: memberDescription,
      config: {
        authorized: memberAuthorized,
        activeBridge: memberActiveBridge,
        noAutoAssignIps: memberNoAutoAssignIps,
      },
    };
    const response = await this.zerotier.updateNetworkMember({
      networkId: this.networkId,
      nodeId: this.nodeId,
      data: data,
      $,
    });

    $.export("$summary", `Successfully updated member "${this.nodeId}" on network "${this.networkId}"`);

    return response;
  },
};
