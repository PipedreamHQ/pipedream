from templates.common.suffix import suffix
from templates.common.format_instructions import format_instructions
from templates.common.docs_system_instructions import docs_system_instructions
from langchain.schema import (
    # AIMessage,
    HumanMessage,
    SystemMessage
)
from langchain.tools.json.tool import JsonSpec
from langchain.agents.agent_toolkits.json.toolkit import JsonToolkit
from langchain.chat_models import ChatOpenAI, AzureChatOpenAI
from langchain.llms.openai import OpenAI
from langchain.agents import create_json_agent, ZeroShotAgent, AgentExecutor
from langchain.chains import LLMChain
from config.config import config
import openai  # required
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

        tools = OpenAPIExplorerTool.create_tools(docs)
        tool_names = [tool.name for tool in tools]

        prompt_template = ZeroShotAgent.create_prompt(
            tools=tools,
            prefix=system_instructions,
            suffix=suffix,
            format_instructions=format_instructions,
            input_variables=['input', 'agent_scratchpad']
        )

        llm_chain = LLMChain(llm=get_llm(), prompt=prompt_template)
        agent = ZeroShotAgent(llm_chain=llm_chain, allowed_tools=tool_names)
        verbose = True if config['logging']['level'] == 'DEBUG' else False

        self.agent_executor = AgentExecutor.from_agent_and_tools(
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
    if config['openai_api_type'] == "azure":
        azure_config = config["azure"]
        return AzureChatOpenAI(deployment_name=azure_config['deployment_name'],
                               model_name=azure_config["model"], temperature=config["temperature"], request_timeout=300)
    else:
        openai_config = config["openai"]
        print(f"Using OpenAI API: {openai_config['model']}")
        return ChatOpenAI(
            model_name=openai_config["model"], temperature=config["temperature"])


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

    result = get_llm()(messages=[
        SystemMessage(content="You are a world-class coding assistant. You are helping a developer write code. Follow each and every instruction the user gives you. Keep in mind all the rules and examples the user has given you."),
        HumanMessage(content=user_prompt+pd_instructions if normal_order else pd_instructions+user_prompt),
    ])

    return format_result(result.content)
