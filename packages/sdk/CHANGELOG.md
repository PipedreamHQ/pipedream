# Changelog

## [1.0.0-rc.1] - 2024-11-01

### Changed

- Renamed the server-side client class from `ServerClient` to `BackendClient` to
  better indicate its purpose.
- Removed the `oauthClient` optional argument to the `BackendClient` constructor
- Renamed the client factory methods so that developers can know exactly the
  kind of client they are creating.
- Removed project-key-based authentication in favor of a more secure
  token-based authentication using OAuth.
