const { axios } = require("../dist");

describe("axios", () => {
  it("should fail as expected", async () => {
    const step = {};
    await expect(axios(step, {
      url: "http://56371f3c71069f63d769d0b7ddeca4ac.x.pipedream.net/this-should-404",
    })).rejects.toThrow();
    expect(step.debug).toHaveProperty("config");
  });

  it("should contain debug", async () => {
    const step = {};
    await axios(step, {
      url: "https://api.github.com/users/defunkt",
      debug: true,
    });
    expect(step).toHaveProperty("debug_config");
    expect(step).toHaveProperty("debug_response");
  });
});
