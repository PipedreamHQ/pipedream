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
  describe("query string in url", () => {
    // Captures the config axios would send instead of making a request
    async function requestConfig(config) {
      let sent;
      await axios({}, {
        ...config,
        adapter: async (cfg) => {
          sent = cfg;
          return {
            data: {},
            status: 200,
            statusText: "OK",
            headers: {},
            config: cfg,
          };
        },
      });
      return sent;
    }

    it("should move query params into params", async () => {
      const cfg = await requestConfig({
        url: "https://example.com/items?limit=10&q=a%26b",
      });
      expect(cfg.url).toBe("https://example.com/items");
      expect(cfg.params).toEqual({
        limit: "10",
        q: "a&b",
      });
    });

    it("should keep '=' inside a value", async () => {
      const cfg = await requestConfig({
        url: "https://example.com/items?cursor=YWJjZA==&limit=10",
      });
      expect(cfg.params).toEqual({
        cursor: "YWJjZA==",
        limit: "10",
      });
    });

    it("should accept a param without a value", async () => {
      const cfg = await requestConfig({
        url: "https://example.com/items?archived&limit=10",
      });
      expect(cfg.params).toEqual({
        archived: "",
        limit: "10",
      });
    });

    it("should decode '+' as a space", async () => {
      const cfg = await requestConfig({
        url: "https://example.com/feed.xml?sort=NRDate+DESC",
      });
      expect(cfg.params).toEqual({
        sort: "NRDate DESC",
      });
    });

    it("should prefer params over query params in url", async () => {
      const cfg = await requestConfig({
        url: "https://example.com/items?limit=10&page=2",
        params: {
          limit: 50,
        },
      });
      expect(cfg.params).toEqual({
        limit: 50,
        page: "2",
      });
    });
  });
});
