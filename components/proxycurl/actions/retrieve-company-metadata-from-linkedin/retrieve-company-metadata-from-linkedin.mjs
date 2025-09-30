import app from "../../proxycurl.app.mjs";

export default {
  name: "Retrieve Company Metadata from LinkedIn",
  description: "Retrieve Company Metadata from LinkedIn URL. Cost: 1 credit/successful request [See the documentation](https://nubela.co/proxycurl/docs#company-api-company-profile-endpoint).",
  key: "proxycurl-retrieve-company-metadata-from-linkedin",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    url: {
      type: "string",
      label: "LinkedIn URL",
      description: "URL of the LinkedIn Company Profile to crawl.",
    },
    resolveNumericId: {
      type: "boolean",
      label: "Resolve Numeric ID",
      description: "Enable support for Company Profile URLs with numerical IDs that you most frequently fetch from Sales Navigator. We achieve this by resolving numerical IDs into vanity IDs with cached company profiles from [LinkDB](https://nubela.co/proxycurl/linkdb).",
      optional: true,
      default: false,
    },
    categories: {
      type: "boolean",
      label: "Categories",
      description: "Appends categories data of this company. It costs 1 extra credit per request.",
      optional: true,
      default: false,
    },
    fundingData: {
      type: "boolean",
      label: "Funding Data",
      description: "Returns a list of funding rounds that this company has received. It costs 1 extra credit per request.",
      optional: true,
      default: false,
    },
    extra: {
      type: "boolean",
      label: "Extra",
      description: "Enriches the Company Profile with extra details from external sources. Details include Crunchbase ranking, contact email, phone number, Facebook account, Twitter account, funding rounds and amount, IPO status, investor information, etc... .It costs 1 extra credit per request.",
      optional: true,
      default: false,
    },
    exitData: {
      type: "boolean",
      label: "Exit Data",
      description: "Returns a list of investment portfolio exits. It costs 1 extra credit per request.",
      optional: true,
      default: false,
    },
    acquisitions: {
      type: "boolean",
      label: "Acquisitions",
      description: "Provides further enriched data on acquisitions made by this company from external sources. It costs 1 extra credit per request.",
      optional: true,
      default: false,
    },
    useCache: {
      type: "boolean",
      label: "Use Cache",
      description: "Fetches profile from cache regardless of age of profile. If profile is not available in cache, API will attempt to source profile externally. API will make a best effort to return a fresh profile no older than 29 days. Costs an extra 1 credit on top of the cost of the base endpoint.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const data = {
      url: this.url,
      resolve_numeric_id: this.resolveNumericId,
      categories: this.categories
        ? "include"
        : "exclude",
      funding_data: this.fundingData
        ? "include"
        : "exclude",
      extra: this.extra
        ? "include"
        : "exclude",
      exit_data: this.exitData
        ? "include"
        : "exclude",
      acquisitions: this.acquisitions
        ? "include"
        : "exclude",
      use_cache: this.useCache
        ? "if-present"
        : "if-recent",
    };
    const res = await this.app.retrieveCompanyMetadataFromLinkedin(data);
    $.export("summary", `Profile successfully fetched from "${this.url}".`);
    return res;
  },
};
