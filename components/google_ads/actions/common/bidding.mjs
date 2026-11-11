import { TARGET_IMPRESSION_SHARE_LOCATIONS } from "../../common/constants.mjs";

const cpcBidCeilingMicros = {
  type: "string",
  label: "CPC Bid Ceiling (Micros)",
  description: "Maximum bid limit that can be set by the bid strategy, in micros (1,000,000 micros = 1 unit of the account currency). Applies to **Target CPA**, **Target ROAS**, **Target Spend**, **Target Impression Share**, **Maximize Conversions**, **Maximize Conversion Value** and **Percent CPC**.",
  optional: true,
};

const cpcBidFloorMicros = {
  type: "string",
  label: "CPC Bid Floor (Micros)",
  description: "Minimum bid limit that can be set by the bid strategy, in micros (1,000,000 micros = 1 unit of the account currency). Applies to **Target CPA**, **Target ROAS**, **Maximize Conversions** and **Maximize Conversion Value**.",
  optional: true,
};

const targetCpaMicros = {
  type: "string",
  label: "Target CPA (Micros)",
  description: "Average cost per acquisition to target, in micros (1,000,000 micros = 1 unit of the account currency). Applies to **Target CPA** and **Maximize Conversions**.",
  optional: true,
};

const targetRoas = {
  type: "string",
  label: "Target ROAS",
  description: "Revenue to target per unit of spend, as a decimal (e.g. `3.5` targets 350% return). Applies to **Target ROAS** and **Maximize Conversion Value**.",
  optional: true,
};

// `target_spend_micros` is deprecated in v25, so it is not exposed.

const targetImpressionShareProps = {
  location: {
    type: "string",
    label: "Impression Share Location",
    description: "Where on the search results page the ads should appear. Applies to **Target Impression Share**.",
    options: TARGET_IMPRESSION_SHARE_LOCATIONS,
    optional: true,
  },
  locationFractionMicros: {
    type: "string",
    label: "Impression Share Target (Micros)",
    description: "Fraction of ads to be shown in the targeted location, in micros (e.g. `650000` targets 65%). Applies to **Target Impression Share**.",
    optional: true,
  },
  cpcBidCeilingMicros,
};

const enhancedCpcEnabled = {
  type: "boolean",
  label: "Enhanced CPC Enabled",
  description: "Whether bids are enhanced based on conversion optimizer data. Applies to **Manual CPC** and **Percent CPC**.",
  optional: true,
};

// Flat union of every scheme's fields; buildBiddingScheme picks the subset for the chosen type.
export function getSchemeProps(schemes) {
  const merged = {};
  for (const { props } of Object.values(schemes)) {
    for (const [
      name,
      definition,
    ] of Object.entries(props)) {
      merged[name] ??= definition;
    }
  }
  return merged;
}

// Campaign and portfolio schemes differ in v25: no `enhanced_cpc` on campaigns, no `percent_cpc`
// or manual scheme on portfolio strategies.
export const CAMPAIGN_BIDDING_SCHEMES = {
  MANUAL_CPC: {
    field: "manualCpc",
    props: {
      enhancedCpcEnabled,
    },
  },
  MANUAL_CPM: {
    field: "manualCpm",
    props: {},
  },
  TARGET_CPA: {
    field: "targetCpa",
    props: {
      targetCpaMicros,
      cpcBidCeilingMicros,
      cpcBidFloorMicros,
    },
  },
  TARGET_ROAS: {
    field: "targetRoas",
    props: {
      targetRoas,
      cpcBidCeilingMicros,
      cpcBidFloorMicros,
    },
  },
  TARGET_SPEND: {
    field: "targetSpend",
    props: {
      cpcBidCeilingMicros,
    },
  },
  MAXIMIZE_CONVERSIONS: {
    field: "maximizeConversions",
    props: {
      targetCpaMicros,
    },
  },
  MAXIMIZE_CONVERSION_VALUE: {
    field: "maximizeConversionValue",
    props: {
      targetRoas,
    },
  },
  TARGET_IMPRESSION_SHARE: {
    field: "targetImpressionShare",
    props: targetImpressionShareProps,
  },
  PERCENT_CPC: {
    field: "percentCpc",
    props: {
      cpcBidCeilingMicros,
      enhancedCpcEnabled,
    },
  },
};

export const PORTFOLIO_BIDDING_SCHEMES = {
  ENHANCED_CPC: {
    field: "enhancedCpc",
    props: {},
  },
  TARGET_CPA: {
    field: "targetCpa",
    props: {
      targetCpaMicros,
      cpcBidCeilingMicros,
      cpcBidFloorMicros,
    },
  },
  TARGET_ROAS: {
    field: "targetRoas",
    props: {
      targetRoas,
      cpcBidCeilingMicros,
      cpcBidFloorMicros,
    },
  },
  TARGET_SPEND: {
    field: "targetSpend",
    props: {
      cpcBidCeilingMicros,
    },
  },
  MAXIMIZE_CONVERSIONS: {
    field: "maximizeConversions",
    props: {
      targetCpaMicros,
      cpcBidCeilingMicros,
      cpcBidFloorMicros,
    },
  },
  MAXIMIZE_CONVERSION_VALUE: {
    field: "maximizeConversionValue",
    props: {
      targetRoas,
      cpcBidCeilingMicros,
      cpcBidFloorMicros,
    },
  },
  TARGET_IMPRESSION_SHARE: {
    field: "targetImpressionShare",
    props: targetImpressionShareProps,
  },
};

export function buildBiddingScheme(schemes, type, values) {
  const scheme = schemes[type];
  if (!scheme) {
    return {};
  }
  const config = Object.fromEntries(
    Object.keys(scheme.props)
      .filter((key) => values[key] !== undefined && values[key] !== "")
      .map((key) => [
        key,
        values[key],
      ]),
  );
  return {
    [scheme.field]: config,
  };
}
