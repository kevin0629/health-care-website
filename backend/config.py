import logging


class Config:
    LOGGING_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    ATTACHMENT_DIR = 'statics/attachments'
    IMAGE_DIR = 'statics/images'
    DOWNLOAD = 'statics/downloads'
    CAROUSEL = 'statics/carousels'
    LOGGING_LEVEL = logging.DEBUG
    PORT = 5004
    MAX_CONTENT_LENGTH = 500 * 1024 * 1024

    BASIC_AUTH = 'MjAyNTAyMDcyMzA4MzVsSFFBZzhqamlxejE6enRyaW1PdlpUZ1YxMUpETmFvaVd5R1ZvMW5COE1FUHo5aDVTeE1CN1dyM2dLOUJybXczTg=='
    REDIRECT_URL = 'http://127.0.0.1:5004/api/auth/login'
    HOME_PAGE_URL = 'http://127.0.0.1:3000/'



class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///development-database.db'
    LOGGING_HANDLERS = {
        'console': {
            'level': Config.LOGGING_LEVEL,
            'class': 'logging.StreamHandler',
            'formatter': 'default',
        },
    }
