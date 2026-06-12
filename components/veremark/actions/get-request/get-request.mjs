import app from "../../veremark.app.mjs";

export default {
  key: "veremark-get-request",
  name: "Get Background Check Request",
  description:
    "Retrieves the status and details of a background check request by its GUID."
    + " Returns the overall request status (e.g. requested, in_progress, review, completed) and the status of each individual check within the request."
    + " Also returns document GUIDs for any candidate-uploaded files, which can be downloaded with **Download Candidate Document**."
    + " The request GUID is returned when you create a request with **Create Background Check Request**."
    + " Note: there is no search endpoint — you must know the request GUID. Save it when creating requests."
    + " [See the documentation](https://api.veremark.com/external/v1/docs/#tag/request/operation/retrieveRequest)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    requestGuid: {
      propDefinition: [
        app,
        "requestGuid",
      ],
    },
  },
  async run({ $ }) {
    let request;
    try {
      request = await this.app.getRequest({
        $,
        requestGuid: this.requestGuid,
      });
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        $.export("$summary", `Request ${this.requestGuid} not found`);
        return {
          found: false,
          message: `Request ${this.requestGuid} not found. Verify the GUID is correct — it is returned when creating a request with Create Background Check Request.`,
        };
      }
      throw err;
    }
    $.export("$summary", `Retrieved request ${this.requestGuid} — status: ${request.status ?? "unknown"}`);
    return request;
  },
};
