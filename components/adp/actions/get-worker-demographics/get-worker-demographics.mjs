import adp from "../../adp.app.mjs";

export default {
  key: "adp-get-worker-demographics",
  name: "Get Worker Demographics",
  description: "Returns demographic information for a single worker by their Associate OID. Uses `GET /hr/v2/worker-demographics/{associateOID}` (WFN Worker Demographics v2). [See docs](https://developers.adp.com/apis/api-explorer/hcm-offrg-wfn/hcm-offrg-wfn-hr-worker-demographics-v2-worker-demographics)",
  version: "0.0.4",
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

    const worker = this.adp.workerRecordFromResponse(response);
    const name =
      worker?.person?.legalName?.formattedName
      ?? this.associateOID;

    $.export("$summary", `Successfully retrieved demographics for worker: ${name}`);
    return response;
  },
};
