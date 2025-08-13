<!-- markdownlint-disable MD024 -->

# Changelog

## [1.8.0] - 2025-08-13

### Added

- Added `categoryIds` parameter to `getApps` method for filtering
  apps by category IDs
- Added `getAppCategories` method to retrieve available app categories

## [1.7.0] - 2025-07-03

### Added

- Added optional scope parameter to backendClient creation.

## [1.6.11] - 2025-07-02

### Added

- Added `stash` to `V1Component`

## [1.6.10] - 2025-07-01

### Added

- Added `sortKey` and `sortDirection` options to the `getApps` method

## [1.6.9] - 2025-06-10

### Added

- Added types for the missing configurable props

## Changed

- Fixed the `Defaultable` type to correctly handle arrays
- Fixed the `ConfigurablePropTimer` type to define cron expressions and
  time intervals
- Marked the `auth` field in the SQL prop type as optional
- Fixed the `App` type to include the `description` field returned by the API
- Fixed the `GetAppsResponse` type to include the pagination stuff

## [1.6.8] - 2025-06-07

### Added

- Added `endpoint_url` field to the component metadata, providing the URL to the
  HTTP interface of the component.
- Added missing pagination fields to the `GetComponentsResponse` and
  `GetAccountsResponse` types.

## [1.6.7] - 2025-06-06

### Added

- Added `stashId` option to the `runAction` method, which allows files to be
  persisted between action runs.

## [1.6.6] - 2025-06-05

### Added

- Added support for `sql` prop type for `connect-react` package

## [1.6.5] - 2025-06-02

### Changed

- Fix the `deployTrigger` method so that it sends the workflow ID to the API

## [1.6.4] - 2025-05-30

### Added

- Added `onClose` callback to `connectAccount` method that receives a
  `ConnectStatus` object with `successful` and `completed` boolean properties

## [1.6.3] - 2025-05-20b

### Added

- Added `rawAccessToken` getter to `BackendClient`

## [1.6.2] - 2025-05-20a

### Added

- Added ability to create a `BackendClient` with just an `AccessToken`

## [1.6.1] - 2025-05-20

### Added

- Added `rawToken` getter to `BrowserClient`

### Changed

- changed `GetComponentsResponse` type to include `configurable_props`

## [1.6.0] - 2025-04-30

### Added

- Added `configuredProps` argument to the `updateTrigger` method.

### Changed

- Corrected the return type of `updateTrigger`.
- Changed the type of property values of `ConfigureComponentContext` from
  explicit `any` to `unknown`.

## [1.5.5] - 2025-04-28

### Changed

- Types and documentation around `configureComponent` `prevContext` and `context`.

## [1.5.4] - 2025-04-25

### Added

- Changed server-side authorized requests to refresh its auth token if it expires
  within 1 second.

## [1.5.3] - 2025-04-18

### Added

- Added `ProxyResponse` type for makeProxyRequest
- changed the location of connect DEBUG calls so they'll still show in the
  error case.

## [1.5.2] - 2025-04-15

### Added

- PD_SDK_DEBUG env var. Set it to true to enable debugging of Pipedream Connect
  API requests. Simple sanitization is performed to prevent sensitive field leakage
  but use caution.

## [1.5.1] - 2025-04-15

### Added

- `withLabel` to `BaseConfigurableProp` type definition
- documentation describing various fields in `BaseConfigurableProp`
- `featured_weight` to `App` type definition now that API returns this value

## [1.5.0] - 2025-04-08

### Added

- Added support for the `query` option to the `configureComponent` method,
  enabling API-based search using the specified query.

## [1.4.0] - 2025-03-12

### Changed

- Added `description` and `component_type` to `V1Component`

## [1.3.3] - 2025-02-5

### Changed

- Add makeProxyRequest function to BaseClient

## [1.3.2] - 2025-02-3

### Changed

- Add getEnvironment function to BaseClient

## [1.3.1] - 2025-01-30

### Changed

- Fix cjs build to transpile and include `oauth4webapi`

## [1.3.0] - 2025-01-30

### Added

- Edge compatible (or closer to it) by replacing `simple-oauth2` with `oauth4webapi`
- Output esm and cjs instead of just cjs
- Minimized bundle size

