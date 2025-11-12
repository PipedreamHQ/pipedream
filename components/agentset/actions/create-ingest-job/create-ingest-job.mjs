import agentset from "../../agentset.app.mjs";
import { PAYLOAD_TYPE_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "agentset-create-ingest-job",
  name: "Create Ingest Job",
  description: "Create an ingest job for the authenticated organization. [See the documentation](https://docs.agentset.ai/api-reference/endpoint/ingest-jobs/create)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    agentset,
    namespaceId: {
      propDefinition: [
        agentset,
        "namespaceId",
      ],
    },
    payloadType: {
      type: "string",
      label: "Payload Type",
      description: "Type of payload for the ingest job",
      options: PAYLOAD_TYPE_OPTIONS,
      reloadProps: true,
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text to ingest",
      hidden: true,
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL of the file to ingest",
      hidden: true,
    },
    urls: {
      type: "string[]",
      label: "URLs",
      description: "The URLs to ingest",
      hidden: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the ingest job",
      optional: true,
      hidden: true,
    },
  },
  async additionalProps(props) {
    props.text.hidden = true;
    props.name.hidden = true;
    props.fileUrl.hidden = true;
    props.urls.hidden = true;

    switch (this.payloadType) {
    case "TEXT":
      props.text.hidden = false;
      props.name.hidden = false;
      break;
    case "FILE":
      props.fileUrl.hidden = false;
      props.name.hidden = false;
      break;
    case "URLS":
      props.urls.hidden = false;
      break;
    }
    return {};
  },
  async run({ $ }) {
    const payload = {
      type: this.payloadType,
    };
    switch (this.payloadType) {
    case "TEXT":
      payload.text = this.text;
      payload.name = this.name;
      break;
    case "FILE":
      payload.fileUrl = this.fileUrl;
      payload.name = this.name;
      break;
    case "URLS":
      payload.urls = parseObject(this.urls);
      break;
    }
    const response = await this.agentset.createIngestJob({
      $,
      namespaceId: this.namespaceId,
      data: {
        payload,
      },
    });
    $.export("$summary", `Ingest job created successfully: ID ${response.data.id}`);
    return response;
  },
};
