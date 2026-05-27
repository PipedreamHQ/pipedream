import { ConfigurationError } from "@pipedream/platform";
import app from "../../ashby.app.mjs";

export default {
  key: "ashby-get-candidate-resume-file",
  name: "Get Candidate Resume File",
  description: "Retrieves the URL of a candidate's resume file. Equivalent to calling the **Get Candidate** and **Get File URL** actions in succession. See the documentation [here](https://developers.ashbyhq.com/reference/candidateinfo) and [here](https://developers.ashbyhq.com/reference/fileinfo)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    candidateId: {
      propDefinition: [
        app,
        "candidateId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      candidateId,
    } = this;

    const candidateResponse = await app.getCandidate({
      $,
      data: {
        id: candidateId,
      },
    });

    const resumeFileHandle = candidateResponse?.results?.resumeFileHandle;
    if (!resumeFileHandle) {
      throw new ConfigurationError(`No resume file found for candidate \`${candidateId}\`.`);
    }

    const response = await app.getFileUrl({
      $,
      data: {
        fileHandle: resumeFileHandle,
      },
    });

    $.export("$summary", `Successfully retrieved resume file URL for candidate \`${candidateId}\``);

    return response;
  },
};
