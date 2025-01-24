<!-- markdownlint-disable MD024 -->
# Changelog

# [1.0.0-preview.23] - 2025-01-22

- Show the prop label instead of the value after selecting from a dropdown for string array props

# [1.0.0-preview.22] - 2025-01-21

- Allow custom string input for remote options

# [1.0.0-preview.21] - 2025-01-17

- Fix a bug in async prop value validation when the prop is a string

# [1.0.0-preview.20] - 2025-01-16

- Check if a string prop is set instead of inspecting the contents of the string

# [1.0.0-preview.15] - 2024-12-18

- Emit dynamic props via `onUpdateDynamicProps`

# [1.0.0-preview.14] - 2024-12-17

- Fixed one case of "maximum update depth exceeded" (useEffect component dependency)

# [1.0.0-preview.13] - 2024-12-17

- Added skippable prop types to support triggers

# [1.0.0-preview.12] - 2024-12-13

- Don't throw when validating unexpected values from the api

# [1.0.0-preview.11] - 2024-12-13

- Make prop validation more consistent with app behavior
- Relax validation of string props when value is not a string

# [1.0.0-preview.10] - 2024-12-12

- Enforce string length limits

# [1.0.0-preview.9] - 2024-12-10

- Disabled submit button when form is incomplete

# [1.0.0-preview.8] - 2024-12-09

- Fix dynamic props in the Connect demo app

# [1.0.0-preview.7] - 2024-12-05

- Use proper casing for `stringOptions` now that configure prop is properly async

# [1.0.0-preview.6] - 2024-12-05

- Handle configurable prop `withLabel` (eg. fixes config of Airtable `tableId`)

# [1.0.0-preview.5] - 2024-12-02

- Change colors of "Connect App" button

# [1.0.0-preview.4] - 2024-11-27

- Fix accidental use of useSuspenseQuery
- Fix setState during render due to userId useEffect

# [1.0.0-preview.3] - 2024-11-27

- Previous version broken, lack of build before publish (not sure how preview.1 shipped)

# [1.0.0-preview.2] - 2024-11-27

- Externalize @emotion/react
- Minor type improvements

# [1.0.0-preview.1] - 2024-11-22

Initial release
