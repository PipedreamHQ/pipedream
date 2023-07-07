import { defineAction } from "@pipedream/types";
import app from "../../app/facebook_conversions.app";

const DOCS_LINK =
  "https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/app-data";

export default defineAction({
  name: "Build App Data",
  description: `Construct the App Data object to send in an event. [See the documentation](${DOCS_LINK})`,
  key: "facebook_conversions-build-app-data",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    advertiserTrackingEnabled: {
      type: "boolean",
      label: "Advertiser Tracking Enabled",
      description:
        "**Required for app events.** Use this field to specify ATT permission on an iOS 14.5+ device. Set to `false` for disabled or `true` for enabled.",
      optional: true,
    },
    applicationTrackingEnabled: {
      type: "boolean",
      label: "Application Tracking Enabled",
      description:
        "**Required for app events.** A person can choose to enable ad tracking on an app level. Your SDK should allow an app developer to put an opt-out setting into their app. Use this field to specify the person's choice. Set to `false` for disabled or `true` for enabled.",
      optional: true,
    },
    extinfo: {
      type: "string[]",
      label: "Extended Info",
      description:
        "**Required for app events.** Extended device information, such as screen width and height. All values are required and must be in the specified order - [see the documentation here for more details.](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/app-data#extinfo)",
      optional: true,
    },
    campaignIds: {
      type: "string",
      label: "Campaign IDs",
      description:
        "An encrypted string and non-user metadata appended to the outbound URL (for example, ad_destination_url) or deep link (for App Aggregated Event Manager) when a user clicked on a link from Facebook. Graph API definition: Parameter passed via the deep link for Mobile App Engagement campaigns.",
      optional: true,
    },
    installReferrer: {
      type: "string",
      label: "Install Referrer",
      description:
        "Third party install referrer, currently available for Android only, [see here for more](https://developers.google.com/analytics/devguides/collection/android/v4/campaigns).",
      optional: true,
    },
    installerPackage: {
      type: "string",
      label: "Installer Package",
      description: "Used internally by the Android SDKs.",
      optional: true,
    },
    urlSchemes: {
      type: "string[]",
      label: "URL Schemes",
      description: "Used internally by the iOS and Android SDKs.",
      optional: true,
    },
    windowsAttributionId: {
      type: "string",
      label: "Windows Attribution ID",
      description: "Attribution token used for Windows 10.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      advertiserTrackingEnabled,
      applicationTrackingEnabled,
      extinfo,
      campaignIds,
      installReferrer,
      installerPackage,
      urlSchemes,
      windowsAttributionId,
    } = this;

    const obj = Object.fromEntries(
      Object.entries({
        advertiser_tracking_enabled: advertiserTrackingEnabled,
        application_tracking_enabled: applicationTrackingEnabled,
        extinfo,
        campaign_ids: campaignIds,
        install_referrer: installReferrer,
        installer_package: installerPackage,
        url_schemes: urlSchemes,
        windows_attribution_id: windowsAttributionId,
      }).filter(([
        , v,
      ]) => v !== undefined),
    );

    $.export("$summary", "Successfully built custom data");
    return obj;
  },
});
