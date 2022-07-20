// purposefully test COMPILED platform.js! (just as lambda_maker would)
const {
  $sendConfigRuntimeTypeChecker, HTTP_METHODS,
} = require("../dist");

function randString() {
  return "" + Math.random();
}

function randHttpMethod() {
  const idx = Math.floor(Math.random() * HTTP_METHODS.length);
  return HTTP_METHODS[idx];
}

const emptyConfig = {};

// XXX would be nice to generate a lot of these tests automatically...
// - should vary payload type (between string and object)

describe("$send.email", () => {
  const checker = $sendConfigRuntimeTypeChecker.email;
  let config;
  beforeEach(() => {
    config = {
      html: randString(),
      subject: randString(),
      text: randString(),
    };
  });

  it("should pass with empty config", () => {
    expect(() => checker(emptyConfig)).not.toThrow();
  });

  it("should pass with full config", () => {
    expect(() => checker(config)).not.toThrow();
  });

  it.skip("should fail with .__extra", () => {
    config.__extra = randString();
    expect(() => checker(config)).toThrow();
  });
});

describe("$send.emit", () => {
  const checker = $sendConfigRuntimeTypeChecker.emit;
  let config;
  beforeEach(() => {
    config = {
      raw_event: {
        key: randString(),
      },
    };
  });

  it("should fail with empty config", () => {
    expect(() => checker({})).toThrow();
  });

  it("should pass with full config", () => {
    expect(() => checker(config)).not.toThrow();
  });

  it.skip("should fail with .__extra", () => {
    config.__extra = randString();
    expect(() => checker(config)).toThrow();
  });
});

describe("$send.http", () => {
  const checker = $sendConfigRuntimeTypeChecker.http;
  let config;
  beforeEach(() => {
    config = {
      method: randHttpMethod(),
      url: randString(),
      auth: {
        password: randString(),
        username: randString(),
      },
      data: randString(),
      headers: {
        [randString()]: randString(),
        [randString()]: randString(),
      },
      params: {
        [randString()]: randString(),
        [randString()]: randString(),
      },
    };
  });

  it("should fail with empty config", () => {
    expect(() => checker({})).toThrow();
  });

  it("should pass with full config", () => {
    expect(() => checker(config)).not.toThrow();
  });

  it.skip("should fail with .__extra", () => {
    config.__extra = randString();
    expect(() => checker(config)).toThrow();
  });

  it("should fail without .method", () => {
    delete config.method;
    expect(() => checker(config)).toThrow();
  });

  it("should fail without .url", () => {
    delete config.url;
    expect(() => checker(config)).toThrow();
  });

  it("should pass without .auth", () => {
    delete config.auth;
    expect(() => checker(config)).not.toThrow();
  });

  it("should fail without .auth.username", () => {
    delete config.auth.username;
    expect(() => checker(config)).toThrow();
  });

  it("should fail without .auth.password", () => {
    delete config.auth.password;
    expect(() => checker(config)).toThrow();
  });

  it.skip("should fail with .auth.__extra", () => {
    config.auth.__extra = randString();
    expect(() => checker(config)).toThrow();
  });

  it("should pass without .data", () => {
    delete config.data;
    expect(() => checker(config)).not.toThrow();
  });

  it("should pass with object .data", () => {
    config.data = {
      [randString()]: randString(),
      [randString()]: randString(),
    };
    expect(() => checker(config)).not.toThrow();
  });

  it("should pass without .headers", () => {
    delete config.headers;
    expect(() => checker(config)).not.toThrow();
  });

  it("should pass without .params", () => {
    delete config.params;
    expect(() => checker(config)).not.toThrow();
  });
});

