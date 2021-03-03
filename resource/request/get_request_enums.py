from flask_jwt_extended import jwt_required
from flask_restful import Resource
from db.db import DB
from decorator.catch_exception import catch_exception
from decorator.log_request import log_request
from decorator.verify_admin_access import verify_admin_access


class GetRequestEnums(Resource):

    def __init__(self, db: DB):
        self.db = db

    @log_request
    @catch_exception
    @jwt_required
    @verify_admin_access
    def get(self):

        data = {
            "status": self.db.tables["UserRequest"].status.prop.columns[0].type.enums,
        }

        return data, "200 "