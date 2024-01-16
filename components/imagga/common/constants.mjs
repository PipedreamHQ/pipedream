export const LANGUAGE_OPTIONS = [
  {
    label:	"Arabic",
    value: "ar",
  },
  {
    label:	"Bulgarian",
    value: "bg",
  },
  {
    label:	"Bosnian",
    value: "bs",
  },
  {
    label: "English",
    value: "en",
  },
  {
    label:	"Catalan",
    value: "ca",
  },
  {
    label:	"Czech",
    value: "cs",
  },
  {
    label:	"Welsh",
    value: "cy",
  },
  {
    label:	"Danish",
    value: "da",
  },
  {
    label:	"German",
    value: "de",
  },
  {
    label:	"Greek",
    value: "el",
  },
  {
    label:	"Spanish",
    value: "es",
  },
  {
    label:	"Estonian",
    value: "et",
  },
  {
    label:	"Persian",
    value: "fa",
  },
  {
    label:	"Finnish",
    value: "fi",
  },
  {
    label:	"French",
    value: "fr",
  },
  {
    label:	"Hebrew",
    value: "he",
  },
  {
    label:	"Hindi",
    value: "hi",
  },
  {
    label:	"Croatian",
    value: "hr",
  },
  {
    label:	"Haitian Creole",
    value: "ht",
  },
  {
    label:	"Hungarian",
    value: "hu",
  },
  {
    label:	"Indonesian",
    value: "id",
  },
  {
    label:	"Italian",
    value: "it",
  },
  {
    label:	"Japanese",
    value: "ja",
  },
  {
    label:	"Korean",
    value: "ko",
  },
  {
    label:	"Lithuanian",
    value: "lt",
  },
  {
    label:	"Latvian",
    value: "lv",
  },
  {
    label:	"Malay",
    value: "ms",
  },
  {
    label:	"Maltese",
    value: "mt",
  },
  {
    label:	"Dutch",
    value: "nl",
  },
  {
    label:	"Norwegian",
    value: "no",
  },
  {
    label:	"Polish",
    value: "pl",
  },
  {
    label:	"Portuguese",
    value: "pt",
  },
  {
    label:	"Romanian",
    value: "ro",
  },
  {
    label:	"Russian",
    value: "ru",
  },
  {
    label:	"Slovak",
    value: "sk",
  },
  {
    label:	"Swedish",
    value: "sv",
  },
  {
    label:	"Slovenian",
    value: "sl",
  },
  {
    label:	"Serbian - Cyrillic",
    value: "sr_cyrl",
  },
  {
    label:	"Serbian - Latin",
    value: "sr_latn",
  },
  {
    label:	"Thai",
    value: "th",
  },
  {
    label:	"Turkish",
    value: "tr",
  },
  {
    label:	"Ukrainian",
    value: "uk",
  },
  {
    label:	"Urdu",
    value: "ur",
  },
  {
    label:	"Vietnamese",
    value: "vi",
  },
  {
    label:	"Chinese Simplified",
    value: "zh_chs",
  },
  {
    label:	"Chinese Traditional",
    value: "zh_cht",
  },
];

export const prepareAdditionalProps = ({
  props, type, batch,
}) => {
  switch (type) {
  case "categories" : return categoryProps(props);
  case "colors" : return colorProps(props);
  case "tags" : return tagProps(props, batch);
  }
};

function categoryProps({
  language, saveId, saveIndex,
}) {
  return {
    categorizerId: {
      type: "string",
      label: "Categorizer ID",
      description: "The ID of the categorizer to use",
      options: async () => {
        const { result: { categorizers } } = await this.imagga.listCategorizers();
        return categorizers.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    language,
    saveIndex,
    saveId,
  };
}

function colorProps({
  saveIndex,
  saveId,
  language,
}) {
  return {
    language,
    extractOverallColors: {
      type: "boolean",
      label: "Extract Overall Colors",
      description: "Specify whether the overall image colors should be extracted.",
      optional: true,
    },
    extractObjectColors: {
      type: "boolean",
      label: "Extract Object Colors",
      description: "Specify if the service should try to extract object and non-object (a.k.a. foreground and background) colors separately.",
      optional: true,
    },
    overallCount: {
      type: "integer",
      label: "Overall Count",
      description: "Specify the number of overall image colors the service should try to extract.",
      optional: true,
    },
    separatedCount: {
      type: "integer",
      label: "Separated Count",
      description: "Specify the number of separated colors (foreground and background) the service should try to extract.",
      optional: true,
    },
    deterministic: {
      type: "boolean",
      label: "Deterministic",
      description: "Whether or not to use a deterministic algorithm to extract the colors of the image.",
      optional: true,
    },
    saveIndex,
    saveId,
  };
}

function tagProps({ language }, batch = false) {
  const props = {
    language,
    verbose: {
      type: "boolean",
      label: "Verbose",
      description: "Whether to return some additional information about each of the tags (such as WordNet synset id for some of them) or not.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Limits the number of tags in the result to the number you set.",
      optional: true,
    },
    threshold: {
      type: "string",
      label: "Threshold",
      description: "Thresholds the confidence of tags in the result to the number you set. **Default 0.0**",
      optional: true,
    },
    decreaseParents: {
      type: "boolean",
      label: "Decrease Parents",
      description: "Whether or not to decrease the confidence levels of parent tags of the main recognized object.",
      optional: true,
    },
  };
  if (!batch) {
    props.taggerId = {
      type: "string",
      label: "Tagger Id",
      description: "If a **Tagger Id** is present, the tagging will be done with a custom tagger.",
      optional: true,
    };
  }
  return props;
}
