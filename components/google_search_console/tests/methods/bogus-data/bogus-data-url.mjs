export default {
    aSingleWordString : {
      value: "wrgwgwepkgprgprpwnwwrehwrh",
      jsType : "string",
      extendedType : "singleWordString",
    },
    aMultiWordString : {
      value: "etheth etphmpethm ethpethm",
      jsType : "string",
      extendedType : "aMultiWordString",
    },
    aPositiveInteger : {
      value:15115,
      jsType: "number",
      extendedType : "positiveInteger",
    } ,
    aNegativeInteger : {
      value:-15115,
      jsType: "number",
      extendedType : "negativeInteger",
    } ,
    aPositiveFloat : {
      value:12.155,
      jsType: "number",
      extendedType : "positiveFloat",
    } ,
    aNegativeFloat : {
      value:-12.155,
      jsType: "number",
      extendedType : "negativeFloat",
    } ,
    aZero : {
      value:0,
      jsType: "number",
      extendedType : "zero",
    } ,
    anArray : {
      value : [13135, 35.15, "3feqe", [1,2,3], {some:"val"}, 0],
      jsType : "object",
      extendedType : "trueArray"
    },

    anArrayOfStrings : {
      value : ["string1", "string2", "string3"],
      jsType : "object",
      extendedType : "arrayOfStrings"
    },
    anObject : {
      value : {some: "val", some2: 23, some3 : [1,2,3]},
      jsType : "object",
      extendedType : "trueObject"
    },

    anEmptyString : {
      value : "",
      jsType : "string",
      extendedType : "emptyString"
    },

    aSpace : {
      value : " ",
      jsType : "string",
      extendedType : "space"
    },

    aValidHttpUrl : {
      value :  "http://example.com",
      jsType : "string",
      extendedType : "url"
    },

    aValidHttpsUrl : {
      value :  "https://example.com",
      jsType : "string",
      extendedType : "url"
    },
    
    aValidUrlWithoutProtocol : {
      value :  "example.com",
      jsType : "string",
      extendedType : "url"
    },
    anUrlWithSpace : {
      value :  "https://exa mple.com",
      jsType : "string",
      extendedType : "url"
    },

    aReverseSlashUrl : {
      value :   "http://example.com\\path",
      jsType : "string",
      extendedType : "url"
    },

    aOneSlashUrl : {
      value :   "http:/example.com",
      jsType : "string",
      extendedType : "url"
    },

    aValidUrlWithDubiousCharacters : {
      value :   `http://example.com\\<script>{value}|"stuff"^^^\u200Bmiddle\u200Czone\u200D\u2060\uFEFF\u00A0end?param="weird"`,
      jsType : "string",
      extendedType : "url"
    },

};



  