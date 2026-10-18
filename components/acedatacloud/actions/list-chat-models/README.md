# Overview

**List Chat Models** reads the connected Models API and published GPT chat catalog, returning only matching IDs/labels. This is a native read-only action with no completion POST. It does not grant service access, reserve price or include non-GPT/media models.

# Getting Started

After [App registration](https://github.com/PipedreamHQ/pipedream/issues/22155) and official publication, connect an [Ace API Token](https://platform.acedata.cloud/console/applications?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=pipedream_readme_api_key), select the account and run the action. Use one returned ID in **Chat With GPT Model**. Refresh before a paid request and check current access/balance. Empty or failed discovery stops without generating or falling back.

[Full setup and Token screenshots](https://github.com/AceDataCloud/pipedream/blob/codex/acedatacloud-seedream-actions/components/acedatacloud/README.md) · [中文教程](https://github.com/AceDataCloud/pipedream/blob/codex/acedatacloud-seedream-actions/components/acedatacloud/common/tutorial/README_zh_Hans.md). Local/free catalog checks are separate from actual Pipedream installation and connected-run proof.
