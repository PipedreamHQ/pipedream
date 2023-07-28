from dotenv import load_dotenv
load_dotenv()

import openai
from config.config import config


def transform(code, templates):
    openai.api_key = config['openai']['api_key']
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": templates.system_instructions},
            {"role": "user", "content": f"This is the code: {code}"},
        ],
        temperature=0,
    )

    return response.choices[0].message.content.strip()
