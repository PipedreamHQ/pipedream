import { pipeline } from "stream/promises";
import fs from "fs";
import common from "../../common/common-s3.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-s3-download-file-to-tmp",
  name: "S3 - Download File to /tmp",
  description: toSingleLineString(`
    Downloads a file from S3 to the /tmp directory.
    [See the docs](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html)
  `),
  version: "0.0.1",
  type: "action",
  props: {
    aws: common.props.aws,
    region: common.props.region,
    bucket: common.props.bucket,
    objectKey: {
      propDefinition: [
        common.props.aws,
        "objectKey",
        ({
          region, bucket,
        }) => ({
          region,
          bucket,
        }),
      ],
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the file you'd like to download eg. `/tmp/file.txt`",
    },
  },
  async run({ $ }) {
    const {
      bucket,
      objectKey,
      filePath,
    } = this;

    const { Body: data } = await this.getObject({
      Bucket: bucket,
      Key: objectKey,
    });

    await pipeline(data, fs.createWriteStream(filePath));

    $.export("$summary", `Downloaded file \`${filePath}\` from S3`);

    return {
      filePath,
    };
  },
};
