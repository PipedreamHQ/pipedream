const INSURANCE_CARRIERS = [
  "dhl",
  "fedex",
  "usps",
  "ups",
  "canadapost",
  "xpo_logistics",
  "reddaway",
  "central_transport",
  "frontline",
  "daylight_transport",
  "duie_pyle",
  "saia",
  "unis",
  "fedex_freight",
  "abf_freight",
  "xpress_global",
  "ddp",
  "old_dominion",
  "roadrunner",
  "estes_express_lines",
  "yrc_worldwide",
  "oak_harbor",
  "dependable_highway_express",
  "t_force",
  "forward_air",
  "amazon_freight",
  "new_penn",
  "r_and_l_carriers",
  "ward",
  "dayton",
  "land_air",
  "ross_express",
  "pitt_ohio",
  "southeastern_freight_lines",
  "best_yet_express",
  "aaa_cooper",
  "averitt_express",
  "total_transportation",
  "uber",
  "gls",
  "diamond_line_delivery_systems",
  "midwest_motor_express",
  "dugan_truck_line",
  "southwestern_motor_transport",
  "aci_motor_freight",
  "dohrn",
  "holland",
  "moto_transportation",
  "magnum_ltl",
  "pace_motor_lines",
  "ch_robinson",
  "sutton_transport",
  "jp_express",
  "tax_airfreight",
  "performance_freight",
  "fort_transportation",
  "double_d_express",
  "crosscountry_freight_solutions",
  "go2_logistics",
  "warp",
  "hercules_freight",
  "standard_forwarding",
];

