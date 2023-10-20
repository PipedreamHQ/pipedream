const TIME_ZONES = [
  {
    label: "(GMT-11:00) Midway Island, Samoa",
    value: "Pacific/Midway",
  },
  {
    label: "(GMT-10:00) Hawaii",
    value: "Pacific/Honolulu",
  },
  {
    label: "(GMT-8:00) Alaska",
    value: "America/Juneau",
  },
  {
    label: "(GMT-7:00) Dawson, Yukon",
    value: "America/Dawson",
  },
  {
    label: "(GMT-7:00) Arizona",
    value: "America/Phoenix",
  },
  {
    label: "(GMT-7:00) Tijuana",
    value: "America/Tijuana",
  },
  {
    label: "(GMT-7:00) Pacific Time",
    value: "America/Los_Angeles",
  },
  {
    label: "(GMT-6:00) Mountain Time",
    value: "America/Boise",
  },
  {
    label: "(GMT-6:00) Chihuahua, La Paz, Mazatlan",
    value: "America/Chihuahua",
  },
  {
    label: "(GMT-6:00) Saskatchewan",
    value: "America/Regina",
  },
  {
    label: "(GMT-6:00) Central America",
    value: "America/Belize",
  },
  {
    label: "(GMT-5:00) Central Time",
    value: "America/Chicago",
  },
  {
    label: "(GMT-5:00) Guadalajara, Mexico City, Monterrey",
    value: "America/Mexico_City",
  },
  {
    label: "(GMT-5:00) Bogota, Lima, Quito",
    value: "America/Bogota",
  },
  {
    label: "(GMT-4:00) Eastern Time",
    value: "America/Detroit",
  },
  {
    label: "(GMT-4:00) Caracas, La Paz",
    value: "America/Caracas",
  },
  {
    label: "(GMT-3:00) Santiago",
    value: "America/Santiago",
  },
  {
    label: "(GMT-3:00) Brasilia",
    value: "America/Sao_Paulo",
  },
  {
    label: "(GMT-3:00) Montevideo",
    value: "America/Montevideo",
  },
  {
    label: "(GMT-3:00) Buenos Aires, Georgetown",
    value: "America/Argentina/Buenos_Aires",
  },
  {
    label: "(GMT-3:00) Asuncion",
    value: "America/Asuncion",
  },
  {
    label: "(GMT-2:30) Newfoundland and Labrador",
    value: "America/St_Johns",
  },
  {
    label: "(GMT-2:00) Greenland",
    value: "America/Godthab",
  },
  {
    label: "(GMT-1:00) Cape Verde Islands",
    value: "Atlantic/Cape_Verde",
  },
  {
    label: "(GMT+0:00) Azores",
    value: "Atlantic/Azores",
  },
  {
    label: "(GMT+0:00) UTC",
    value: "Etc/GMT",
  },
  {
    label: "(GMT+0:00) Casablanca, Monrovia",
    value: "Africa/Casablanca",
  },
  {
    label: "(GMT+1:00) Edinburgh, London",
    value: "Europe/London",
  },
  {
    label: "(GMT+1:00) Dublin",
    value: "Europe/Dublin",
  },
  {
    label: "(GMT+1:00) Lisbon",
    value: "Europe/Lisbon",
  },
  {
    label: "(GMT+1:00) Canary Islands",
    value: "Atlantic/Canary",
  },
  {
    label: "(GMT+1:00) West Central Africa",
    value: "Africa/Algiers",
  },
  {
    label: "(GMT+2:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague",
    value: "Europe/Belgrade",
  },
  {
    label: "(GMT+2:00) Sarajevo, Skopje, Warsaw, Zagreb",
    value: "Europe/Sarajevo",
  },
  {
    label: "(GMT+2:00) Brussels, Copenhagen, Madrid, Paris",
    value: "Europe/Brussels",
  },
  {
    label: "(GMT+2:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
    value: "Europe/Amsterdam",
  },
  {
    label: "(GMT+2:00) Cairo",
    value: "Africa/Cairo",
  },
  {
    label: "(GMT+2:00) Harare, Pretoria",
    value: "Africa/Harare",
  },
  {
    label: "(GMT+3:00) Bucharest",
    value: "Europe/Bucharest",
  },
  {
    label: "(GMT+3:00) Helsinki, Kiev, Riga, Sofia, Tallinn, Vilnius",
    value: "Europe/Helsinki",
  },
  {
    label: "(GMT+3:00) Athens, Minsk",
    value: "Europe/Athens",
  },
  {
    label: "(GMT+3:00) Jerusalem",
    value: "Asia/Jerusalem",
  },
  {
    label: "(GMT+3:00) Istanbul, Moscow, St. Petersburg, Volgograd",
    value: "Europe/Moscow",
  },
  {
    label: "(GMT+3:00) Kuwait, Riyadh",
    value: "Asia/Kuwait",
  },
  {
    label: "(GMT+3:00) Nairobi",
    value: "Africa/Nairobi",
  },
  {
    label: "(GMT+3:00) Baghdad",
    value: "Asia/Baghdad",
  },
  {
    label: "(GMT+3:30) Tehran",
    value: "Asia/Tehran",
  },
  {
    label: "(GMT+4:00) Abu Dhabi, Muscat",
    value: "Asia/Dubai",
  },
  {
    label: "(GMT+4:00) Baku, Tbilisi, Yerevan",
    value: "Asia/Baku",
  },
  {
    label: "(GMT+4:30) Kabul",
    value: "Asia/Kabul",
  },
  {
    label: "(GMT+5:00) Ekaterinburg",
    value: "Asia/Yekaterinburg",
  },
  {
    label: "(GMT+5:00) Islamabad, Karachi, Tashkent",
    value: "Asia/Karachi",
  },
  {
    label: "(GMT+5:30) Chennai, Kolkata, Mumbai, New Delhi",
    value: "Asia/Kolkata",
  },
  {
    label: "(GMT+5:30) Sri Jayawardenepura",
    value: "Asia/Colombo",
  },
  {
    label: "(GMT+5:45) Kathmandu",
    value: "Asia/Kathmandu",
  },
  {
    label: "(GMT+6:00) Astana, Dhaka",
    value: "Asia/Dhaka",
  },
  {
    label: "(GMT+6:00) Almaty, Novosibirsk",
    value: "Asia/Almaty",
  },
  {
    label: "(GMT+6:30) Yangon Rangoon",
    value: "Asia/Rangoon",
  },
  {
    label: "(GMT+7:00) Bangkok, Hanoi, Jakarta",
    value: "Asia/Bangkok",
  },
  {
    label: "(GMT+7:00) Krasnoyarsk",
    value: "Asia/Krasnoyarsk",
  },
  {
    label: "(GMT+8:00) Beijing, Chongqing, Hong Kong SAR, Urumqi",
    value: "Asia/Shanghai",
  },
  {
    label: "(GMT+8:00) Kuala Lumpur, Singapore",
    value: "Asia/Kuala_Lumpur",
  },
  {
    label: "(GMT+8:00) Taipei",
    value: "Asia/Taipei",
  },
  {
    label: "(GMT+8:00) Perth",
    value: "Australia/Perth",
  },
  {
    label: "(GMT+8:00) Irkutsk, Ulaanbaatar",
    value: "Asia/Irkutsk",
  },
  {
    label: "(GMT+9:00) Seoul",
    value: "Asia/Seoul",
  },
  {
    label: "(GMT+9:00) Osaka, Sapporo, Tokyo",
    value: "Asia/Tokyo",
  },
  {
    label: "(GMT+9:30) Darwin",
    value: "Australia/Darwin",
  },
  {
    label: "(GMT+10:00) Yakutsk",
    value: "Asia/Yakutsk",
  },
  {
    label: "(GMT+10:00) Brisbane",
    value: "Australia/Brisbane",
  },
  {
    label: "(GMT+10:00) Vladivostok",
    value: "Asia/Vladivostok",
  },
  {
    label: "(GMT+10:00) Guam, Port Moresby",
    value: "Pacific/Guam",
  },
  {
    label: "(GMT+10:30) Adelaide",
    value: "Australia/Adelaide",
  },
  {
    label: "(GMT+11:00) Canberra, Melbourne, Sydney",
    value: "Australia/Sydney",
  },
  {
    label: "(GMT+11:00) Hobart",
    value: "Australia/Hobart",
  },
  {
    label: "(GMT+11:00) Magadan, Solomon Islands, New Caledonia",
    value: "Asia/Magadan",
  },
  {
    label: "(GMT+12:00) Kamchatka, Marshall Islands",
    value: "Asia/Kamchatka",
  },
  {
    label: "(GMT+12:00) Fiji Islands",
    value: "Pacific/Fiji",
  },
  {
    label: "(GMT+13:00) Auckland, Wellington",
    value: "Pacific/Auckland",
  },
  {
    label: "(GMT+13:00) Nuku'alofa",
    value: "Pacific/Tongatapu",
  },
];

export default {
  TIME_ZONES,
};
