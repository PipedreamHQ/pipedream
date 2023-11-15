import FormData from "form-data";
import fs from "fs";
import { checkTmp } from "../../common/utils.mjs";
import diffchecker from "../../diffchecker.app.mjs";

export default {
  key: "diffchecker-compare-image",
  name: "Compare Image",
  description: "Compares two images and returns the result.",
  version: "0.0.1",
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
        label = "Path";
        description += "Provide the file path `/tmp/file.png`. [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).";
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
    const leftFilepath = checkTmp(this.leftImage);
    const rightFilepath = checkTmp(this.rightImage);
    const objToSend = {
      inputType: this.inputType,
      outputType: "json",
    };
    switch (this.inputType) {
    case "form" :
      formData.append("left_image", fs.createReadStream(leftFilepath));
      formData.append("right_image", fs.createReadStream(rightFilepath));
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