describe("$send.s3", () => {
  const checker = $sendConfigRuntimeTypeChecker.s3;
  let config;
  beforeEach(() => {
    config = {
      bucket: randString(),
      payload: randString(),
      prefix: randString(),
    };
  });

  it("should fail with empty config", () => {
    expect(() => checker({})).toThrow();
  });

  it("should pass with full config", () => {
    expect(() => checker(config)).not.toThrow();
  });

  it.skip("should fail with .__extra", () => {
    config.__extra = randString();
    expect(() => checker(config)).toThrow();
  });

  it("should fail without .bucket", () => {
    delete config.bucket;
    expect(() => checker(config)).toThrow();
  });

  it("should fail without .payload", () => {
    delete config.payload;
    expect(() => checker(config)).toThrow();
  });

  it("should fail without .prefix", () => {
    delete config.prefix;
    expect(() => checker(config)).toThrow();
  });
});

describe("$send.sql", () => {
  const checker = $sendConfigRuntimeTypeChecker.sql;
  let config;
  beforeEach(() => {
    config = {
      payload: randString(),
      table: randString(),
    };
  });

  it("should fail with empty config", () => {
    expect(() => checker({})).toThrow();
  });

  it("should pass with full config", () => {
    expect(() => checker(config)).not.toThrow();
  });

  it.skip("should fail with .__extra", () => {
    config.__extra = randString();
    expect(() => checker(config)).toThrow();
  });

  it("should fail without .payload", () => {
    delete config.payload;
    expect(() => checker(config)).toThrow();
  });

  it("should fail without .table", () => {
    delete config.table;
    expect(() => checker(config)).toThrow();
  });
});

describe("$send.snowflake", () => {
  const checker = $sendConfigRuntimeTypeChecker.snowflake;
  let config;
  beforeEach(() => {
    config = {
      account: randString(),
      database: randString(),
      host: randString(),
      payload: randString(),
      pipe_name: randString(),
      private_key: randString(),
      schema: randString(),
      stage_name: randString(),
      user: randString(),
    };
  });

  it("should fail with empty config", () => {
    expect(() => checker({})).toThrow();
  });

  it("should pass with full config", () => {
    expect(() => checker(config)).not.toThrow();
  });

  it.skip("should fail with .__extra", () => {
    config.__extra = randString();
    expect(() => checker(config)).toThrow();
  });

  it("should fail without .account", () => {
    delete config.account;
    expect(() => checker(config)).toThrow();
  });

  it("should fail without .database", () => {
    delete config.database;
    expect(() => checker(config)).toThrow();
  });

  it("should fail without .host", () => {
    delete config.host;
    expect(() => checker(config)).toThrow();
  });

  it("should fail without .payload", () => {
    delete config.payload;
    expect(() => checker(config)).toThrow();
  });

  it("should fail without .pipe_name", () => {
    delete config.pipe_name;
    expect(() => checker(config)).toThrow();
  });

  it("should fail without .private_key", () => {
    delete config.private_key;
    expect(() => checker(config)).toThrow();
  });

  it("should fail without .schema", () => {
    delete config.schema;
    expect(() => checker(config)).toThrow();
  });

  it("should fail without .stage_name", () => {
    delete config.stage_name;
    expect(() => checker(config)).toThrow();
  });

  it("should fail without .user", () => {
    delete config.stage_name;
    expect(() => checker(config)).toThrow();
  });
});

describe("$send.sse", () => {
  const checker = $sendConfigRuntimeTypeChecker.sse;
  let config;
  beforeEach(() => {
    config = {
      channel: randString(),
      payload: randString(),
    };
  });

  it("should fail with empty config", () => {
    expect(() => checker({})).toThrow();
  });

  it("should pass with full config", () => {
    expect(() => checker(config)).not.toThrow();
  });

  it.skip("should fail with .__extra", () => {
    config.__extra = randString();
    expect(() => checker(config)).toThrow();
  });

  it("should fail without .channel", () => {
    delete config.channel;
    expect(() => checker(config)).toThrow();
  });

  it("should fail without .payload", () => {
    delete config.payload;
    expect(() => checker(config)).toThrow();
  });
});
