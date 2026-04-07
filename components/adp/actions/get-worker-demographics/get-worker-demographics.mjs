import adp from "../../adp.app.mjs";

export default {
  key: "adp-get-worker-demographics",
  name: "Get Worker Demographics",
  description: "Returns demographic information for a single worker by their Associate OID. Uses the `/hr/v2/workers/{associateOID}/demographics` endpoint. [See docs](https://developers.adp.com/apis/api-explorer/hcm-offrg-wfn/hcm-offrg-wfn-hr-workers-v2-workers)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    adp,
    associateOID: {
      propDefinition: [
        adp,
        "associateOID",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.adp.getWorkerDemographics({
      $,
      associateOID: this.associateOID,
    });

    const name =
      response?.workers?.[0]?.person?.legalName?.formattedName
      ?? this.associateOID;

    $.export("$summary", `Successfully retrieved demographics for worker: ${name}`);
    return response;
  },
};
