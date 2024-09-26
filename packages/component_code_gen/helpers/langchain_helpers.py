from templates.common.suffix import suffix
from templates.common.format_instructions import format_instructions
from templates.common.docs_system_instructions import docs_system_instructions
from langchain.schema import HumanMessage
from langchain.agents.react.agent import create_react_agent
from langchain_community.agent_toolkits import JsonToolkit, create_json_agent
from langchain_community.tools.json.tool import JsonSpec

import openai
from langchain_openai.chat_models.base import ChatOpenAI
from langchain.agents import ZeroShotAgent, AgentExecutor
from langchain.chains import LLMChain
from config.config import config
from dotenv import load_dotenv
load_dotenv()


class OpenAPIExplorerTool:
    @staticmethod
    def create_tools(docs):
        json_spec = JsonSpec(dict_=docs)
        json_toolkit = JsonToolkit(spec=json_spec)
        tools = json_toolkit.get_tools()
        return tools


class PipedreamOpenAPIAgent:
    def __init__(self, docs, templates, auth_example, parsed_common_files):
        system_instructions = format_template(
            f"{templates.system_instructions(auth_example, parsed_common_files)}\n{docs_system_instructions}")

        model = ChatOpenAI(model_name=config['openai']['model'])
        tools = OpenAPIExplorerTool.create_tools(docs)

        # o1-preview doesn't support system instruction, so we just concatenate into the prompt
        prompt = f"{system_instructions}\n\n{format_instructions}"

        agent = create_react_agent(model, tools, prompt)
        verbose = True if config['logging']['level'] == 'DEBUG' else False
        self.agent_executor = AgentExecutor(
            agent=agent, tools=tools, verbose=verbose)

    def run(self, input):
        try:
            result = self.agent_executor.run(input)
        except Exception as e:
            result = str(e)
            if "I don't know" in result:
                return "I don't know"
            if '```' not in result:
                raise e

        return format_result(result)


def format_template(text):
    return text.replace("{", "{{").replace("}", "}}")  # escape curly braces


def format_result(result):
    if '```' in result:
        if '```javascript' in result:
            result = result.split('```javascript')[1].split('```')[0].strip()
        else:
            result = result.split('```')[1].split('```')[0].strip()
    return result


def create_user_prompt(prompt, urls_content):
    if len(urls_content) == 0:
        return prompt + "\n\n"

    user_prompt = f"{prompt}\n\n## API docs\n\n"
    for item in urls_content:
        user_prompt += f"\n\n### {item['url']}\n\n{item['content']}"
    return user_prompt + "\n\n"


def get_llm():
    openai_config = config["openai"]
    print(f"Using OpenAI API: {openai_config['model']}")
    return ChatOpenAI(model_name=openai_config["model"], temperature=1)


def ask_agent(prompt, docs, templates, auth_example, parsed_common_files, urls_content):
    agent = PipedreamOpenAPIAgent(
        docs, templates, auth_example, parsed_common_files)
    user_prompt = create_user_prompt(prompt, urls_content)
    result = agent.run(user_prompt)
    return result


def no_docs(prompt, templates, auth_example, parsed_common_files, urls_content, normal_order=True):
    user_prompt = create_user_prompt(prompt, urls_content)
    pd_instructions = format_template(
        templates.system_instructions(auth_example, parsed_common_files))

    result = get_llm().invoke([
        HumanMessage(content=user_prompt +
                     pd_instructions if normal_order else pd_instructions+user_prompt),
    ])

    return format_result(result.content)
