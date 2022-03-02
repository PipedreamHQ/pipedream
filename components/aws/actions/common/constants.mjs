import utils from "./utils.mjs";

const clients = {
  ec2: "ec2",
  lambda: "lambda",
  ssm: "ssm",
  iam: "iam",
  s3: "s3",
  cloudWatchLogs: "cloudWatchLogs",
  eventBridge: "eventBridge",
  sqs: "sqs",
  sns: "sns",
  ses: "ses",
  dynamodb: "dynamodb",
};

const dynamodb = {
  keyTypes: utils.createObjectFromArray([
    "HASH",
    "RANGE",
  ]),
  billingModes: utils.createObjectFromArray([
    "PROVISIONED",
    "PAY_PER_REQUEST",
  ]),
  keyAttributeTypes: [
    {
      label: "string",
      value: "S",
    },
    {
      label: "number",
      value: "N",
    },
    {
      label: "binary",
      value: "B",
    },
  ],
  streamSpecificationViewTypes: [
    "KEYS_ONLY",
    "NEW_IMAGE",
    "OLD_IMAGE",
    "NEW_AND_OLD_IMAGES",
  ],
  returnValues: utils.createObjectFromArray([
    "ALL_NEW",
    "ALL_OLD",
    "NONE",
    "UPDATED_NEW",
    "UPDATED_OLD",
  ]),
};

export default {
  clients,
  dynamodb,
};
