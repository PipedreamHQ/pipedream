import cloudflare from "../../cloudflare_api_key.app.mjs";
import consts from "../../common/constants.mjs";

export default {
  key: "cloudflare_api_key-create-ip-access-rule",
  name: "Create IP Access Rule",
  description: "Creates a new IP Access Rule for an account. The rule will apply to all zones in the account. [See the documentation](https://developers.cloudflare.com/api/node/resources/firewall/subresources/access_rules/methods/create/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cloudflare,
    accountIdentifier: {
      propDefinition: [
        cloudflare,
        "accountIdentifier",
      ],
      description: "Account that the IP access rule will apply to",
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "The action to apply to a matched request",
      options: consts.IP_ACCESS_RULE_MODE_OPTIONS,
    },
    target: {
      type: "string",
      label: "Target",
      description: "The configuration target. The configuration value must match the target type",
      options: consts.IP_ACCESS_RULE_TARGET_OPTIONS,
    },
    value: {
      type: "string",
      label: "Value",
      description: "The value to match the target type",
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "An informative summary of the rule, typically used as a reminder or explanation",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      cloudflare,
      accountIdentifier,
      mode,
      target,
      value,
      notes,
    } = this;

    const { result } = await cloudflare.createIpAccessRule({
      account_id: accountIdentifier,
      mode,
      notes,
      configuration: {
        target,
        value,
      },
    });
    $.export("$summary", `Created IP Access Rule with ID \`${result.id}\``);

    return result;
  },
};
