export default {
  // this is set to true for testing purposes
  USE_MOCK: false,
  VERSION_PATH: {
    V2: "/api/v2",
    V3: "/api/v3",
    MOCK_V2: "/mocks/sendcloud/sendcloud-public-api:v2",
    MOCK_V3: "/mocks/sendcloud/sendcloud-public-api",
  },
  BASE_URL: "https://panel.sendcloud.sc",
  MOCK_BASE_URL: "https://stoplight.io",
  SERVICE_POINTS_BASE_URL: "https://servicepoints.sendcloud.sc",
  COUNTRIES: [
    {
      label: "Aruba",
      value: "AW",
    },
    {
      label: "Afghanistan",
      value: "AF",
    },
    {
      label: "Angola",
      value: "AO",
    },
    {
      label: "Anguilla",
      value: "AI",
    },
    {
      label: "Åland Islands",
      value: "AX",
    },
    {
      label: "Albania",
      value: "AL",
    },
    {
      label: "Andorra",
      value: "AD",
    },
    {
      label: "United Arab Emirates",
      value: "AE",
    },
    {
      label: "Argentina",
      value: "AR",
    },
    {
      label: "Armenia",
      value: "AM",
    },
    {
      label: "American Samoa",
      value: "AS",
    },
    {
      label: "Antarctica",
      value: "AQ",
    },
    {
      label: "French Southern Territories",
      value: "TF",
    },
    {
      label: "Antigua and Barbuda",
      value: "AG",
    },
    {
      label: "Australia",
      value: "AU",
    },
    {
      label: "Austria",
      value: "AT",
    },
    {
      label: "Azerbaijan",
      value: "AZ",
    },
    {
      label: "Burundi",
      value: "BI",
    },
    {
      label: "Belgium",
      value: "BE",
    },
    {
      label: "Benin",
      value: "BJ",
    },
    {
      label: "Bonaire, Sint Eustatius and Saba",
      value: "BQ",
    },
    {
      label: "Burkina Faso",
      value: "BF",
    },
    {
      label: "Bangladesh",
      value: "BD",
    },
    {
      label: "Bulgaria",
      value: "BG",
    },
    {
      label: "Bahrain",
      value: "BH",
    },
    {
      label: "Bahamas",
      value: "BS",
    },
    {
      label: "Bosnia and Herzegovina",
      value: "BA",
    },
    {
      label: "Saint Barthélemy",
      value: "BL",
    },
    {
      label: "Belarus",
      value: "BY",
    },
    {
      label: "Belize",
      value: "BZ",
    },
    {
      label: "Bermuda",
      value: "BM",
    },
    {
      label: "Bolivia, Plurinational State of",
      value: "BO",
    },
    {
      label: "Brazil",
      value: "BR",
    },
    {
      label: "Barbados",
      value: "BB",
    },
    {
      label: "Brunei Darussalam",
      value: "BN",
    },
    {
      label: "Bhutan",
      value: "BT",
    },
    {
      label: "Bouvet Island",
      value: "BV",
    },
    {
      label: "Botswana",
      value: "BW",
    },
    {
      label: "Central African Republic",
      value: "CF",
    },
    {
      label: "Canada",
      value: "CA",
    },
    {
      label: "Cocos (Keeling) Islands",
      value: "CC",
    },
    {
      label: "Switzerland",
      value: "CH",
    },
    {
      label: "Chile",
      value: "CL",
    },
    {
      label: "China",
      value: "CN",
    },
    {
      label: "Côte d'Ivoire",
      value: "CI",
    },
    {
      label: "Cameroon",
      value: "CM",
    },
    {
      label: "Congo, Democratic Republic of the",
      value: "CD",
    },
    {
      label: "Congo",
      value: "CG",
    },
    {
      label: "Cook Islands",
      value: "CK",
    },
    {
      label: "Colombia",
      value: "CO",
    },
    {
      label: "Comoros",
      value: "KM",
    },
    {
      label: "Cabo Verde",
      value: "CV",
    },
    {
      label: "Costa Rica",
      value: "CR",
    },
    {
      label: "Cuba",
      value: "CU",
    },
    {
      label: "Curaçao",
      value: "CW",
    },
    {
      label: "Christmas Island",
      value: "CX",
    },
    {
      label: "Cayman Islands",
      value: "KY",
    },
    {
      label: "Cyprus",
      value: "CY",
    },
    {
      label: "Czechia",
      value: "CZ",
    },
    {
      label: "Germany",
      value: "DE",
    },
    {
      label: "Djibouti",
      value: "DJ",
    },
    {
      label: "Dominica",
      value: "DM",
    },
    {
      label: "Denmark",
      value: "DK",
    },
    {
      label: "Dominican Republic",
      value: "DO",
    },
    {
      label: "Algeria",
      value: "DZ",
    },
    {
      label: "Ecuador",
      value: "EC",
    },
    {
      label: "Egypt",
      value: "EG",
    },
    {
      label: "Eritrea",
      value: "ER",
    },
    {
      label: "Western Sahara",
      value: "EH",
    },
    {
      label: "Spain",
      value: "ES",
    },
    {
      label: "Estonia",
      value: "EE",
    },
    {
      label: "Ethiopia",
      value: "ET",
    },
    {
      label: "Finland",
      value: "FI",
    },
    {
      label: "Fiji",
      value: "FJ",
    },
    {
      label: "Falkland Islands (Malvinas)",
      value: "FK",
    },
    {
      label: "France",
      value: "FR",
    },
    {
      label: "Faroe Islands",
      value: "FO",
    },
    {
      label: "Micronesia, Federated States of",
      value: "FM",
    },
    {
      label: "Gabon",
      value: "GA",
    },
    {
      label: "United Kingdom of Great Britain and Northern Ireland",
      value: "GB",
    },
    {
      label: "Georgia",
      value: "GE",
    },
    {
      label: "Guernsey",
      value: "GG",
    },
    {
      label: "Ghana",
      value: "GH",
    },
    {
      label: "Gibraltar",
      value: "GI",
    },
    {
      label: "Guinea",
      value: "GN",
    },
    {
      label: "Guadeloupe",
      value: "GP",
    },
    {
      label: "Gambia",
      value: "GM",
    },
    {
      label: "Guinea-Bissau",
      value: "GW",
    },
    {
      label: "Equatorial Guinea",
      value: "GQ",
    },
    {
      label: "Greece",
      value: "GR",
    },
    {
      label: "Grenada",
      value: "GD",
    },
    {
      label: "Greenland",
      value: "GL",
    },
    {
      label: "Guatemala",
      value: "GT",
    },
    {
      label: "French Guiana",
      value: "GF",
    },
    {
      label: "Guam",
      value: "GU",
    },
    {
      label: "Guyana",
      value: "GY",
    },
    {
      label: "Hong Kong",
      value: "HK",
    },
    {
      label: "Heard Island and McDonald Islands",
      value: "HM",
    },
    {
      label: "Honduras",
      value: "HN",
    },
    {
      label: "Croatia",
      value: "HR",
    },
    {
      label: "Haiti",
      value: "HT",
    },
    {
      label: "Hungary",
      value: "HU",
    },
    {
      label: "Indonesia",
      value: "ID",
    },
    {
      label: "Isle of Man",
      value: "IM",
    },
    {
      label: "India",
      value: "IN",
    },
    {
      label: "British Indian Ocean Territory",
      value: "IO",
    },
    {
      label: "Ireland",
      value: "IE",
    },
    {
      label: "Iran, Islamic Republic of",
      value: "IR",
    },
    {
      label: "Iraq",
      value: "IQ",
    },
    {
      label: "Iceland",
      value: "IS",
    },
    {
      label: "Israel",
      value: "IL",
    },
    {
      label: "Italy",
      value: "IT",
    },
    {
      label: "Jamaica",
      value: "JM",
    },
    {
      label: "Jersey",
      value: "JE",
    },
    {
      label: "Jordan",
      value: "JO",
    },
    {
      label: "Japan",
      value: "JP",
    },
    {
      label: "Kazakhstan",
      value: "KZ",
    },
    {
      label: "Kenya",
      value: "KE",
    },
    {
      label: "Kyrgyzstan",
      value: "KG",
    },
    {
      label: "Cambodia",
      value: "KH",
    },
    {
      label: "Kiribati",
      value: "KI",
    },
    {
      label: "Saint Kitts and Nevis",
      value: "KN",
    },
    {
      label: "Korea, Republic of",
      value: "KR",
    },
    {
      label: "Kuwait",
      value: "KW",
    },
    {
      label: "Lao People's Democratic Republic",
      value: "LA",
    },
    {
      label: "Lebanon",
      value: "LB",
    },
    {
      label: "Liberia",
      value: "LR",
    },
    {
      label: "Libya",
      value: "LY",
    },
    {
      label: "Saint Lucia",
      value: "LC",
    },
    {
      label: "Liechtenstein",
      value: "LI",
    },
    {
      label: "Sri Lanka",
      value: "LK",
    },
    {
      label: "Lesotho",
      value: "LS",
    },
    {
      label: "Lithuania",
      value: "LT",
    },
    {
      label: "Luxembourg",
      value: "LU",
    },
    {
      label: "Latvia",
      value: "LV",
    },
    {
      label: "Macao",
      value: "MO",
    },
    {
      label: "Saint Martin (French part)",
      value: "MF",
    },
    {
      label: "Morocco",
      value: "MA",
    },
    {
      label: "Monaco",
      value: "MC",
    },
    {
      label: "Moldova, Republic of",
      value: "MD",
    },
    {
      label: "Madagascar",
      value: "MG",
    },
    {
      label: "Maldives",
      value: "MV",
    },
    {
      label: "Mexico",
      value: "MX",
    },
    {
      label: "Marshall Islands",
      value: "MH",
    },
    {
      label: "North Macedonia",
      value: "MK",
    },
    {
      label: "Mali",
      value: "ML",
    },
    {
      label: "Malta",
      value: "MT",
    },
    {
      label: "Myanmar",
      value: "MM",
    },
    {
      label: "Montenegro",
      value: "ME",
    },
    {
      label: "Mongolia",
      value: "MN",
    },
    {
      label: "Northern Mariana Islands",
      value: "MP",
    },
    {
      label: "Mozambique",
      value: "MZ",
    },
    {
      label: "Mauritania",
      value: "MR",
    },
    {
      label: "Montserrat",
      value: "MS",
    },
    {
      label: "Martinique",
      value: "MQ",
    },
    {
      label: "Mauritius",
      value: "MU",
    },
    {
      label: "Malawi",
      value: "MW",
    },
    {
      label: "Malaysia",
      value: "MY",
    },
    {
      label: "Mayotte",
      value: "YT",
    },
    {
      label: "Namibia",
      value: "NA",
    },
    {
      label: "New Caledonia",
      value: "NC",
    },
    {
      label: "Niger",
      value: "NE",
    },
    {
      label: "Norfolk Island",
      value: "NF",
    },
    {
      label: "Nigeria",
      value: "NG",
    },
    {
      label: "Nicaragua",
      value: "NI",
    },
    {
      label: "Niue",
      value: "NU",
    },
    {
      label: "Netherlands, Kingdom of the",
      value: "NL",
    },
    {
      label: "Norway",
      value: "NO",
    },
    {
      label: "Nepal",
      value: "NP",
    },
    {
      label: "Nauru",
      value: "NR",
    },
    {
      label: "New Zealand",
      value: "NZ",
    },
    {
      label: "Oman",
      value: "OM",
    },
    {
      label: "Pakistan",
      value: "PK",
    },
    {
      label: "Panama",
      value: "PA",
    },
    {
      label: "Pitcairn",
      value: "PN",
    },
    {
      label: "Peru",
      value: "PE",
    },
    {
      label: "Philippines",
      value: "PH",
    },
    {
      label: "Palau",
      value: "PW",
    },
    {
      label: "Papua New Guinea",
      value: "PG",
    },
    {
      label: "Poland",
      value: "PL",
    },
    {
      label: "Puerto Rico",
      value: "PR",
    },
    {
      label: "Korea, Democratic People's Republic of",
      value: "KP",
    },
    {
      label: "Portugal",
      value: "PT",
    },
    {
      label: "Paraguay",
      value: "PY",
    },
    {
      label: "Palestine, State of",
      value: "PS",
    },
    {
      label: "French Polynesia",
      value: "PF",
    },
    {
      label: "Qatar",
      value: "QA",
    },
    {
      label: "Réunion",
      value: "RE",
    },
    {
      label: "Romania",
      value: "RO",
    },
    {
      label: "Russian Federation",
      value: "RU",
    },
    {
      label: "Rwanda",
      value: "RW",
    },
    {
      label: "Saudi Arabia",
      value: "SA",
    },
    {
      label: "Sudan",
      value: "SD",
    },
    {
      label: "Senegal",
      value: "SN",
    },
    {
      label: "Singapore",
      value: "SG",
    },
    {
      label: "South Georgia and the South Sandwich Islands",
      value: "GS",
    },
    {
      label: "Saint Helena, Ascension and Tristan da Cunha",
      value: "SH",
    },
    {
      label: "Svalbard and Jan Mayen",
      value: "SJ",
    },
    {
      label: "Solomon Islands",
      value: "SB",
    },
    {
      label: "Sierra Leone",
      value: "SL",
    },
    {
      label: "El Salvador",
      value: "SV",
    },
    {
      label: "San Marino",
      value: "SM",
    },
    {
      label: "Somalia",
      value: "SO",
    },
    {
      label: "Saint Pierre and Miquelon",
      value: "PM",
    },
    {
      label: "Serbia",
      value: "RS",
    },
    {
      label: "South Sudan",
      value: "SS",
    },
    {
      label: "Sao Tome and Principe",
      value: "ST",
    },
    {
      label: "Suriname",
      value: "SR",
    },
    {
      label: "Slovakia",
      value: "SK",
    },
    {
      label: "Slovenia",
      value: "SI",
    },
    {
      label: "Sweden",
      value: "SE",
    },
    {
      label: "Eswatini",
      value: "SZ",
    },
    {
      label: "Sint Maarten (Dutch part)",
      value: "SX",
    },
    {
      label: "Seychelles",
      value: "SC",
    },
    {
      label: "Syrian Arab Republic",
      value: "SY",
    },
    {
      label: "Turks and Caicos Islands",
      value: "TC",
    },
    {
      label: "Chad",
      value: "TD",
    },
    {
      label: "Togo",
      value: "TG",
    },
    {
      label: "Thailand",
      value: "TH",
    },
    {
      label: "Tajikistan",
      value: "TJ",
    },
    {
      label: "Tokelau",
      value: "TK",
    },
    {
      label: "Turkmenistan",
      value: "TM",
    },
    {
      label: "Timor-Leste",
      value: "TL",
    },
    {
      label: "Tonga",
      value: "TO",
    },
    {
      label: "Trinidad and Tobago",
      value: "TT",
    },
    {
      label: "Tunisia",
      value: "TN",
    },
    {
      label: "Turkey",
      value: "TR",
    },
    {
      label: "Tuvalu",
      value: "TV",
    },
    {
      label: "Taiwan, Province of China",
      value: "TW",
    },
    {
      label: "Tanzania, United Republic of",
      value: "TZ",
    },
    {
      label: "Uganda",
      value: "UG",
    },
    {
      label: "Ukraine",
      value: "UA",
    },
    {
      label: "United States Minor Outlying Islands",
      value: "UM",
    },
    {
      label: "Uruguay",
      value: "UY",
    },
    {
      label: "United States of America",
      value: "US",
    },
    {
      label: "Uzbekistan",
      value: "UZ",
    },
    {
      label: "Holy See",
      value: "VA",
    },
    {
      label: "Saint Vincent and the Grenadines",
      value: "VC",
    },
    {
      label: "Venezuela, Bolivarian Republic of",
      value: "VE",
    },
    {
      label: "Virgin Islands, British",
      value: "VG",
    },
    {
      label: "Virgin Islands, U.S.",
      value: "VI",
    },
    {
      label: "Viet Nam",
      value: "VN",
    },
    {
      label: "Vanuatu",
      value: "VU",
    },
    {
      label: "Wallis and Futuna",
      value: "WF",
    },
    {
      label: "Samoa",
      value: "WS",
    },
    {
      label: "Yemen",
      value: "YE",
    },
    {
      label: "South Africa",
      value: "ZA",
    },
    {
      label: "Zambia",
      value: "ZM",
    },
    {
      label: "Zimbabwe",
      value: "ZW",
    },
    {
      label: "Canary Islands",
      value: "IC",
    },
    {
      label: "Kosovo",
      value: "XK",
    },
  ],
};
