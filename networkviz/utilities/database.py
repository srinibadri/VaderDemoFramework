"""
This module provides queries for querying database.

IMPORTANT!!!
The steps should be strictly followed:
1. `connect_to_database`
2. `query_database`
3. (optional if needed) `close_connection` or `close_all`

The usage of `connect_to_database` and `query_database` is described in docstring of each function.

"""
from threading import Lock

import mysql.connector

from vaderviz import settings


def singleton(class_):
    instances = {}

    def getinstance(*args, **kwargs):
        if class_ not in instances:
            instances[class_] = class_(*args, **kwargs)
        return instances[class_]

    return getinstance


@singleton
class QueryDatabase:
    def __init__(self):
        self.connections = {}
        self.cursors = {}
        self.lock = Lock()

    def __del__(self):
        self.close_all()
        # self.cursor.close() # The code works if i remove this line;

    def connect_to_database(self, simulation_name, database):
        """

        :param simulation_name: e.g., ieee123, ieee123s, ieee123z, ieee123zs
        :param database: model, data, scada, ami
        :return: a connection
        """
        database_name = simulation_name + '_' + database
        if database_name in self.connections:
            print('This database has already been connected.')
            return
        if simulation_name not in settings.SIMULATION_PORT:
            raise LookupError("There is no such simulation name.")
        if database not in settings.DATABASES_NAME:
            raise LookupError("There is no such database name.")
        self.lock.acquire()
        print "acquired"
        print("Connecting to " + database_name)
        try:
            self.connections[database_name] = mysql.connector.connect(pool_name=database_name,
                                                                      pool_size=10,
                                                                      database=database_name,
                                                                      connection_timeout=10,
                                                                      **settings.DATABASES_BASIC_CONFIG)
            self.cursors[database_name] = self.connections[database_name].cursor()
        finally:
            print "release"
            self.lock.release()

    def close_connection(self, simulation_name, database):
        """
        Avoid closing any connection to database.
        Just make this function as empty one to avoid modify other part of code.
        """
        pass
        # database_name = simulation_name + '_' + database
        # if database_name in self.connections:
        #     self.connections.get(database_name).close()
        #     del self.connections[database_name]

    def close_all(self):
        for database in self.connections:
            print('closing ' + database)
            self.connections[database].close()
        self.connections.clear()

    def query_database(self, simulation_name, database, fields='', table='', conditions='', raw_query=''):
        """

        :param simulation_name: e.g., ieee123, ieee123s, ieee123z, ieee123zs
        :param database: model, data, scada, ami
        :param raw_query: e.g., select module, class from objects limit 10
        :param fields: e.g., module, class
        :param table: e.g., objects
        :param conditions: e.g., limit 10, where module = "powerflow"
        :return: A list of query result (in tuple format)
        example usage:
        1. query_database('ieee123', 'model',
                          fields='module, class',
                          table='objects',
                          conditions='where module = "powerflow"')
        2. query_database('ieee123', 'model',
                          raw_query='select module, class from objects limit 10')
        """
        if raw_query == '' and (fields == '' and table == ''):
            raise KeyError("Query is empty")
        if raw_query == '':
            query = self.generate_query(fields, table, conditions)
        else:
            query = raw_query
        database_name = simulation_name + '_' + database
        if database_name not in self.connections:
            self.connect_to_database(simulation_name, database)
        self.lock.acquire()
        print "acquired"
        try:
            # cursor = self.connections[database_name].cursor()
            self.cursors[database_name].execute(query)
            res = []
            for info in self.cursors[database_name]:
                res.append(info)
                # cursor.close()
        finally:
            print "released"
            self.lock.release()
        return res

    @staticmethod
    def generate_query(fields, table, conditions=''):
        if conditions == '':
            return "SELECT " + fields + " FROM " + table
        else:
            return "SELECT " + fields + " FROM " + table + " " + conditions
