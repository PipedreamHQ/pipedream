jest.mock("simple-oauth2", () => {
  return {
    ClientCredentials: jest.fn().mockImplementation(() => {
      return {
        getToken: jest.fn().mockResolvedValue({
          token: {
            access_token: "mocked-oauth-token",
          },
          expired: jest.fn().mockReturnValue(false),
        }),
      };
    }),
  };
});
