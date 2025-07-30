import {
  ConfigurationError, getFileStream,
} from "@pipedream/platform";
import { MEDIA_TYPES } from "./constants.mjs";

export const prepareAdditionalProps = (props) => {
  const newProps = {};
  if (props.mediaQuantity) {
    for (let i = 0; i < props.mediaQuantity; i++) {
      newProps[`mediaType${i}`] = {
        type: "integer",
        label: `Media Type ${i + 1}`,
        description: `Media type ${i + 1} to use for the product.`,
        options: MEDIA_TYPES,
      };
      newProps[`mediaName${i}`] = {
        type: "string",
        label: `Media Name ${i + 1}`,
        description: `Media name ${i + 1} to use for the product.`,
      };
      newProps[`mediaUrl${i}`] = {
        type: "string",
        label: `Media URL ${i + 1}`,
        description: `The file ${i + 1} to upload. Provide either a file URL or a path to a file in the \`/tmp\` directory (for example, \`/tmp/myFile.txt\`).`,
      };
      newProps[`mediaDescription${i}`] = {
        type: "string",
        label: `Media Description ${i + 1}`,
        description: `Media description ${i + 1} to use for the product.`,
      };
    }
  }
  return newProps;
};

const streamToBuffer = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
};

export const prepareMediaData = async (props, opts = {}) => {
  const data = {
    name: props.name,
    description: props.description,
    target_audience: props.targetAudience,
    media: [],
    ...opts,
  };

  for (let i = 0; i < props.mediaQuantity; i++) {
    const media = await props.joggai.createUrl({
      data: {
        filename: props[`mediaUrl${i}`],
      },
    });

    const stream = await getFileStream(props[`mediaUrl${i}`]);
    const fileBinary = await streamToBuffer(stream);

    await props.joggai._makeRequest({
      method: "PUT",
      url: media.data.sign_url,
      data: Buffer.from(fileBinary, "binary"),
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });

    data.media.push({
      type: props[`mediaType${i}`],
      name: props[`mediaName${i}`],
      url: media.data.asset_id,
      description: props[`mediaDescription${i}`],
    });
  }
  return data;
};

export const checkResponse = (response) => {
  if (response.code) {
    throw new ConfigurationError(response.msg);
  }
};
