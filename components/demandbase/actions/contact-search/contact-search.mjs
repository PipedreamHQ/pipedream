import app from "../../demandbase.app.mjs";
import states from "../../common/states.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "demandbase-contact-search",
  name: "Contact Search",
  description: "Fetch a list of contacts. [See the documentation](https://kb.demandbase.com/hc/en-us/articles/7274525391515--GET-Contact-Search).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "**Email**, **Last Name** or **Full Name** should be present in the search query.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Contact last name.",
      optional: true,
    },
    fullName: {
      type: "string",
      label: "Full Name",
      description: "Contact full name.",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Contact first name.",
      optional: true,
    },
    middleName: {
      type: "string",
      label: "Middle Name",
      description: "Contact middle name.",
      optional: true,
    },
    country: {
      label: "Country",
      description: "Country name.",
      propDefinition: [
        app,
        "countryId",
        () => ({
          mapper: ({ countryName }) => countryName,
        }),
      ],
    },
    state: {
      type: "string",
      label: "State",
      description: "State name for company search.",
      optional: true,
      options: states.map(({ label }) => label),
    },
    city: {
      type: "string",
      label: "City",
      description: "City Name of company search.",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "Zip code for company search.",
      optional: true,
    },
    peopleCountries: {
      type: "string[]",
      label: "People Countries",
      description: "People country Ids.",
      propDefinition: [
        app,
        "countryId",
      ],
    },
    peopleStates: {
      type: "string[]",
      label: "People States",
      description: "People states.",
      optional: true,
      options: states,
    },
    peopleCities: {
      type: "string[]",
      label: "People Cities",
      description: "People Cities.",
      optional: true,
    },
    peopleArea: {
      type: "string",
      label: "People Area",
      description: "Area for the search.",
      optional: true,
    },
    peopleAddress: {
      type: "string",
      label: "People Address",
      description: "Address for the search.",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Contact current Company Name",
      optional: true,
    },
    companyWebsite: {
      type: "string",
      label: "Company Website",
      description: "Contact current Company website (Only as Relevence filter).",
      optional: true,
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "If present will return only **active** or **inactive** records, depending on the value (true or false)",
      optional: true,
    },
    isEmailRequired: {
      type: "boolean",
      label: "Is Email Required",
      description: "If present and equals to `true`, the API will return only contact having an email address.",
      optional: true,
    },
    isPhoneRequired: {
      type: "boolean",
      label: "Is Phone Required",
      description: "If present and equals to `true`, the API will return only contact having a phone number.",
      optional: true,
    },
    emailValidationStatus: {
      type: "string[]",
      label: "Email Validation Status",
      description: "It allows you to retrieve the validation status of the email.",
      optional: true,
      options: [
        "ValidDomain",
        "ValidEmail",
      ],
    },
    minContactConfidenceScore: {
      type: "integer",
      label: "Min Contact Confidence Score",
      description: "The minimum contact confidence score. The valid values range from `0` to `100`.",
      optional: true,
      min: 0,
      max: 100,
    },
    maxContactConfidenceScore: {
      type: "integer",
      label: "Max Contact Confidence Score",
      description: "The maximum contact confidence score. The valid values range from `0` to `100`.",
      optional: true,
      min: 0,
      max: 100,
    },
    phoneType: {
      type: "string",
      label: "Phone Type",
      description: "Accepts DIRECT, CORP, MOBILE, and ANY to find the corresponding contact's phone numbers.",
      optional: true,
      options: [
        "DIRECT",
        "CORP",
        "MOBILE",
        "ANY",
      ],
    },
    titles: {
      type: "string",
      label: "Titles",
      description: "Return the job titles of an executive.",
      optional: true,
    },
  },
  methods: {
    contactSearch(args = {}) {
      return this.app._makeRequest({
        path: "/contacts",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      contactSearch,
      email,
      lastName,
      firstName,
      middleName,
      fullName,
      country,
      state,
      city,
      zip,
      peopleCountries,
      peopleStates,
      peopleCities,
      peopleArea,
      peopleAddress,
      companyName,
      companyWebsite,
      active,
      isEmailRequired,
      isPhoneRequired,
      emailValidationStatus,
      minContactConfidenceScore,
      maxContactConfidenceScore,
      phoneType,
      titles,
    } = this;

    const response = await contactSearch({
      $,
      params: {
        email,
        lastName,
        firstName,
        middleName,
        fullName,
        country,
        state,
        city,
        zip,
        peopleCountries: utils.arrayToCommaSeparatedList(peopleCountries),
        peopleStates: utils.arrayToCommaSeparatedList(peopleStates),
        peopleCities: utils.arrayToCommaSeparatedList(peopleCities),
        peopleArea,
        peopleAddress,
        companyName,
        companyWebsite,
        active,
        isEmailRequired,
        isPhoneRequired,
        emailValidationStatus: utils.arrayToCommaSeparatedList(emailValidationStatus),
        minContactConfidenceScore,
        maxContactConfidenceScore,
        phoneType,
        titles,
        resultsPerPage: 50,
      },
    });
    $.export("$summary", "Successfully fetched contacts.");
    return response;
  },
};
