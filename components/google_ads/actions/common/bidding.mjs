import { TARGET_IMPRESSION_SHARE_LOCATIONS } from "../../common/constants.mjs";

// Each description names the strategies the field belongs to: the props are declared flat, so a
// value set against a different strategy is ignored rather than sent.
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

const targetSpendMicros = {
  type: "string",
  label: "Target Spend (Micros)",
  description: "Spend target under which to maximize clicks, in micros (1,000,000 micros = 1 unit of the account currency). Applies to **Target Spend**.",
  optional: true,
};

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

/**
 * The union of every scheme's fields, declared as flat optional props.
 *
 * Field names repeat across schemes (`cpcBidCeilingMicros` belongs to four of them), so the
 * union stays small. Declaring them statically keeps the action's schema flat for SDK and MCP
 * callers, which would otherwise have to reload props and thread a `dynamicPropsId` through
 * before they could see these fields at all. `buildBiddingScheme` picks the subset that belongs
 * to the selected type at runtime.
 */
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

// Scheme field names verified against GoogleAdsFieldService for v25. Campaign-level and
// portfolio-level schemes differ: a campaign has no `enhanced_cpc`, and a portfolio bidding
// strategy has no `percent_cpc` or manual scheme.
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
      targetSpendMicros,
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
      targetSpendMicros,
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

/**
 * Builds the bidding scheme object for a mutate payload, e.g.
 * `{ targetCpa: { targetCpaMicros: "5000000" } }`.
 */
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
