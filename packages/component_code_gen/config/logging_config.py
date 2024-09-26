import logging
from config.config import config


def getLogger(name):
    logger = logging.getLogger(name)
    logger.setLevel(config['logging']['level'])
    return logger
