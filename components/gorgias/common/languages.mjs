const languages = [
  {
    label: "Abkhazian",
    value: "ab",
  },
  {
    label: "Afar",
    value: "aa",
  },
  {
    label: "Afrikaans",
    value: "af",
  },
  {
    label: "Akan",
    value: "ak",
  },
  {
    label: "Albanian",
    value: "sq",
  },
  {
    label: "Amharic",
    value: "am",
  },
  {
    label: "Arabic",
    value: "ar",
  },
  {
    label: "Aragonese",
    value: "an",
  },
  {
    label: "Armenian",
    value: "hy",
  },
  {
    label: "Assamese",
    value: "as",
  },
  {
    label: "Avaric",
    value: "av",
  },
  {
    label: "Avestan",
    value: "ae",
  },
  {
    label: "Aymara",
    value: "ay",
  },
  {
    label: "Azerbaijani",
    value: "az",
  },
  {
    label: "Bambara",
    value: "bm",
  },
  {
    label: "Bashkir",
    value: "ba",
  },
  {
    label: "Basque",
    value: "eu",
  },
  {
    label: "Belarusian",
    value: "be",
  },
  {
    label: "Bengali",
    value: "bn",
  },
  {
    label: "Bislama",
    value: "bi",
  },
  {
    label: "Bosnian",
    value: "bs",
  },
  {
    label: "Breton",
    value: "br",
  },
  {
    label: "Bulgarian",
    value: "bg",
  },
  {
    label: "Burmese",
    value: "my",
  },
  {
    label: "Catalan, Valencian",
    value: "ca",
  },
  {
    label: "Chamorro",
    value: "ch",
  },
  {
    label: "Chechen",
    value: "ce",
  },
  {
    label: "Chichewa, Chewa, Nyanja",
    value: "ny",
  },
  {
    label: "Chinese",
    value: "zh",
  },
  {
    label: "Church Slavic, Old Slavonic, Church Slavonic, Old Bulgarian, Old Church Slavonic",
    value: "cu",
  },
  {
    label: "Chuvash",
    value: "cv",
  },
  {
    label: "Cornish",
    value: "kw",
  },
  {
    label: "Corsican",
    value: "co",
  },
  {
    label: "Cree",
    value: "cr",
  },
  {
    label: "Croatian",
    value: "hr",
  },
  {
    label: "Czech",
    value: "cs",
  },
  {
    label: "Danish",
    value: "da",
  },
  {
    label: "Divehi, Dhivehi, Maldivian",
    value: "dv",
  },
  {
    label: "Dutch, Flemish",
    value: "nl",
  },
  {
    label: "Dzongkha",
    value: "dz",
  },
  {
    label: "English",
    value: "en",
  },
  {
    label: "Esperanto",
    value: "eo",
  },
  {
    label: "Estonian",
    value: "et",
  },
  {
    label: "Ewe",
    value: "ee",
  },
  {
    label: "Faroese",
    value: "fo",
  },
  {
    label: "Fijian",
    value: "fj",
  },
  {
    label: "Finnish",
    value: "fi",
  },
  {
    label: "French",
    value: "fr",
  },
  {
    label: "Western Frisian",
    value: "fy",
  },
  {
    label: "Fulah",
    value: "ff",
  },
  {
    label: "Gaelic, Scottish Gaelic",
    value: "gd",
  },
  {
    label: "Galician",
    value: "gl",
  },
  {
    label: "Ganda",
    value: "lg",
  },
  {
    label: "Georgian",
    value: "ka",
  },
  {
    label: "German",
    value: "de",
  },
  {
    label: "Greek, Modern(1453–)",
    value: "el",
  },
  {
    label: "Kalaallisut, Greenlandic",
    value: "kl",
  },
  {
    label: "Guarani",
    value: "gn",
  },
  {
    label: "Gujarati",
    value: "gu",
  },
  {
    label: "Haitian, Haitian Creole",
    value: "ht",
  },
  {
    label: "Hausa",
    value: "ha",
  },
  {
    label: "Hebrew",
    value: "he",
  },
  {
    label: "Herero",
    value: "hz",
  },
  {
    label: "Hindi",
    value: "hi",
  },
  {
    label: "Hiri Motu",
    value: "ho",
  },
  {
    label: "Hungarian",
    value: "hu",
  },
  {
    label: "Icelandic",
    value: "is",
  },
  {
    label: "Ido",
    value: "io",
  },
  {
    label: "Igbo",
    value: "ig",
  },
  {
    label: "Indonesian",
    value: "id",
  },
  {
    label: "Interlingua(International Auxiliary Language Association)",
    value: "ia",
  },
  {
    label: "Interlingue, Occidental",
    value: "ie",
  },
  {
    label: "Inuktitut",
    value: "iu",
  },
  {
    label: "Inupiaq",
    value: "ik",
  },
  {
    label: "Irish",
    value: "ga",
  },
  {
    label: "Italian",
    value: "it",
  },
  {
    label: "Japanese",
    value: "ja",
  },
  {
    label: "Javanese",
    value: "jv",
  },
  {
    label: "Kannada",
    value: "kn",
  },
  {
    label: "Kanuri",
    value: "kr",
  },
  {
    label: "Kashmiri",
    value: "ks",
  },
  {
    label: "Kazakh",
    value: "kk",
  },
  {
    label: "Central Khmer",
    value: "km",
  },
  {
    label: "Kikuyu, Gikuyu",
    value: "ki",
  },
  {
    label: "Kinyarwanda",
    value: "rw",
  },
  {
    label: "Kirghiz, Kyrgyz",
    value: "ky",
  },
  {
    label: "Komi",
    value: "kv",
  },
  {
    label: "Kongo",
    value: "kg",
  },
  {
    label: "Korean",
    value: "ko",
  },
  {
    label: "Kuanyama, Kwanyama",
    value: "kj",
  },
  {
    label: "Kurdish",
    value: "ku",
  },
  {
    label: "Lao",
    value: "lo",
  },
  {
    label: "Latin",
    value: "la",
  },
  {
    label: "Latvian",
    value: "lv",
  },
  {
    label: "Limburgan, Limburger, Limburgish",
    value: "li",
  },
  {
    label: "Lingala",
    value: "ln",
  },
  {
    label: "Lithuanian",
    value: "lt",
  },
  {
    label: "Luba - Katanga",
    value: "lu",
  },
  {
    label: "Luxembourgish, Letzeburgesch",
    value: "lb",
  },
  {
    label: "Macedonian",
    value: "mk",
  },
  {
    label: "Malagasy",
    value: "mg",
  },
  {
    label: "Malay",
    value: "ms",
  },
  {
    label: "Malayalam",
    value: "ml",
  },
  {
    label: "Maltese",
    value: "mt",
  },
  {
    label: "Manx",
    value: "gv",
  },
  {
    label: "Maori",
    value: "mi",
  },
  {
    label: "Marathi",
    value: "mr",
  },
  {
    label: "Marshallese",
    value: "mh",
  },
  {
    label: "Mongolian",
    value: "mn",
  },
  {
    label: "Nauru",
    value: "na",
  },
  {
    label: "Navajo, Navaho",
    value: "nv",
  },
  {
    label: "North Ndebele",
    value: "nd",
  },
  {
    label: "South Ndebele",
    value: "nr",
  },
  {
    label: "Ndonga",
    value: "ng",
  },
  {
    label: "Nepali",
    value: "ne",
  },
  {
    label: "Norwegian",
    value: "no",
  },
  {
    label: "Norwegian Bokmål",
    value: "nb",
  },
  {
    label: "Norwegian Nynorsk",
    value: "nn",
  },
  {
    label: "Sichuan Yi, Nuosu",
    value: "ii",
  },
  {
    label: "Occitan",
    value: "oc",
  },
  {
    label: "Ojibwa",
    value: "oj",
  },
  {
    label: "Oriya",
    value: "or",
  },
  {
    label: "Oromo",
    value: "om",
  },
  {
    label: "Ossetian, Ossetic",
    value: "os",
  },
  {
    label: "Pali",
    value: "pi",
  },
  {
    label: "Pashto, Pushto",
    value: "ps",
  },
  {
    label: "Persian",
    value: "fa",
  },
  {
    label: "Polish",
    value: "pl",
  },
  {
    label: "Portuguese",
    value: "pt",
  },
  {
    label: "Punjabi, Panjabi",
    value: "pa",
  },
  {
    label: "Quechua",
    value: "qu",
  },
  {
    label: "Romanian, Moldavian, Moldovan",
    value: "ro",
  },
  {
    label: "Romansh",
    value: "rm",
  },
  {
    label: "Rundi",
    value: "rn",
  },
  {
    label: "Russian",
    value: "ru",
  },
  {
    label: "Northern Sami",
    value: "se",
  },
  {
    label: "Samoan",
    value: "sm",
  },
  {
    label: "Sango",
    value: "sg",
  },
  {
    label: "Sanskrit",
    value: "sa",
  },
  {
    label: "Sardinian",
    value: "sc",
  },
  {
    label: "Serbian",
    value: "sr",
  },
  {
    label: "Shona",
    value: "sn",
  },
  {
    label: "Sindhi",
    value: "sd",
  },
  {
    label: "Sinhala, Sinhalese",
    value: "si",
  },
  {
    label: "Slovak",
    value: "sk",
  },
  {
    label: "Slovenian",
    value: "sl",
  },
  {
    label: "Somali",
    value: "so",
  },
  {
    label: "Southern Sotho",
    value: "st",
  },
  {
    label: "Spanish, Castilian",
    value: "es",
  },
  {
    label: "Sundanese",
    value: "su",
  },
  {
    label: "Swahili",
    value: "sw",
  },
  {
    label: "Swati",
    value: "ss",
  },
  {
    label: "Swedish",
    value: "sv",
  },
  {
    label: "Tagalog",
    value: "tl",
  },
  {
    label: "Tahitian",
    value: "ty",
  },
  {
    label: "Tajik",
    value: "tg",
  },
  {
    label: "Tamil",
    value: "ta",
  },
  {
    label: "Tatar",
    value: "tt",
  },
  {
    label: "Telugu",
    value: "te",
  },
  {
    label: "Thai",
    value: "th",
  },
  {
    label: "Tibetan",
    value: "bo",
  },
  {
    label: "Tigrinya",
    value: "ti",
  },
  {
    label: "Tonga(Tonga Islands)",
    value: "to",
  },
  {
    label: "Tsonga",
    value: "ts",
  },
  {
    label: "Tswana",
    value: "tn",
  },
  {
    label: "Turkish",
    value: "tr",
  },
  {
    label: "Turkmen",
    value: "tk",
  },
  {
    label: "Twi",
    value: "tw",
  },
  {
    label: "Uighur, Uyghur",
    value: "ug",
  },
  {
    label: "Ukrainian",
    value: "uk",
  },
  {
    label: "Urdu",
    value: "ur",
  },
  {
    label: "Uzbek",
    value: "uz",
  },
  {
    label: "Venda",
    value: "ve",
  },
  {
    label: "Vietnamese",
    value: "vi",
  },
  {
    label: "Volapük",
    value: "vo",
  },
  {
    label: "Walloon",
    value: "wa",
  },
  {
    label: "Welsh",
    value: "cy",
  },
  {
    label: "Wolof",
    value: "wo",
  },
  {
    label: "Xhosa",
    value: "xh",
  },
  {
    label: "Yiddish",
    value: "yi",
  },
  {
    label: "Yoruba",
    value: "yo",
  },
  {
    label: "Zhuang, Chuang",
    value: "za",
  },
  {
    label: "Zulu",
    value: "zu",
  },
];

export default languages;
