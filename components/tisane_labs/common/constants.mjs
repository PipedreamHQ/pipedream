const FORMAT_OPTIONS = [
  {
    label: "Review",
    value: "review",
  },
  {
    label: "Dialog",
    value: "dialog",
  },
  {
    label: "Shortpost",
    value: "shortpost",
  },
  {
    label: "Longform",
    value: "longform",
  },
  {
    label: "Proofread",
    value: "proofread",
  },
  {
    label: "Alias",
    value: "alias",
  },
  {
    label: "Search",
    value: "search",
  },
];

const FEATURE_STANDARD_OPTIONS = [
  {
    label: "Universal Dependencies tags",
    value: "ud",
  },
  {
    label: "Penn treebank tags",
    value: "penn",
  },
  {
    label: "Tisane native feature codes",
    value: "native",
  },
  {
    label: "Tisane native feature descriptions",
    value: "description",
  },
];

const TOPIC_STANDARD_OPTIONS = [
  {
    label: "IPTC topic taxonomy code",
    value: "iptc_code",
  },
  {
    label: "IPTC topic taxonomy description",
    value: "iptc_description",
  },
  {
    label: "IAB topic taxonomy code",
    value: "iab_code",
  },
  {
    label: "IAB topic taxonomy description",
    value: "iab_description",
  },
  {
    label: "Tisane domain description, coming from the family description",
    value: "native",
  },
];

const SENTIMENT_ANALYSIS_TYPE_OPTIONS = [
  {
    label: "Products and Services",
    value: "products_and_services",
  },
  {
    label: "Entity",
    value: "entity",
  },
  {
    label: "Creative Content Review",
    value: "creative_content_review",
  },
  {
    label: "Political Essay",
    value: "political_essay",
  },
];

export default {
  FORMAT_OPTIONS,
  FEATURE_STANDARD_OPTIONS,
  TOPIC_STANDARD_OPTIONS,
  SENTIMENT_ANALYSIS_TYPE_OPTIONS,
};