const COUNTRY_CODES = [
  {
    label: "Afghanistan",
    value: "AF",
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
    label: "Algeria",
    value: "DZ",
  },
  {
    label: "American Samoa",
    value: "AS",
  },
  {
    label: "Andorra",
    value: "AD",
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
    label: "Antarctica",
    value: "AQ",
  },
  {
    label: "Antigua and Barbuda",
    value: "AG",
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
    label: "Aruba",
    value: "AW",
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
    label: "Bahamas",
    value: "BS",
  },
  {
    label: "Bahrain",
    value: "BH",
  },
  {
    label: "Bangladesh",
    value: "BD",
  },
  {
    label: "Barbados",
    value: "BB",
  },
  {
    label: "Belarus",
    value: "BY",
  },
  {
    label: "Belgium",
    value: "BE",
  },
  {
    label: "Belize",
    value: "BZ",
  },
  {
    label: "Benin",
    value: "BJ",
  },
  {
    label: "Bermuda",
    value: "BM",
  },
  {
    label: "Bhutan",
    value: "BT",
  },
  {
    label: "Bolivia, Plurinational State of",
    value: "BO",
  },
  {
    label: "Bonaire, Sint Eustatius and Saba",
    value: "BQ",
  },
  {
    label: "Bosnia and Herzegovina",
    value: "BA",
  },
  {
    label: "Botswana",
    value: "BW",
  },
  {
    label: "Bouvet Island",
    value: "BV",
  },
  {
    label: "Brazil",
    value: "BR",
  },
  {
    label: "British Indian Ocean Territory",
    value: "IO",
  },
  {
    label: "Brunei Darussalam",
    value: "BN",
  },
  {
    label: "Bulgaria",
    value: "BG",
  },
  {
    label: "Burkina Faso",
    value: "BF",
  },
  {
    label: "Burundi",
    value: "BI",
  },
  {
    label: "Cambodia",
    value: "KH",
  },
  {
    label: "Cameroon",
    value: "CM",
  },
  {
    label: "Canada",
    value: "CA",
  },
  {
    label: "Cape Verde",
    value: "CV",
  },
  {
    label: "Cayman Islands",
    value: "KY",
  },
  {
    label: "Central African Republic",
    value: "CF",
  },
  {
    label: "Chad",
    value: "TD",
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
    label: "Christmas Island",
    value: "CX",
  },
  {
    label: "Cocos (Keeling) Islands",
    value: "CC",
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
    label: "Congo",
    value: "CG",
  },
  {
    label: "Congo, the Democratic Republic of the",
    value: "CD",
  },
  {
    label: "Cook Islands",
    value: "CK",
  },
  {
    label: "Costa Rica",
    value: "CR",
  },
  {
    label: "Côte d'Ivoire",
    value: "CI",
  },
  {
    label: "Croatia",
    value: "HR",
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
    label: "Cyprus",
    value: "CY",
  },
  {
    label: "Czech Republic",
    value: "CZ",
  },
  {
    label: "Denmark",
    value: "DK",
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
    label: "Dominican Republic",
    value: "DO",
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
    label: "El Salvador",
    value: "SV",
  },
  {
    label: "Equatorial Guinea",
    value: "GQ",
  },
  {
    label: "Eritrea",
    value: "ER",
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
    label: "Falkland Islands (Malvinas)",
    value: "FK",
  },
  {
    label: "Faroe Islands",
    value: "FO",
  },
  {
    label: "Fiji",
    value: "FJ",
  },
  {
    label: "Finland",
    value: "FI",
  },
  {
    label: "France",
    value: "FR",
  },
  {
    label: "French Guiana",
    value: "GF",
  },
  {
    label: "French Polynesia",
    value: "PF",
  },
  {
    label: "French Southern Territories",
    value: "TF",
  },
  {
    label: "Gabon",
    value: "GA",
  },
  {
    label: "Gambia",
    value: "GM",
  },
  {
    label: "Georgia",
    value: "GE",
  },
  {
    label: "Germany",
    value: "DE",
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
    label: "Greece",
    value: "GR",
  },
  {
    label: "Greenland",
    value: "GL",
  },
  {
    label: "Grenada",
    value: "GD",
  },
  {
    label: "Guadeloupe",
    value: "GP",
  },
  {
    label: "Guam",
    value: "GU",
  },
  {
    label: "Guatemala",
    value: "GT",
  },
  {
    label: "Guernsey",
    value: "GG",
  },
  {
    label: "Guinea",
    value: "GN",
  },
  {
    label: "Guinea-Bissau",
    value: "GW",
  },
  {
    label: "Guyana",
    value: "GY",
  },
  {
    label: "Haiti",
    value: "HT",
  },
  {
    label: "Heard Island and McDonald Islands",
    value: "HM",
  },
  {
    label: "Holy See (Vatican City State)",
    value: "VA",
  },
  {
    label: "Honduras",
    value: "HN",
  },
  {
    label: "Hong Kong",
    value: "HK",
  },
  {
    label: "Hungary",
    value: "HU",
  },
  {
    label: "Iceland",
    value: "IS",
  },
  {
    label: "India",
    value: "IN",
  },
  {
    label: "Indonesia",
    value: "ID",
  },
  {
    label: "Iraq",
    value: "IQ",
  },
  {
    label: "Ireland",
    value: "IE",
  },
  {
    label: "Isle of Man",
    value: "IM",
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
    label: "Japan",
    value: "JP",
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
    label: "Kazakhstan",
    value: "KZ",
  },
  {
    label: "Kenya",
    value: "KE",
  },
  {
    label: "Kiribati",
    value: "KI",
  },
  {
    label: "Korea, Democratic People's Republic of",
    value: "KP",
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
    label: "Kyrgyzstan",
    value: "KG",
  },
  {
    label: "Lao People's Democratic Republic",
    value: "LA",
  },
  {
    label: "Latvia",
    value: "LV",
  },
  {
    label: "Lebanon",
    value: "LB",
  },
  {
    label: "Lesotho",
    value: "LS",
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
    label: "Liechtenstein",
    value: "LI",
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
    label: "Macao",
    value: "MO",
  },
  {
    label: "Macedonia, the Former Yugoslav Republic of",
    value: "MK",
  },
  {
    label: "Madagascar",
    value: "MG",
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
    label: "Maldives",
    value: "MV",
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
    label: "Marshall Islands",
    value: "MH",
  },
  {
    label: "Martinique",
    value: "MQ",
  },
  {
    label: "Mauritania",
    value: "MR",
  },
  {
    label: "Mauritius",
    value: "MU",
  },
  {
    label: "Mayotte",
    value: "YT",
  },
  {
    label: "Mexico",
    value: "MX",
  },
  {
    label: "Micronesia, Federated States of",
    value: "FM",
  },
  {
    label: "Moldova, Republic of",
    value: "MD",
  },
  {
    label: "Monaco",
    value: "MC",
  },
  {
    label: "Mongolia",
    value: "MN",
  },
  {
    label: "Montenegro",
    value: "ME",
  },
  {
    label: "Montserrat",
    value: "MS",
  },
  {
    label: "Morocco",
    value: "MA",
  },
  {
    label: "Mozambique",
    value: "MZ",
  },
  {
    label: "Myanmar",
    value: "MM",
  },
  {
    label: "Namibia",
    value: "NA",
  },
  {
    label: "Nauru",
    value: "NR",
  },
  {
    label: "Nepal",
    value: "NP",
  },
  {
    label: "Netherlands",
    value: "NL",
  },
  {
    label: "New Caledonia",
    value: "NC",
  },
  {
    label: "New Zealand",
    value: "NZ",
  },
  {
    label: "Nicaragua",
    value: "NI",
  },
  {
    label: "Niger",
    value: "NE",
  },
  {
    label: "Nigeria",
    value: "NG",
  },
  {
    label: "Niue",
    value: "NU",
  },
  {
    label: "Norfolk Island",
    value: "NF",
  },
  {
    label: "Northern Mariana Islands",
    value: "MP",
  },
  {
    label: "Norway",
    value: "NO",
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
    label: "Palau",
    value: "PW",
  },
  {
    label: "Palestine, State of",
    value: "PS",
  },
  {
    label: "Panama",
    value: "PA",
  },
  {
    label: "Papua New Guinea",
    value: "PG",
  },
  {
    label: "Paraguay",
    value: "PY",
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
    label: "Pitcairn",
    value: "PN",
  },
  {
    label: "Poland",
    value: "PL",
  },
  {
    label: "Portugal",
    value: "PT",
  },
  {
    label: "Puerto Rico",
    value: "PR",
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
    label: "Saint Barthélemy",
    value: "BL",
  },
  {
    label: "Saint Helena, Ascension and Tristan da Cunha",
    value: "SH",
  },
  {
    label: "Saint Kitts and Nevis",
    value: "KN",
  },
  {
    label: "Saint Lucia",
    value: "LC",
  },
  {
    label: "Saint Martin (French part)",
    value: "MF",
  },
  {
    label: "Saint Pierre and Miquelon",
    value: "PM",
  },
  {
    label: "Saint Vincent and the Grenadines",
    value: "VC",
  },
  {
    label: "Samoa",
    value: "WS",
  },
  {
    label: "San Marino",
    value: "SM",
  },
  {
    label: "Sao Tome and Principe",
    value: "ST",
  },
  {
    label: "Saudi Arabia",
    value: "SA",
  },
  {
    label: "Senegal",
    value: "SN",
  },
  {
    label: "Serbia",
    value: "RS",
  },
  {
    label: "Seychelles",
    value: "SC",
  },
  {
    label: "Sierra Leone",
    value: "SL",
  },
  {
    label: "Singapore",
    value: "SG",
  },
  {
    label: "Sint Maarten (Dutch part)",
    value: "SX",
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
    label: "Solomon Islands",
    value: "SB",
  },
  {
    label: "Somalia",
    value: "SO",
  },
  {
    label: "South Africa",
    value: "ZA",
  },
  {
    label: "South Georgia and the South Sandwich Islands",
    value: "GS",
  },
  {
    label: "South Sudan",
    value: "SS",
  },
  {
    label: "Spain",
    value: "ES",
  },
  {
    label: "Sri Lanka",
    value: "LK",
  },
  {
    label: "Sudan",
    value: "SD",
  },
  {
    label: "Suriname",
    value: "SR",
  },
  {
    label: "Svalbard and Jan Mayen",
    value: "SJ",
  },
  {
    label: "Swaziland",
    value: "SZ",
  },
  {
    label: "Sweden",
    value: "SE",
  },
  {
    label: "Switzerland",
    value: "CH",
  },
  {
    label: "Taiwan, Province of China",
    value: "TW",
  },
  {
    label: "Tajikistan",
    value: "TJ",
  },
  {
    label: "Tanzania, United Republic of",
    value: "TZ",
  },
  {
    label: "Thailand",
    value: "TH",
  },
  {
    label: "Timor-Leste",
    value: "TL",
  },
  {
    label: "Togo",
    value: "TG",
  },
  {
    label: "Tokelau",
    value: "TK",
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
    label: "Turkmenistan",
    value: "TM",
  },
  {
    label: "Turks and Caicos Islands",
    value: "TC",
  },
  {
    label: "Tuvalu",
    value: "TV",
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
    label: "United Arab Emirates",
    value: "AE",
  },
  {
    label: "United Kingdom",
    value: "GB",
  },
  {
    label: "United States",
    value: "US",
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
    label: "Uzbekistan",
    value: "UZ",
  },
  {
    label: "Vanuatu",
    value: "VU",
  },
  {
    label: "Venezuela, Bolivarian Republic of",
    value: "VE",
  },
  {
    label: "Viet Nam",
    value: "VN",
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
    label: "Wallis and Futuna",
    value: "WF",
  },
  {
    label: "Western Sahara",
    value: "EH",
  },
  {
    label: "Yemen",
    value: "YE",
  },
  {
    label: "Zambia",
    value: "ZM",
  },
  {
    label: "Zimbabwe",
    value: "ZW",
  },
];

