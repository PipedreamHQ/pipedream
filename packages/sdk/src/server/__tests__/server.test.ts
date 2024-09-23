import {
  ServerClient, createClient,
} from "../index";
import * as serverModule from "../index";
import fetchMock from "jest-fetch-mock";
import {
  ClientCredentials, AccessToken,
} from "simple-oauth2";

describe("ServerClient", () => {
  let client: ServerClient;

  beforeEach(() => {
    fetchMock.resetMocks(); // Reset fetch mocks before each test
    client = new ServerClient({
      publicKey: "test-public-key",
      secretKey: "test-secret-key",
      oauthClientId: "test-client-id",
      oauthClientSecret: "test-client-secret",
    });
  });

  describe("createClient", () => {
    it("should mock the createClient method and return a ServerClient instance", () => {
      const params = {
        publicKey: "test-public-key",
        secretKey: "test-secret-key",
      };

      const mockClient = new ServerClient(params);

      const createClientSpy = jest.spyOn(serverModule, "createClient").mockReturnValue(mockClient);

      const client = createClient(params);

      expect(createClientSpy).toHaveBeenCalledWith(params);
      expect(client).toBeInstanceOf(ServerClient);
    });
  });

  describe("_makeRequest", () => {
    it("should make a GET request successfully", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          data: "test-response",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }, // Add Content-Type header
      );

      const result = await client["_makeRequest"]("/test-path", {
        method: "GET",
      });

      expect(result).toEqual({
        data: "test-response",
      });
      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.pipedream.com/v1/test-path",
        expect.any(Object),
      );
    });

    it("should make a POST request with JSON body", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          success: true,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }, // Add Content-Type header
      );

      const result = await client["_makeRequest"]("/test-path", {
        method: "POST",
        body: {
          key: "value",
        },
      });

      expect(result).toEqual({
        success: true,
      });
      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.pipedream.com/v1/test-path",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            key: "value",
          }),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      );
    });

    it("should handle non-200 HTTP responses", async () => {
      fetchMock.mockResponseOnce("Not Found", {
        status: 404,
        headers: {
          "Content-Type": "text/plain",
        },
      });

      await expect(client["_makeRequest"]("/bad-path")).rejects.toThrow("HTTP error! status: 404");
      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.pipedream.com/v1/bad-path",
        expect.any(Object),
      );
    });
  });

  describe("_makeApiRequest", () => {
    it("should include OAuth Authorization header and make an API request", async () => {
      const oauthToken = {
        token: {
          access_token: "oauth-token",
        },
        expired: jest.fn().mockReturnValue(false),
      } as unknown as AccessToken;

      client.oauthToken = oauthToken;

      client.oauthClient = {
        getToken: jest.fn().mockResolvedValue(oauthToken),
      } as unknown as ClientCredentials;

      fetchMock.mockResponseOnce(
        JSON.stringify({
          success: true,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }, // Add Content-Type header
      );

      const result = await client["_makeApiRequest"]("/test-path");

      expect(result).toEqual({
        success: true,
      });
      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.pipedream.com/v1/test-path",
        expect.objectContaining({
          headers: expect.objectContaining({
            "Authorization": "Bearer oauth-token",
            "Content-Type": "application/json",
          }),
        }),
      );
    });
  });

  describe("connectTokenCreate", () => {
    it("should create a connect token", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          token: "connect-token",
          expires_at: "2024-01-01T00:00:00Z",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }, // Add Content-Type header
      );

      const result = await client.connectTokenCreate({
        app_slug: "test-app",
        external_user_id: "user-id",
      });

      expect(result).toEqual({
        token: "connect-token",
        expires_at: "2024-01-01T00:00:00Z",
      });
      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.pipedream.com/v1/connect/tokens",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            external_id: "user-id",
            app_slug: "test-app",
          }),
          headers: expect.objectContaining({
            "Authorization": expect.any(String),
            "Content-Type": "application/json",
          }),
        }),
      );
    });
  });

  describe("getAccounts", () => {
    it("should retrieve accounts", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify([
          {
            id: "account-1",
            name: "Test Account",
          },
        ]),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }, // Add Content-Type header
      );

      const result = await client.getAccounts({
        include_credentials: 1,
      });

      expect(result).toEqual([
        {
          id: "account-1",
          name: "Test Account",
        },
      ]);
      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.pipedream.com/v1/connect/accounts?include_credentials=1",
        expect.any(Object),
      );
    });
  });

  describe("invokeWorkflow", () => {
    it("should invoke a workflow with provided URL and body", async () => {
      const oauthToken = "oauth-token";

      // Mock the OAuth token and client
      const oauthTokenObj = {
        token: {
          access_token: oauthToken,
        },
        expired: jest.fn().mockReturnValue(false),
      } as unknown as AccessToken;

      client.oauthToken = oauthTokenObj;

      client.oauthClient = {
        getToken: jest.fn().mockResolvedValue(oauthTokenObj),
      } as unknown as ClientCredentials;

      // Optionally, spy on the _oauthAuthorizationHeader method
      jest.spyOn(client, "_oauthAuthorizationHeader").mockResolvedValue(`Bearer ${oauthToken}`);

      fetchMock.mockResponseOnce(
        JSON.stringify({
          result: "workflow-response",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }, // Add Content-Type header
      );

      const result = await client.invokeWorkflow("https://example.com/workflow", {
        body: {
          foo: "bar",
        },
      });

      expect(result).toEqual({
        result: "workflow-response",
      });
      expect(fetchMock).toHaveBeenCalledWith(
        "https://example.com/workflow",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            foo: "bar",
          }),
          headers: expect.objectContaining({
            "Authorization": `Bearer ${oauthToken}`,
          }),
        }),
      );
    });
  });
});
