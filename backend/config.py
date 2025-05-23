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

    # 正式環境
    BASIC_AUTH = 'MjAyNTAxMDExNjU0NTVnTk40VkpYR1BsSmI6U2V5RExMNFpCdkkxMkN0UnhXR2p2R3I4YXZXSXJjTW0zOW96T1c1emhFVThObGUwdEU5NUV0RXFO'
    REDIRECT_URL = 'https://health.ncu.edu.tw/api/auth/login'
    HOME_PAGE_URL = 'https://health.ncu.edu.tw/'

    # 測試環境用
    # BASIC_AUTH = 'MjAyNTAyMDcyMzA4MzVsSFFBZzhqamlxejE6enRyaW1PdlpUZ1YxMUpETmFvaVd5R1ZvMW5COE1FUHo5aDVTeE1CN1dyM2dLOUJybXczTg=='
    # REDIRECT_URL = 'http://localhost/api/auth/return-to'
    # HOME_PAGE_URL = 'http://localhost/'



class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///development-database.db'
    LOGGING_HANDLERS = {
        'console': {
            'level': Config.LOGGING_LEVEL,
            'class': 'logging.StreamHandler',
            'formatter': 'default',
        },
    }
