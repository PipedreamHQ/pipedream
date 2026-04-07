import adp from "../../adp.app.mjs";

export default {
  key: "adp-get-worker",
  name: "Get Worker",
  description: "Returns details for a single worker by their Associate OID. Uses the `/hr/v2/workers/{associateOID}` endpoint. [See docs](https://developers.adp.com/apis/api-explorer/hcm-offrg-wfn/hcm-offrg-wfn-hr-workers-v2-workers)",
  version: "0.0.3",
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
    const response = await this.adp.getWorker({
      $,
      associateOID: this.associateOID,
    });

    const worker = this.adp.workerRecordFromResponse(response);
    const name =
      worker?.person?.legalName?.formattedName
      ?? this.associateOID;

    $.export("$summary", `Successfully retrieved worker: ${name}`);
    return response;
  },
};
