const BASE_URL = "https://wsshipper.dpd.nl/rest/services";
const TEST_BASE_URL = "https://wsshippertest.dpd.nl/rest/services";
const ENVIRONMENT_TEST = "test";
const LOGIN_SERVICE_PATH = "/LoginService/V2_1/getAuth";
const PARCEL_LIFECYCLE_SERVICE_PATH = "/ParcelLifeCycleService/V2_0/getTrackingData";
const DEFAULT_MESSAGE_LANGUAGE = "en_US";

export default {
  BASE_URL,
  TEST_BASE_URL,
  ENVIRONMENT_TEST,
  LOGIN_SERVICE_PATH,
  PARCEL_LIFECYCLE_SERVICE_PATH,
  DEFAULT_MESSAGE_LANGUAGE,
};
