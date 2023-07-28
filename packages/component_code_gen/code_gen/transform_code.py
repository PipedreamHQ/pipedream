from dotenv import load_dotenv
load_dotenv()

import openai
import templates.transform_to_action as templates
from config.config import config


def transform(code):
    openai.api_key = config['openai']['api_key']
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": templates.transform_instructions},
            {"role": "user", "content": f"This is the code: {code}"},
        ],
        temperature=0,
    )

    return response.choices[0].message.content.strip()
