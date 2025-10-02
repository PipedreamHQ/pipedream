import FormData from "form-data";
import app from "../../what_are_those.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "what_are_those-grade-sneakers-condition",
  name: "Grade and Authenticate Sneakers",
  description: "Grades and authenticates sneakers using provided images. [See the documentation](https://documenter.getpostman.com/view/3847098/2sAY4rDQDs#13d527e8-5d8f-4511-857c-b40b8dd921b8)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    frontImage: {
      type: "string",
      label: "Front Image",
      description: "The frontimage to upload. Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.jpg).",
    },
    leftImage: {
      type: "string",
      label: "Left Image",
      description: "The leftimage to upload. Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.jpg).",
    },
    rightImage: {
      type: "string",
      label: "Right Image",
      description: "The right image to upload. Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.jpg).",
    },
    soleImage: {
      type: "string",
      label: "Sole Image",
      description: "The sole image to upload. Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.jpg).",
    },
    insoleImage: {
      type: "string",
      label: "Insole Image",
      description: "The insole image to upload. Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.jpg).",
    },
    sizeTagImage: {
      type: "string",
      label: "Size Tag Image",
      description: "The size tag image to upload. Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.jpg).",
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
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
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
