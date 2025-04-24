export default {
  aSingleWordString: {
    value: "wrgwgwepkgprgprpwnwwrehwrh",
    jsType: "string",
    extendedType: "singleWordString",
  },
  aMultiWordString: {
    value: "etheth etphmpethm ethpethm",
    jsType: "string",
    extendedType: "aMultiWordString",
  },
  aPositiveInteger: {
    value: 15115,
    jsType: "number",
    extendedType: "positiveInteger",
  },
  aNegativeInteger: {
    value: -15115,
    jsType: "number",
    extendedType: "negativeInteger",
  },
  aPositiveFloat: {
    value: 12.155,
    jsType: "number",
    extendedType: "positiveFloat",
  },
  aNegativeFloat: {
    value: -12.155,
    jsType: "number",
    extendedType: "negativeFloat",
  },
  aZero: {
    value: 0,
    jsType: "number",
    extendedType: "zero",
  },
  anArray: {
    value: [
      13135,
      35.15,
      "3feqe",
      [
        1,
        2,
        3,
      ],
      {
        some: "val",
      },
      0,
    ],
    jsType: "object",
    extendedType: "trueArray",
  },

  anArrayOfStrings: {
    value: [
      "string1",
      "string2",
      "string3",
    ],
    jsType: "object",
    extendedType: "arrayOfStrings",
  },
  anObject: {
    value: {
      some: "val",
      some2: 23,
      some3: [
        1,
        2,
        3,
      ],
    },
    jsType: "object",
    extendedType: "trueObject",
  },

  anEmptyString: {
    value: "",
    jsType: "string",
    extendedType: "emptyString",
  },

  aSpace: {
    value: " ",
    jsType: "string",
    extendedType: "space",
  },

  aValidYMDDashDate: {
    value: "2025-05-28",
    jsType: "string",
    extendedType: "ymdDashDate",
  },

  aCharinYMDDashDate: {
    value: "20G5-h5-28",
    jsType: "string",
    extendedType: "ymdDashDate",
  },

  aShortYearYMDDashDate: {
    value: "20-23-28",
    jsType: "string",
    extendedType: "ymdDashDate",
  },

  aMonthOusideValYMDDashDate: {
    value: "2025-23-28",
    jsType: "string",
    extendedType: "ymdDashDate",
  },

  aDayOusideValYMDDashDate: {
    value: "2025-12-56",
    jsType: "string",
    extendedType: "ymdDashDate",
  },

  anInvalidSeparatorYMDDashDate: {
    value: "2025/12.56",
    jsType: "string",
    extendedType: "ymdDashDate",
  },

};

