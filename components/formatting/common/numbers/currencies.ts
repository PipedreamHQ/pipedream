const CURRENCIES = [
  {
    name: "United States dollar",
    symbol: "$",
    iso: "USD",
  },
  {
    name: "Euro",
    symbol: "€",
    iso: "EUR",
  },
  {
    name: "Japanese yen",
    symbol: "¥",
    iso: "JPY",
  },
  {
    name: "Brazilian real",
    symbol: "R$",
    iso: "BRL",
  },
  {
    name: "Russian ruble",
    symbol: "₽",
    iso: "RUB",
  },
  {
    name: "Sterling",
    symbol: "£",
    iso: "GBP",
  },
  {
    name: "Canadian dollar",
    symbol: "$",
    iso: "CAD",
  },
  {
    name: "Afghan afghani",
    symbol: "Af",
    iso: "AFN",
  },
  {
    name: "Albanian lek",
    symbol: "Lek",
    iso: "ALL",
  },
  {
    name: "Algerian dinar",
    symbol: "DA",
    iso: "DZD",
  },
  {
    name: "Angolan kwanza",
    symbol: "Kz",
    iso: "AOA",
  },
  {
    name: "Eastern Caribbean dollar",
    symbol: "$",
    iso: "XCD",
  },
  {
    name: "Argentine peso",
    symbol: "$",
    iso: "ARS",
  },
  {
    name: "Armenian dram",
    symbol: "֏",
    iso: "AMD",
  },
  {
    name: "Aruban florin",
    symbol: "ƒ",
    iso: "AWG",
  },
  {
    name: "Saint Helena pound",
    symbol: "£",
    iso: "SHP",
  },
  {
    name: "Australian dollar",
    symbol: "$",
    iso: "AUD",
  },
  {
    name: "Azerbaijani manat",
    symbol: "₼",
    iso: "AZN",
  },
  {
    name: "Bahamian dollar",
    symbol: "$",
    iso: "BSD",
  },
  {
    name: "Bahraini dinar",
    symbol: "BD",
    iso: "BHD",
  },
  {
    name: "Bangladeshi taka",
    symbol: "৳",
    iso: "BDT",
  },
  {
    name: "Barbadian dollar",
    symbol: "$",
    iso: "BBD",
  },
  {
    name: "Belarusian ruble",
    symbol: "Rbl",
    iso: "BYN",
  },
  {
    name: "Belize dollar",
    symbol: "$",
    iso: "BZD",
  },
  {
    name: "West African CFA franc",
    symbol: "Fr",
    iso: "XOF",
  },
  {
    name: "Bermudian dollar",
    symbol: "$",
    iso: "BMD",
  },
  {
    name: "Bhutanese ngultrum",
    symbol: "Nu",
    iso: "BTN",
  },
  {
    name: "Indian rupee",
    symbol: "₹",
    iso: "INR",
  },
  {
    name: "Bolivian boliviano",
    symbol: "Bs",
    iso: "BOB",
  },
  {
    name: "Bosnia and Herzegovina convertible mark",
    symbol: "KM",
    iso: "BAM",
  },
  {
    name: "Botswana pula",
    symbol: "P",
    iso: "BWP",
  },
  {
    name: "Brunei dollar",
    symbol: "$",
    iso: "BND",
  },
  {
    name: "Singapore dollar",
    symbol: "$",
    iso: "SGD",
  },
  {
    name: "Bulgarian lev",
    symbol: "Lev",
    iso: "BGN",
  },
  {
    name: "Burundian franc",
    symbol: "Fr",
    iso: "BIF",
  },
  {
    name: "Cambodian riel",
    symbol: "CR",
    iso: "KHR",
  },
  {
    name: "Central African CFA franc",
    symbol: "Fr",
    iso: "XAF",
  },
  {
    name: "Cape Verdean escudo",
    symbol: "$",
    iso: "CVE",
  },
  {
    name: "Cayman Islands dollar",
    symbol: "$",
    iso: "KYD",
  },
  {
    name: "Chilean peso",
    symbol: "$",
    iso: "CLP",
  },
  {
    name: "Renminbi",
    symbol: "¥",
    iso: "CNY",
  },
  {
    name: "Colombian peso",
    symbol: "$",
    iso: "COP",
  },
  {
    name: "Comorian franc",
    symbol: "Fr",
    iso: "KMF",
  },
  {
    name: "Congolese franc",
    symbol: "Fr",
    iso: "CDF",
  },
  {
    name: "New Zealand dollar",
    symbol: "$",
    iso: "NZD",
  },
  {
    name: "Costa Rican colón",
    symbol: "₡",
    iso: "CRC",
  },
  {
    name: "Cuban peso",
    symbol: "$",
    iso: "CUP",
  },
  {
    name: "Netherlands Antillean guilder",
    symbol: "ƒ",
    iso: "ANG",
  },
  {
    name: "Czech koruna",
    symbol: "Kč",
    iso: "CZK",
  },
  {
    name: "Danish krone",
    symbol: "kr",
    iso: "DKK",
  },
  {
    name: "Djiboutian franc",
    symbol: "Fr",
    iso: "DJF",
  },
  {
    name: "Dominican peso",
    symbol: "$",
    iso: "DOP",
  },
  {
    name: "Egyptian pound",
    symbol: "LE",
    iso: "EGP",
  },
  {
    name: "Eritrean nakfa",
    symbol: "Nkf",
    iso: "ERN",
  },
  {
    name: "Swazi lilangeni",
    symbol: "L",
    iso: "SZL",
  },
  {
    name: "South African rand",
    symbol: "R",
    iso: "ZAR",
  },
  {
    name: "Ethiopian birr",
    symbol: "Br",
    iso: "ETB",
  },
  {
    name: "Falkland Islands pound",
    symbol: "£",
    iso: "FKP",
  },
  {
    name: "Fijian dollar",
    symbol: "$",
    iso: "FJD",
  },
  {
    name: "CFP franc",
    symbol: "Fr",
    iso: "XPF",
  },
  {
    name: "Gambian dalasi",
    symbol: "D",
    iso: "GMD",
  },
  {
    name: "Georgian lari",
    symbol: "₾",
    iso: "GEL",
  },
  {
    name: "Ghanaian cedi",
    symbol: "₵",
    iso: "GHS",
  },
  {
    name: "Gibraltar pound",
    symbol: "£",
    iso: "GIP",
  },
  {
    name: "Guatemalan quetzal",
    symbol: "Q",
    iso: "GTQ",
  },
  {
    name: "Guinean franc",
    symbol: "Fr",
    iso: "GNF",
  },
  {
    name: "Guyanese dollar",
    symbol: "$",
    iso: "GYD",
  },
  {
    name: "Haitian gourde",
    symbol: "G",
    iso: "HTG",
  },
  {
    name: "Honduran lempira",
    symbol: "L",
    iso: "HNL",
  },
  {
    name: "Hong Kong dollar",
    symbol: "$",
    iso: "HKD",
  },
  {
    name: "Hungarian forint",
    symbol: "Ft",
    iso: "HUF",
  },
  {
    name: "Icelandic króna",
    symbol: "kr",
    iso: "ISK",
  },
  {
    name: "Indonesian rupiah",
    symbol: "Rp",
    iso: "IDR",
  },
  {
    name: "Iranian rial",
    symbol: "Rl",
    iso: "IRR",
  },
  {
    name: "Iraqi dinar",
    symbol: "ID",
    iso: "IQD",
  },
  {
    name: "Israeli new shekel",
    symbol: "₪",
    iso: "ILS",
  },
  {
    name: "Jamaican dollar",
    symbol: "$",
    iso: "JMD",
  },
  {
    name: "Jordanian dinar",
    symbol: "JD",
    iso: "JOD",
  },
  {
    name: "Kazakhstani tenge",
    symbol: "₸",
    iso: "KZT",
  },
  {
    name: "Kenyan shilling",
    symbol: "Sh",
    iso: "KES",
  },
  {
    name: "North Korean won",
    symbol: "₩",
    iso: "KPW",
  },
  {
    name: "South Korean won",
    symbol: "₩",
    iso: "KRW",
  },
  {
    name: "Kuwaiti dinar",
    symbol: "KD",
    iso: "KWD",
  },
  {
    name: "Kyrgyz som",
    symbol: "som",
    iso: "KGS",
  },
  {
    name: "Lao kip",
    symbol: "₭",
    iso: "LAK",
  },
  {
    name: "Lebanese pound",
    symbol: "LL",
    iso: "LBP",
  },
  {
    name: "Lesotho loti",
    symbol: "L",
    iso: "LSL",
  },
  {
    name: "Liberian dollar",
    symbol: "$",
    iso: "LRD",
  },
  {
    name: "Libyan dinar",
    symbol: "LD",
    iso: "LYD",
  },
  {
    name: "Swiss franc",
    symbol: "Fr",
    iso: "CHF",
  },
  {
    name: "Macanese pataca",
    symbol: "MOP$",
    iso: "MOP",
  },
  {
    name: "Malagasy ariary",
    symbol: "Ar",
    iso: "MGA",
  },
  {
    name: "Malawian kwacha",
    symbol: "K",
    iso: "MWK",
  },
  {
    name: "Malaysian ringgit",
    symbol: "RM",
    iso: "MYR",
  },
  {
    name: "Maldivian rufiyaa",
    symbol: "Rf",
    iso: "MVR",
  },
  {
    name: "Mauritanian ouguiya",
    symbol: "UM",
    iso: "MRU",
  },
  {
    name: "Mauritian rupee",
    symbol: "Re",
    iso: "MUR",
  },
  {
    name: "Mexican peso",
    symbol: "$",
    iso: "MXN",
  },
  {
    name: "Moldovan leu",
    symbol: "Leu",
    iso: "MDL",
  },
  {
    name: "Mongolian tögrög",
    symbol: "₮",
    iso: "MNT",
  },
  {
    name: "Moroccan dirham",
    symbol: "DH",
    iso: "MAD",
  },
  {
    name: "Mozambican metical",
    symbol: "Mt",
    iso: "MZN",
  },
  {
    name: "Burmese kyat",
    symbol: "K",
    iso: "MMK",
  },
  {
    name: "Namibian dollar",
    symbol: "$",
    iso: "NAD",
  },
  {
    name: "Nepalese rupee",
    symbol: "Re",
    iso: "NPR",
  },
  {
    name: "Nicaraguan córdoba",
    symbol: "C$",
    iso: "NIO",
  },
  {
    name: "Nigerian naira",
    symbol: "₦",
    iso: "NGN",
  },
  {
    name: "Macedonian denar",
    symbol: "DEN",
    iso: "MKD",
  },
  {
    name: "Turkish lira",
    symbol: "₺",
    iso: "TRY",
  },
  {
    name: "Norwegian krone",
    symbol: "kr",
    iso: "NOK",
  },
  {
    name: "Omani rial",
    symbol: "RO",
    iso: "OMR",
  },
  {
    name: "Pakistani rupee",
    symbol: "Re",
    iso: "PKR",
  },
  {
    name: "Panamanian balboa",
    symbol: "B/",
    iso: "PAB",
  },
  {
    name: "Papua New Guinean kina",
    symbol: "K",
    iso: "PGK",
  },
  {
    name: "Paraguayan guaraní",
    symbol: "₲",
    iso: "PYG",
  },
  {
    name: "Peruvian sol",
    symbol: "S/",
    iso: "PEN",
  },
  {
    name: "Philippine peso",
    symbol: "₱",
    iso: "PHP",
  },
  {
    name: "Polish złoty",
    symbol: "zł",
    iso: "PLN",
  },
  {
    name: "Qatari riyal",
    symbol: "QR",
    iso: "QAR",
  },
  {
    name: "Romanian leu",
    symbol: "Leu",
    iso: "RON",
  },
  {
    name: "Rwandan franc",
    symbol: "Fr",
    iso: "RWF",
  },
  {
    name: "Samoan tālā",
    symbol: "$",
    iso: "WST",
  },
  {
    name: "São Tomé and Príncipe dobra",
    symbol: "Db",
    iso: "STN",
  },
  {
    name: "Saudi riyal",
    symbol: "Rl",
    iso: "SAR",
  },
  {
    name: "Serbian dinar",
    symbol: "DIN",
    iso: "RSD",
  },
  {
    name: "Seychellois rupee",
    symbol: "Re",
    iso: "SCR",
  },
  {
    name: "Sierra Leonean leone",
    symbol: "Le",
    iso: "SLE",
  },
  {
    name: "Solomon Islands dollar",
    symbol: "$",
    iso: "SBD",
  },
  {
    name: "Somali shilling",
    symbol: "Sh",
    iso: "SOS",
  },
  {
    name: "Sri Lankan rupee",
    symbol: "Re",
    iso: "LKR",
  },
  {
    name: "Sudanese pound",
    symbol: "LS",
    iso: "SDG",
  },
  {
    name: "Surinamese dollar",
    symbol: "$",
    iso: "SRD",
  },
  {
    name: "Swedish krona",
    symbol: "kr",
    iso: "SEK",
  },
  {
    name: "Syrian pound",
    symbol: "LS",
    iso: "SYP",
  },
  {
    name: "New Taiwan dollar",
    symbol: "$",
    iso: "TWD",
  },
  {
    name: "Tajikistani somoni",
    symbol: "SM",
    iso: "TJS",
  },
  {
    name: "Tanzanian shilling",
    symbol: "Sh",
    iso: "TZS",
  },
  {
    name: "Thai baht",
    symbol: "฿",
    iso: "THB",
  },
  {
    name: "Tongan pa'anga",
    symbol: "T$",
    iso: "TOP",
  },
  {
    name: "Trinidad and Tobago dollar",
    symbol: "$",
    iso: "TTD",
  },
  {
    name: "Tunisian dinar",
    symbol: "DT",
    iso: "TND",
  },
  {
    name: "Turkmenistani manat",
    symbol: "m",
    iso: "TMT",
  },
  {
    name: "Ugandan shilling",
    symbol: "Sh",
    iso: "UGX",
  },
  {
    name: "Ukrainian hryvnia",
    symbol: "₴",
    iso: "UAH",
  },
  {
    name: "United Arab Emirates dirham",
    symbol: "Dh",
    iso: "AED",
  },
  {
    name: "Uruguayan peso",
    symbol: "$",
    iso: "UYU",
  },
  {
    name: "Uzbekistani sum",
    symbol: "soum",
    iso: "UZS",
  },
  {
    name: "Vanuatu vatu",
    symbol: "VT",
    iso: "VUV",
  },
  {
    name: "Venezuelan sovereign bolívar",
    symbol: "Bs.S",
    iso: "VES",
  },
  {
    name: "Venezuelan digital bolívar",
    symbol: "Bs.D",
    iso: "VED",
  },
  {
    name: "Vietnamese đồng",
    symbol: "₫",
    iso: "VND",
  },
  {
    name: "Yemeni rial",
    symbol: "Rl",
    iso: "YER",
  },
  {
    name: "Zambian kwacha",
    symbol: "K",
    iso: "ZMW",
  },
];

export const CURRENCY_OPTIONS = CURRENCIES.map(({
  name, symbol, iso,
}) => ({
  label: name,
  value: `${iso} - ${symbol} - ${name}`,
}));
