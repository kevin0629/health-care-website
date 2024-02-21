from flask import jsonify


class Response:
    @staticmethod
    def sever_error(msg, rsp=None):
        return {'description': msg, 'response': rsp}, 500

    @staticmethod
    def client_error(msg, rsp=None):
        return {'description': msg, 'response': rsp}, 400

    @staticmethod
    def not_found(msg, rsp=None):
        return {'description': msg, 'response': rsp}, 404

    @staticmethod
    def response(msg, rsp=None):
        return {'description': msg, 'response': rsp}, 200