const STATE_CODES = [
  {
    label: "Alabama",
    value: "AL",
  },
  {
    label: "Alaska",
    value: "AK",
  },
  {
    label: "American Samoa",
    value: "AS",
  },
  {
    label: "Arizona",
    value: "AZ",
  },
  {
    label: "Arkansas",
    value: "AR",
  },
  {
    label: "California",
    value: "CA",
  },
  {
    label: "Colorado",
    value: "CO",
  },
  {
    label: "Connecticut",
    value: "CT",
  },
  {
    label: "Delaware",
    value: "DE",
  },
  {
    label: "District Of Columbia",
    value: "DC",
  },
  {
    label: "Federated States Of Micronesia",
    value: "FM",
  },
  {
    label: "Florida",
    value: "FL",
  },
  {
    label: "Georgia",
    value: "GA",
  },
  {
    label: "Guam",
    value: "GU",
  },
  {
    label: "Hawaii",
    value: "HI",
  },
  {
    label: "Idaho",
    value: "ID",
  },
  {
    label: "Illinois",
    value: "IL",
  },
  {
    label: "Indiana",
    value: "IN",
  },
  {
    label: "Iowa",
    value: "IA",
  },
  {
    label: "Kansas",
    value: "KS",
  },
  {
    label: "Kentucky",
    value: "KY",
  },
  {
    label: "Louisiana",
    value: "LA",
  },
  {
    label: "Maine",
    value: "ME",
  },
  {
    label: "Marshall Islands",
    value: "MH",
  },
  {
    label: "Maryland",
    value: "MD",
  },
  {
    label: "Massachusetts",
    value: "MA",
  },
  {
    label: "Michigan",
    value: "MI",
  },
  {
    label: "Minnesota",
    value: "MN",
  },
  {
    label: "Mississippi",
    value: "MS",
  },
  {
    label: "Missouri",
    value: "MO",
  },
  {
    label: "Montana",
    value: "MT",
  },
  {
    label: "Nebraska",
    value: "NE",
  },
  {
    label: "Nevada",
    value: "NV",
  },
  {
    label: "New Hampshire",
    value: "NH",
  },
  {
    label: "New Jersey",
    value: "NJ",
  },
  {
    label: "New Mexico",
    value: "NM",
  },
  {
    label: "New York",
    value: "NY",
  },
  {
    label: "North Carolina",
    value: "NC",
  },
  {
    label: "North Dakota",
    value: "ND",
  },
  {
    label: "Northern Mariana Islands",
    value: "MP",
  },
  {
    label: "Ohio",
    value: "OH",
  },
  {
    label: "Oklahoma",
    value: "OK",
  },
  {
    label: "Oregon",
    value: "OR",
  },
  {
    label: "Palau",
    value: "PW",
  },
  {
    label: "Pennsylvania",
    value: "PA",
  },
  {
    label: "Puerto Rico",
    value: "PR",
  },
  {
    label: "Rhode Island",
    value: "RI",
  },
  {
    label: "South Carolina",
    value: "SC",
  },
  {
    label: "South Dakota",
    value: "SD",
  },
  {
    label: "Tennessee",
    value: "TN",
  },
  {
    label: "Texas",
    value: "TX",
  },
  {
    label: "Utah",
    value: "UT",
  },
  {
    label: "Vermont",
    value: "VT",
  },
  {
    label: "Virgin Islands",
    value: "VI",
  },
  {
    label: "Virginia",
    value: "VA",
  },
  {
    label: "Washington",
    value: "WA",
  },
  {
    label: "West Virginia",
    value: "WV",
  },
  {
    label: "Wisconsin",
    value: "WI",
  },
  {
    label: "Wyoming",
    value: "WY",
  },
  {
    label: "AA",
    value: "AA",
  },
  {
    label: "AE",
    value: "AE",
  },
  {
    label: "AP",
    value: "AP",
  },
  {
    label: "Alberta",
    value: "AB",
  },
  {
    label: "British Colombia",
    value: "BC",
  },
  {
    label: "Manitoba",
    value: "MB",
  },
  {
    label: "New Brunswick",
    value: "NB",
  },
  {
    label: "Newfoundland and Labrador",
    value: "NL",
  },
  {
    label: "Nova Scotia",
    value: "NS",
  },
  {
    label: "Northwest Territories",
    value: "NT",
  },
  {
    label: "Nunavut",
    value: "NU",
  },
  {
    label: "Ontario",
    value: "ON",
  },
  {
    label: "Prince Edward Island",
    value: "PE",
  },
  {
    label: "Québec",
    value: "QC",
  },
  {
    label: "Saskatchewan",
    value: "SK",
  },
  {
    label: "Yukon",
    value: "YT",
  },
];

const PACKAGE_TYPES = [
  {
    label: "Pallet (48\" x 40\")",
    value: "pallet_48x40",
  },
  {
    label: "Pallet (48\" x 48\")",
    value: "pallet_48x48",
  },
  {
    label: "Pallet (Custom Dimensions)",
    value: "pallet_custom",
  },
  {
    label: "Bag",
    value: "bag",
  },
  {
    label: "Bale",
    value: "bale",
  },
  {
    label: "Box",
    value: "box",
  },
  {
    label: "Crate",
    value: "crate",
  },
  {
    label: "Cylinder",
    value: "cylinder",
  },
  {
    label: "Drum",
    value: "drum",
  },
  {
    label: "Pail",
    value: "pail",
  },
  {
    label: "Reel",
    value: "reel",
  },
  {
    label: "Roll",
    value: "roll",
  },
  {
    label: "Loose",
    value: "loose",
  },
];

export default {
  INSURANCE_CARRIERS,
  COUNTRY_CODES,
  STATE_CODES,
  PACKAGE_TYPES,
};
