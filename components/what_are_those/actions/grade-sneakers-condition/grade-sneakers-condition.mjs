import FormData from "form-data";
import app from "../../what_are_those.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "what_are_those-grade-sneakers-condition",
  name: "Grade and Authenticate Sneakers",
  description: "Grades and authenticates sneakers using provided images. [See the documentation](https://documenter.getpostman.com/view/3847098/2sAY4rDQDs#13d527e8-5d8f-4511-857c-b40b8dd921b8)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    frontImage: {
      type: "string",
      label: "Front Image",
      description: "The path or URL to the front image image in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
    },
    leftImage: {
      type: "string",
      label: "Left Image",
      description: "The path or URLto the left image image in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
    },
    rightImage: {
      type: "string",
      label: "Right Image",
      description: "The path or URLto the right image image in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
    },
    soleImage: {
      type: "string",
      label: "Sole Image",
      description: "The path or URL to the sole image image in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
    },
    insoleImage: {
      type: "string",
      label: "Insole Image",
      description: "The path or URL to the insole image image in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
    },
    sizeTagImage: {
      type: "string",
      label: "Size Tag Image",
      description: "The path or URL to the sizeTag image image in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
    },
    type: {
      type: "string",
      label: "Use Type",
      description: "The type parameter to see specific types of data",
      options: [
        "grading",
        "authentication",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      frontImage,
      leftImage,
      rightImage,
      soleImage,
      insoleImage,
      sizeTagImage,
      type,
    } = this;

    const data = new FormData();

    if (frontImage) {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(frontImage);
      data.append("image1", stream, {
        contentType: metadata.contentType,
        knownLength: metadata.size,
        filename: metadata.name,
      });
    }
    if (leftImage) {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(leftImage);
      data.append("image2", stream, {
        contentType: metadata.contentType,
        knownLength: metadata.size,
        filename: metadata.name,
      });
    }
    if (rightImage) {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(rightImage);
      data.append("image3", stream, {
        contentType: metadata.contentType,
        knownLength: metadata.size,
        filename: metadata.name,
      });
    }
    if (soleImage) {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(soleImage);
      data.append("image4", stream, {
        contentType: metadata.contentType,
        knownLength: metadata.size,
        filename: metadata.name,
      });
    }
    if (insoleImage) {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(insoleImage);
      data.append("image5", stream, {
        contentType: metadata.contentType,
        knownLength: metadata.size,
        filename: metadata.name,
      });
    }
    if (sizeTagImage) {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(sizeTagImage);
      data.append("image6", stream, {
        contentType: metadata.contentType,
        knownLength: metadata.size,
        filename: metadata.name,
      });
    }

    const response = await this.app.gradeAuthenticateSneakers({
      headers: {
        ...data.getHeaders(),
      },
      data: data,
      maxBodyLength: Infinity,
      params: {
        type,
      },
      timeout: 120000,
    });
    $.export("$summary", "Successfully graded and authenticated sneakers.");
    return response;
  },
};
