from flask_apispec import MethodResource
from flask_apispec import doc
from flask_restful import Resource

from db.db import DB
from decorator.catch_exception import catch_exception
from decorator.log_request import log_request


class GetPublicCompanyEnums(MethodResource, Resource):

    def __init__(self, db: DB):
        self.db = db

    @log_request
    @doc(tags=['public'],
         description='Get the enumerations of company fields',
         responses={
             "200": {},
         })
    @catch_exception
    def get(self):

        data = {
            "status": self.db.tables["Company"].status.prop.columns[0].type.enums
        }

        return data, "200 "