### Chore

- Modernized package to be type: "module"
- Removed `jest-fetch-mock`

## [1.2.1] - 2025-01-24

### Added

- New types related to API paginated responses
- New type for a prop configuration options

### Changed

- Fixed the types of the trigger retrieval and deployment methods in the backend
  client to correctly reflect the actual response (which is nested inside a
  `data` field).

## [1.2.0] - 2025-01-23

### Added

- New methods and types to interact with the deployed triggers API

## [1.1.6] - 2025-01-21

### Changed

- Fixed the docs of the `getAccountById` method in the backend client to remove
  arguments that are not actually supported.

## [1.1.5] - 2025-01-14

### Changed

- Corrected the return type of `reloadComponentProps`

## [1.1.4] - 2025-01-08

### Added

- Add pagination parameters to component configuration (`page` and `prevContext`)

## [1.1.3] - 2024-12-13

### Added

- Can now filter `getApps` by whether app `hasComponents`,
  `hasActions`, or `hasTriggers` in the registry

## [1.1.2] - 2024-12-12

### Changed

- Fixed the docstring referring to the `componentConfigure` and
  `reloadComponentProps` methods of the components API

## [1.1.1] - 2024-12-11

### Changed

- Remove deprecated asynchronous response handling code.

## [1.1.0] - 2024-12-10

### Added

- Documented the public methods and types for the components API

### Changed

- Renamed the methods involved with the components API (e.g.
  `componentConfigure` -> `configureComponent`)
- Renamed the types used for passing options and accessing responses from the
  components API endpoints (e.g. `ComponentRequestResponse` ->
  `GetComponentResponse`)
- Marked the renamed methods and types as deprecated

## [1.0.12] - 2024-12-06

### Added

- Allow passing `before`, `after` pagination cursors for apps, accounts,
  components endpoints

## [1.0.11] - 2024-12-06

### Added

- Configurable `limit` option for apps, accounts, components endpoints

## [1.0.10] - 2024-12-04

### Changed

- Handle correct casing of `stringOptions` in configure prop response

## [1.0.9] - 2024-12-04

### Added

- `triggerDeploy` preview API
- `client.version` and `x-pd-sdk-version` header

## [1.0.8] - 2024-11-29

### Changed

- Fix fallback WebSocket import (for new components API)

## [1.0.7] - 2024-11-21

### Changed

- The backend client now correctly uses asynchronous messaging to handle long
  running operations.
- Updated the backend command line tool to respect the `ENVIRONMENT` env variable
  if set.

## [1.0.6] - 2024-11-20

### Changed

- Use client Connect tokens to make api calls directly from the client.
- Deprecated the `environments` property on `createFrontendClient` since it is
  now stored in the token

## [1.0.5] - 2024-11-18

### Changed

- The backend client used to default to `production` if the environment was not
  specified. Now `environment` is a required argument for `createBackendClient`
  and must be one of `production` or `development`.

## [1.0.4] - 2024-11-15

### Changed

- Improved the docs of the `getAccountById` method in the backend client to
  clarify the behavior of the new argument.

- Fixed the exported `HTTPAuthType` enum so that it can be used by the consumers
  of the SDK.

## [1.0.3] - 2024-11-14

### Added

- Added a new argument to the `getAccountById` method in the backend client to
  allow the client to retrieve the credentials of the corresponding account.

## [1.0.2] - 2024-11-14

### Changed

- Deprecated the `environment_name` field in the `ConnectTokenOpts` type, as it
  is no longer used by the SDK nor the Connect API. The environment name is now
  exclusively determined by the `environment` field in the `BackendClientOpts`
  type, read during the client creation.

### Added

- Added a new optional flag to `RequestOptions` called `fullResponse`, which
  allows the user to get the full HTTP response object, including the headers
  and status code.

## [1.0.0] - 2024-11-01

### Changed

- Renamed the server-side client class from `ServerClient` to `BackendClient` to
  better indicate its purpose.
- Removed the `oauthClient` optional argument to the `BackendClient` constructor
- Renamed the client factory methods so that developers can know exactly the
  kind of client they are creating.
- Removed project-key-based authentication in favor of a more secure
  token-based authentication using OAuth.
