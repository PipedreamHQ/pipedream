import verdict from "../../app/verdict_as_a_service.app";
import { defineAction } from "@pipedream/types";
import { createReadStream } from "fs";

export default defineAction({
  name: "Request Verdict For A File",
  description: "Scans a file for malware and other threats. [See the docs here](https://github.com/GDATASoftwareAG/vaas/tree/main/typescript#request-a-verdict)",
  key: "verdict_as_a_service-request-verdict-for-file",
  version: "0.0.1",
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
    const fileArray = Uint8Array.from(createReadStream(this.file).read());
    const verdict = await this.verdict.requestVerdictForFile(fileArray);

    $.export("$summary", "Successfully requested a verdict");

    return verdict;
  },
});
