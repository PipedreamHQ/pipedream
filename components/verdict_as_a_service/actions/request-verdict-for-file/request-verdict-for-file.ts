import {
  createReadStream,
  PathLike,
} from "fs";
import { defineAction } from "@pipedream/types";
import verdict from "../../app/verdict_as_a_service.app";

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
  methods: {
    getUint8ArrayFile(file: PathLike): Promise<Uint8Array> {
      let data = Buffer.alloc(0);
      const readStream = createReadStream(file);
      return new Promise((resolve, reject) => {
        return readStream
          .on("data", (chunk: Buffer) => {
            data = Buffer.concat([
              data,
              chunk,
            ]);
          })
          .on("end", async () => {
            return resolve(Uint8Array.from(data));
          })
          .on("error", () => {
            return reject("Error trying to convert a File Read Stream into Uint8Array");
          });
      });
    },
  },
  async run({ $ }) {
    const fileArray = await this.getUint8ArrayFile(this.file);
    const verdict = await this.verdict.requestVerdictForFile(fileArray);

    $.export("$summary", "Successfully requested a verdict");

    return verdict;
  },
});
