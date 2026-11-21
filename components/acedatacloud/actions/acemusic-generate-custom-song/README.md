# ACE Music · Create song from lyrics

Submit one paid song generation with your own lyrics, style and title. Choose the connected Ace Data Cloud account with an application API key scoped to `/acemusic/audios`. Each run can incur a charge. The action submits once and returns `task_id` with state `submitted`. Save the ID and consult authenticated ACE Music history for the result before retrying. This component does not register a task-query action.

输入字段：lyric, style, title, model。本步骤提交一次，保留 `task_id`，之后用同一任务号核对结果。[ACE Music API](https://github.com/AceDataCloud/ACEMusicAPI)
