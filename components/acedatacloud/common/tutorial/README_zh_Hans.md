# Ace Data Cloud × Pipedream：从服务名到第一次结果

这是 **Ace Data Cloud 提供的集成**，不是 Suno/OpenAI/Google 的第一方 App。26 个动作源码已准备：原 24 个媒体/搜索动作，加 GPT 聊天与模型列表；官方注册、收录与真实连接仍待完成。

## 1. 找到正确入口

官方发布后，从 [AceDataCloud 应用页](https://pipedream.com/apps/acedatacloud) 选择具体动作，或在 Connect/MCP 使用对应组件。搜索 `Suno`、`Seedance`、`HappyHorse`/`Happy Horse`、`GPT Image`、`Nano Banana`；这些服务各有独立动作，并非通用 JSON 请求工具。当前 App slug 为待注册的 `acedatacloud`；没有获准的独立品牌 App，不能把投稿写成已安装。

官方已[公告](https://pipedream.com/docs/workflows) Workflows/String 于 **2027-03-31 停止服务**，不再接受新注册/订阅；Connect/MCP/API Proxy 不受影响。长期分发以 Connect/MCP 为主，旧 Workflows 截图只作界面参考。

![Pipedream官方历史动作选择器，Google Sheets 示例，不是 Ace 实测](https://mintcdn.com/pipedream/Acz4Z1ch6TM7-aI8/images/bd45e785-image.png)

原图来自 [Pipedream 官方教程](https://pipedream.com/docs/workflows/quickstart)，2026-10-18 下载；拍摄日期/版本未标明。没有 Ace 实际 Token 连接图，不伪造已存在的对话框。

## 2. 获取 API Token

1. [注册并登录 Ace](https://platform.acedata.cloud/?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=pipedream_readme_signup)，进入 [Applications（我的应用）](https://platform.acedata.cloud/console/applications?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=pipedream_readme_api_key)；没有通用应用时先点击 **Initialize General Application（初始化通用应用）**。
2. 打开 **General application（通用应用）**，复制 API Key。通用 Key 仍受账号实际权限约束，服务专用 Key 仅用于对应服务；先核对权限、余额与[当前价格](https://platform.acedata.cloud/models?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=pipedream_readme_pricing)。
3. 要单独给 Pipedream 一份凭证，选 **Manage Keys → Create**，名称例如 `Pipedream Connect`，按需设置过期和额度/API 限制，创建后复制。

![Ace真实应用页：复制Key或管理密钥](https://raw.githubusercontent.com/AceDataCloud/pipedream/codex/acedatacloud-seedream-actions/components/acedatacloud/common/tutorial/get-api-key-en.png)

![Ace真实创建Key窗口](https://raw.githubusercontent.com/AceDataCloud/pipedream/codex/acedatacloud-seedream-actions/components/acedatacloud/common/tutorial/create-api-key-en.png)

两图复用 [SunoDify 固定提交教程原图](https://github.com/AceDataCloud/SunoDify/tree/8d3d03570e73324220f111f7fe343da0792a8071/_assets/tutorial)，2026-10-18 下载，凭据已遮蔽；创建窗口沿用原教程的 `Dify tutorial` 示例名，实际可改为 `Pipedream Connect`。只证明 Ace 取 Key 步骤。仅复制 Token 字符串，不加 `Bearer `、引号或遮挡字符；不要使用 `platform-...` 管理 Token。

## 3. 在 Pipedream 粘贴的位置

App 注册后的连接表单中，粘贴到申请的 **`api_key` secret 字段**，保存 connected account，再在动作的 **AceDataCloud** 字段选择该账号。最终显示标签仍待官方确认。Connect 使用官方配置/执行组件流程，不把 Key 写进动作 JSON、URL 或提示词。

候选免费连接校验是随机未知 ID 的 `/seedream/tasks` POST retrieve；此前只验证了 API 侧有效/无效 Token 行为，Pipedream 的 POST 校验配置未验收。不要点击付费生成来测试 Key。

## 4. 选择服务并填原生字段

| 搜索服务 | 具体动作 | 首用参数 |
|---|---|---|
| Suno | Generate Suno Music | `chirp-v6`，Instrumental=true，纯音乐提示词 |
| Seedance | Generate Seedance Video | `doubao-seedance-2-0-mini-260615`，视频提示词 |
| HappyHorse / Happy Horse | Generate HappyHorse Video | `happyhorse-1.0-t2v`，视频提示词 |
| GPT Image | Generate GPT Image / Edit GPT Image | `gpt-image-2`，提示词；编辑再加公开原图 URL |
| Nano Banana | Generate Nano Banana Image / Edit Nano Banana Image | `nano-banana-2-lite`，1:1、1K；编辑再加公开原图 URL |
| GPT聊天 | Chat With GPT Model / List Chat Models | 先刷新动态 Model，选择公开 GPT 聊天模型；Prompt；可选 Max Tokens=128 |

模型例子来自提交源码，不保证账号有权限，也不是费用承诺。Allowed APIs 限制需允许实际动作接口；聊天需 `/openai/models` 与 `/openai/chat/completions`。不自动换模型、不加 fallback。

## 5. 同一个任务等待终态

生成返回 `task_id`、`state: submitted` 只表示已提交。保存原 ID，到本人 Ace 任务历史查看，**不要重跑生成来查询进度**。查询动作因服务端账号隔离尚待部署和跨账号验收而暂不发布，当前动作也没有 callback URL 控件。

最终任务结果在 `response`，检查 `response.success`、全部媒体和逐项错误，再核对同 task/trace 的使用账单。cost 缺失不等于免费；Credits 不等于美元。聊天同步返回 `choices` 和 `usage`，不是媒体异步任务。

## 常见问题

- 搜不到应用：注册与官方收录待完成，源码/测试不能代替安装。
- 401/403：检查原始 Token、服务权限、过期、允许接口和余额，不回显 Key。
- 超时/408/5xx：可能已产生用量或任务，先查原始历史与账单，再人工决定是否重试。
- 空模型列表：刷新当前目录；只提供该聊天路径支持的 GPT 模型，不把所有模型无差别混入。
- pending：查询原 ID，不能再次生成。新连接、最终媒体、唯一账单、注册与付费转化均尚未在 Pipedream 实测完成。

[English](https://github.com/AceDataCloud/pipedream/blob/codex/acedatacloud-seedream-actions/components/acedatacloud/README.md) · [Token](https://platform.acedata.cloud/console/applications?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=pipedream_readme_api_key) · [价格](https://platform.acedata.cloud/models?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=pipedream_readme_pricing)
