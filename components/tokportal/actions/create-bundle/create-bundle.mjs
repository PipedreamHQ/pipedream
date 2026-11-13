import { ConfigurationError } from "@pipedream/platform";
import tokportal from "../../tokportal.app.mjs";

export default {
  key: "tokportal-create-bundle",
  name: "Create Bundle",
  description: "Create and pay a bundle (mission): a new managed account, an account with video slots, or video slots on an existing delivered account."
    + " Credits are debited immediately (see **Get Credit Costs**). Then configure the account/videos, and call **Publish Bundle**."
    + " [See the documentation](https://developers.tokportal.com/create-bundle/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    tokportal,
    bundleType: {
      propDefinition: [
        tokportal,
        "bundleType",
      ],
    },
    platform: {
      propDefinition: [
        tokportal,
        "platform",
      ],
      description: "Platform of the new account (`tiktok` or `instagram`). Ignored for `videos_only` bundles (the existing account defines it).",
      optional: true,
    },
    country: {
      propDefinition: [
        tokportal,
        "country",
      ],
      description: "Country of the account manager who will create the account (for example `US`). Required unless Bundle Type is `videos_only`.",
      optional: true,
    },
    accountId: {
      propDefinition: [
        tokportal,
        "accountId",
      ],
      description: "Delivered (saved) account the videos must be posted on. Required for `videos_only` bundles. Use **List Accounts** to find account IDs.",
      optional: true,
    },
    videosQuantity: {
      type: "integer",
      label: "Videos Quantity",
      description: "Number of video slots to purchase on this bundle.",
      min: 0,
      optional: true,
    },
    editsQuantity: {
      type: "integer",
      label: "Edits Quantity",
      description: "Number of video edit slots to purchase.",
      min: 0,
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Internal title of the bundle.",
      optional: true,
    },
    externalRef: {
      propDefinition: [
        tokportal,
        "externalRef",
      ],
      description: "Your own correlation reference (for example a CRM row ID). Also a duplicate-detection aid for new-account bundles: reusing it can return the existing bundle instead of creating a new one.",
      optional: true,
    },
    autoFinalizeVideos: {
      type: "boolean",
      label: "Auto Finalize Videos",
      description: "Whether posted videos are finalized automatically without a manual review. Defaults to `true`.",
      optional: true,
    },
    wantsAdvancedWarming: {
      type: "boolean",
      label: "Wants Advanced Warming",
      description: "Purchase Advanced Niche Warming (recommended): search-term based warming with recorded proof. Provide either **Advanced Warming Terms** or **Advanced Warming Terms Count**.",
      optional: true,
    },
    advancedWarmingTerms: {
      type: "string[]",
      label: "Advanced Warming Terms",
      description: "3-30 niche search terms (count must be a multiple of 3), e.g. `[\"healthy meal prep\", \"high protein recipes\", \"gym lunch ideas\"]`.",
      optional: true,
    },
    advancedWarmingTermsCount: {
      type: "integer",
      label: "Advanced Warming Terms Count",
      description: "Number of niche targets to purchase now and configure later (3-30, multiple of 3). Alternative to **Advanced Warming Terms**.",
      min: 3,
      max: 30,
      optional: true,
    },
    nicheWarmingInstructions: {
      type: "string",
      label: "Niche Warming Instructions",
      description: "Free-text instructions for the account manager about the niche to warm the account in.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.bundleType === "videos_only" && !this.accountId) {
      throw new ConfigurationError("Account ID is required for `videos_only` bundles.");
    }
    if (this.bundleType !== "videos_only" && !this.country) {
      throw new ConfigurationError("Country is required unless Bundle Type is `videos_only`.");
    }

    const response = await this.tokportal.createBundle({
      $,
      data: {
        bundle_type: this.bundleType,
        platform: this.platform,
        country: this.country,
        account_id: this.accountId,
        videos_quantity: this.videosQuantity,
        edits_quantity: this.editsQuantity,
        title: this.title,
        external_ref: this.externalRef,
        auto_finalize_videos: this.autoFinalizeVideos,
        wants_advanced_warming: this.wantsAdvancedWarming,
        advanced_warming_terms: this.advancedWarmingTerms,
        advanced_warming_terms_count: this.advancedWarmingTermsCount,
        niche_warming_instructions: this.nicheWarmingInstructions,
      },
    });

    const bundle = response?.data ?? response;
    const credits = response?.credits_charged;
    $.export("$summary", `Created bundle ${bundle?.id ?? ""}${credits !== undefined
      ? ` (${credits} credits charged)`
      : ""}`);
    return response;
  },
};
