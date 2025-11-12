import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import diffchecker from "../../diffchecker.app.mjs";

export default {
  key: "diffchecker-compare-image",
  name: "Compare Image",
  description: "Compares two images and returns the result.",
  version: "1.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    diffchecker,
    inputType: {
      type: "string",
      label: "Input Type",
      description: "Specifies the request content-type.",
      options: [
        {
          label: "application/json",
          value: "json",
        },
        {
          label: "multipart/form-data",
          value: "form",
        },
      ],
      reloadProps: true,
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.inputType) {
      let label;
      let description = "Image you want to compare. ";

      switch (this.inputType) {
      case "json" :
        label = "Data URI";
        description += "Provide Data Image URI [Click here for further information](https://en.wikipedia.org/wiki/Data_URI_scheme).";
        break;
      case "form" :
        label = "(File Path Or Url)";
        description += "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/example.jpg`).";
        break;
      }

      props.leftImage = {
        type: "string",
        label: `Left Image ${label}`,
        description: `Left ${description}`,
      };
      props.rightImage = {
        type: "string",
        label: `Right Image ${label}`,
        description: `Right ${description}`,
      };
    }
    return props;
  },
  async run({ $ }) {
    let formData = new FormData();
    const objToSend = {
      inputType: this.inputType,
      outputType: "json",
    };

    let leftStream;
    let rightStream;

    switch (this.inputType) {
    case "form" :
      [
        leftStream,
        rightStream,
      ] = await Promise.all([
        getFileStreamAndMetadata(this.leftImage),
        getFileStreamAndMetadata(this.rightImage),
      ]);
      formData.append("left_image", leftStream.stream, {
        contentType: leftStream.metadata.contentType,
        knownLength: leftStream.metadata.size,
        filename: leftStream.metadata.name,
      });
      formData.append("right_image", rightStream.stream, {
        contentType: rightStream.metadata.contentType,
        knownLength: rightStream.metadata.size,
        filename: rightStream.metadata.name,
      });
      objToSend.data = formData;
      objToSend.headers = formData.getHeaders();
      break;
    case "json" :
      objToSend.data = {
        left_image: this.leftImage.replace(/(\r\n|\n|\r)/gm, ""),
        right_image: this.rightImage.replace(/(\r\n|\n|\r)/gm, ""),
      };
    }
    const response = await this.diffchecker.compareImages(objToSend);
    $.export("$summary", "Successfully compared images");
    return response;
  },
};
