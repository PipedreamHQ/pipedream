const { axios } = require("../dist")

describe("axios", () => {
  it("should fail as expected", async () => {
    const step = {}
    await expect(axios(step, {
      url: "http://56371f3c71069f63d769d0b7ddeca4ac.x.pipedream.net/this-should-404",
    })).rejects.toThrow()
    expect(step.debug).toHaveProperty("config")
  })
})
