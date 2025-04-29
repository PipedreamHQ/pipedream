import FormData from "form-data";
import fs from "fs";
import { checkTmp } from "../../common/utils.mjs";
import app from "../../what_are_those.app.mjs";

export default {
  key: "what_are_those-grade-sneakers-condition",
  name: "Grade and Authenticate Sneakers",
  description: "Grades and authenticates sneakers using provided images. [See the documentation](https://documenter.getpostman.com/view/3847098/2sAY4rDQDs#13d527e8-5d8f-4511-857c-b40b8dd921b8)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    frontImage: {
      type: "string",
      label: "Front Image",
      description: "The path to the front image image in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
    },
    leftImage: {
      type: "string",
      label: "Left Image",
      description: "The path to the left image image in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
    },
    rightImage: {
      type: "string",
      label: "Right Image",
      description: "The path to the right image image in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
    },
    soleImage: {
      type: "string",
      label: "Sole Image",
      description: "The path to the sole image image in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
    },
    insoleImage: {
      type: "string",
      label: "Insole Image",
      description: "The path to the insole image image in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
    },
    sizeTagImage: {
      type: "string",
      label: "Size Tag Image",
      description: "The path to the sizeTag image image in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
    },
    type: {
      type: "string",
      label: "Use Type",
      description: "the type parameter to see specific types of data.",
      options: [
        "grading",
        "authentication",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = new FormData();
    data.append("image1", fs.createReadStream(checkTmp(this.frontImage)));
    data.append("image2", fs.createReadStream(checkTmp(this.leftImage)));
    data.append("image3", fs.createReadStream(checkTmp(this.rightImage)));
    data.append("image4", fs.createReadStream(checkTmp(this.soleImage)));
    data.append("image5", fs.createReadStream(checkTmp(this.insoleImage)));
    data.append("image6", fs.createReadStream(checkTmp(this.sizeTagImage)));

    const response = await this.app.gradeAuthenticateSneakers({
      headers: {
        ...data.getHeaders(),
      },
      data: data,
      maxBodyLength: Infinity,
      params: {
        type: this.type,
      },
      timeout: 120000,
    });
    $.export("$summary", "Successfully graded and authenticated sneakers.");
    return response;
  },
};
