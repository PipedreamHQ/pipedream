const REGION_PLACEHOLDER = "{region}";

const API = {
  OBJECT_STORAGE: {
    ENDPOINT: `https://objectstorage.${REGION_PLACEHOLDER}.oraclecloud.com`,
    VERSION_PATH: "",
  },
  NOTIFICATIONS: {
    ENDPOINT: `https://notification.${REGION_PLACEHOLDER}.oci.oraclecloud.com`,
    VERSION_PATH: "/20181201",
  },
};

const TOPIC_ID = "topicId";
const SUBSCRIPTION_ID = "subscriptionId";
const RULE_ID = "ruleId";

export default {
  REGION_PLACEHOLDER,
  API,
  TOPIC_ID,
  SUBSCRIPTION_ID,
  RULE_ID,
};
