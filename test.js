const { axios } = require("./platform/dist");

async function test1() {
  const createdAxios = axios.create({
    baseURL: "https://random-data-api.com/api/v2",
  });

  const response = await createdAxios.get("users");

  console.log("createdAxios:", response);
}

async function test2() {
  const data = await axios(this, {
    url: "https://random-data-api.com/api/v2/users",
    returnRawResponse: false,
  });

  console.log("onlyData:", data);
}

async function test3() {
  // const axios = createAxiosInstance({});

  const response = await axios(this, {
    url: "https://random-data-api.com/api/v2/users",
    returnFullResponse: true,
  });

  console.log("returnFullResponse:", response);
}

test1();
test2();
test3();
