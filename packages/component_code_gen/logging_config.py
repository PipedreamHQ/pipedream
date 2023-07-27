import os
import logging


def getLogger(name):
    logger = logging.getLogger(name)

    if os.environ['DEBUG'] == '1':
        logger.setLevel(logging.DEBUG)
    else:
        logger.setLevel(logging.WARNING)

    handler = logging.StreamHandler()
    handler.setLevel(logging.DEBUG)

    formatter = logging.Formatter('%(name)s - %(levelname)s: %(message)s')
    handler.setFormatter(formatter)

    logger.addHandler(handler)

    return logger
