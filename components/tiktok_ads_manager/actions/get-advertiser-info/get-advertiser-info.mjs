import app from "../../tiktok_ads_manager.app.mjs";

export default {
  key: "tiktok_ads_manager-get-advertiser-info",
  name: "Get Advertiser Info",
  description:
    "Identity tool — call this first when a user references 'my account' or 'my campaigns'."
    + " Returns account details (name, currency, timezone, status) for the given advertiser ID."
    + " Find your advertiser ID in the TikTok Ads Manager URL after `aadvid=`."
    + " For account details, see [documentation](https://business-api.tiktok.com/portal/docs/get-authorized-ad-accounts/v1.3).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    advertiserId: {
      propDefinition: [
        app,
        "advertiserId",
      ],
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Fields to return. Leave blank for all fields. Supported values include: `name`, `currency`, `timezone`, `status`, `role`, `industry`, `balance`, `create_time`, `company`, `country`, `language`, `email`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      advertiser_ids: JSON.stringify([
        this.advertiserId,
      ]),
    };
    if (this.fields?.length) {
      params.fields = JSON.stringify(this.fields);
    }

    const response = await this.app.getAdvertiserInfo({
      $,
      params,
    });

    const details = response?.data?.list?.[0];
    const name = details?.name;
    $.export("$summary", `Retrieved info for advertiser ${this.advertiserId}${name
      ? `: ${name}`
      : ""}`);
    return response;
  },
};
