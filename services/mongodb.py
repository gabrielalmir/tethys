from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

import os

MONGODB_URI = os.getenv("MONGODB_URI")

class MongoService:
    def __init__(self):
        self.client = MongoClient(MONGODB_URI, server_api=ServerApi("1"))

    def set_document(self, collection, document):
        self.client["tethys"][collection].insert_one(document)

    def get_document(self, collection, query):
        return self.client["tethys"][collection].find_one(query)
