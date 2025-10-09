import { defineAction } from "@pipedream/types";
import verdict from "../../app/verdict_as_a_service.app";

export default defineAction({
  name: "Request Verdict For A File",
  description: "Scans a file for malware and other threats. [See the docs here](https://github.com/GDATASoftwareAG/vaas/tree/main/typescript#request-a-verdict)",
  key: "verdict_as_a_service-request-verdict-for-file",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    verdict,
    file: {
      propDefinition: [
        verdict,
        "file",
      ],
    },
  },
  async run({ $ }) {
    const verdict = await this.verdict.requestVerdictForFile(this.file);

    $.export("$summary", "Successfully requested a verdict");

    return verdict;
  },
});
