const defaultRegion = "us-east-1";

// List extracted from the official AWS documentation:
// https://docs.aws.amazon.com/general/latest/gr/rande.html
const regions = [
  {
    label: "US East (Ohio) - `us-east-2`",
    value: "us-east-2",
  },
  {
    label: "US East (N. Virginia) - `us-east-1`",
    value: "us-east-1",
  },
  {
    label: "US West (N. California) - `us-west-1`",
    value: "us-west-1",
  },
  {
    label: "US West (Oregon) - `us-west-2`",
    value: "us-west-2",
  },
  {
    label: "Africa (Cape Town) - `af-south-1`",
    value: "af-south-1",
  },
  {
    label: "Asia Pacific (Hong Kong) - `ap-east-1`",
    value: "ap-east-1",
  },
  {
    label: "Asia Pacific (Mumbai) - `ap-south-1`",
    value: "ap-south-1",
  },
  {
    label: "Asia Pacific (Osaka) - `ap-northeast-3`",
    value: "ap-northeast-3",
  },
  {
    label: "Asia Pacific (Seoul) - `ap-northeast-2`",
    value: "ap-northeast-2",
  },
  {
    label: "Asia Pacific (Singapore) - `ap-southeast-1`",
    value: "ap-southeast-1",
  },
  {
    label: "Asia Pacific (Sydney) - `ap-southeast-2`",
    value: "ap-southeast-2",
  },
  {
    label: "Asia Pacific (Tokyo) - `ap-northeast-1`",
    value: "ap-northeast-1",
  },
  {
    label: "Canada (Central) - `ca-central-1`",
    value: "ca-central-1",
  },
  {
    label: "China (Beijing) - `cn-north-1`",
    value: "cn-north-1",
  },
  {
    label: "China (Ningxia) - `cn-northwest-1`",
    value: "cn-northwest-1",
  },
  {
    label: "Europe (Frankfurt) - `eu-central-1`",
    value: "eu-central-1",
  },
  {
    label: "Europe (Ireland) - `eu-west-1`",
    value: "eu-west-1",
  },
  {
    label: "Europe (London) - `eu-west-2`",
    value: "eu-west-2",
  },
  {
    label: "Europe (Milan) - `eu-south-1`",
    value: "eu-south-1",
  },
  {
    label: "Europe (Paris) - `eu-west-3`",
    value: "eu-west-3",
  },
  {
    label: "Europe (Stockholm) - `eu-north-1`",
    value: "eu-north-1",
  },
  {
    label: "Middle East (Bahrain) - `me-south-1`",
    value: "me-south-1",
  },
  {
    label: "South America (São Paulo) - `sa-east-1`",
    value: "sa-east-1",
  },
];

export {
  defaultRegion,
  regions,
};
