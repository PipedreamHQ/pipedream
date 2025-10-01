import enrow from "../../enrow.app.mjs";

export default {
  key: "enrow-find-single-email",
  name: "Find Single Email",
  description: "Executes a single email search using Enrow email finder. [See the documentation](https://enrow.readme.io/reference/find-single-email)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    enrow,
    fullname: {
      type: "string",
      label: "Full Name",
      description: "The fullname of the person for which to find the email",
    },
    alert: {
      type: "alert",
      alertType: "info",
      content: "Each search needs at least the Company Domain or the Company Name to be given. The Company Domain will usually offer the best results, you can provide both if you want to optimize the results.",
    },
    companyDomain: {
      type: "string",
      label: "Company Domain",
      description: "The company's domain, multiple formats accepted (\"apple.com\", \"https://www.apple.com\"...)",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The company's name (\"Apple\", \"Air France\", ...)",
      optional: true,
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The ISO 3166 Alpha-2 code of the country related to the search. Relevant when using a company name.",
      optional: true,
    },
    retrieveCompanyInfo: {
      type: "boolean",
      label: "Retrieve Company Info",
      description: "Available for France only right now. If the email is a French company, it will send back a whole bunch of informations about it.",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "A URL that will be notified through an http POST request once the single search is finished",
      optional: true,
    },
    callbackWithRerun: {
      type: "boolean",
      label: "Callback With Rerun",
      description: "Use the `$.flow.rerun` Node.js helper to rerun the step when the search is completed. Overrides the `webhookUrl` prop. This will increase execution time and credit usage as a result. [See the documentation(https://pipedream.com/docs/code/nodejs/rerun/#flow-rerun). Not available in Pipedream Connect.",
      optional: true,
    },
  },
  async run({ $ }) {
    let response;
    const context = $.context;
    const run = context
      ? context.run
      : {
        runs: 1,
      };
    if (run.runs === 1) {
      let webhook  = this.webhookUrl;
      if (context && this.callbackWithRerun) {
        ({ resume_url: webhook } = $.flow.rerun(600000, null, 1));
      }
      response = await this.enrow.executeSearch({
        $,
        data: {
          fullname: this.fullname,
          company_domain: this.companyDomain,
          company_name: this.companyName,
          settings: {
            country_code: this.countryCode,
            retrieve_company_info: this.retrieveCompanyInfo,
            webhook,
          },
        },
      });
    }

    if (run.callback_request) {
      response = run.callback_request.body;
    }

    $.export("$summary", "Successfully executed search.");
    return response;
  },
};
