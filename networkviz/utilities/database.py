"""
This module provides queries for querying database.

IMPORTANT!!!
It should be strictly follows the steps:
1. `connect_to_database`
2. `query_database`
3. (optional if needed) `close_connection` or `close_all`

The usage of `connect_to_database` and `query_database` is described in docstring of each function.

"""
import mysql.connector

from vaderviz import settings

connections = {}


def connect_to_database(simulation_name, database):
    """

    :param simulation_name: e.g., ieee123, ieee123s, ieee123z, ieee123zs
    :param database: model, data, scada, ami
    :return: a connection
    """
    global connections
    if simulation_name not in settings.DATABASES_CONFIGURATIONS:
        raise LookupError("There is no such simulation name.")
    if database not in settings.DATABASES_CONFIGURATIONS[simulation_name]:
        raise LookupError("There is no such database name.")
    database_name = simulation_name + '_' + database
    if database_name in connections:
        return
    connections[database_name] = mysql.connector.connect(database=database_name,
                                                         **settings.DATABASES_BASIC_CONFIG)


def close_connection(simulation_name, database):
    global connections
    database_name = simulation_name + '_' + database
    if database_name in connections:
        connections.get(database_name).close()
        del connections[database_name]


def close_all():
    global connections
    for database in connections:
        print 'closing ' + database
        connections[database].close()
    connections.clear()


def query_database(simulation_name, database, fields='', table='', conditions='', raw_query=''):
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
    global connections
    if raw_query == '':
        query = generate_query(fields, table, conditions)
    else:
        query = raw_query
    database_name = simulation_name + '_' + database
    try:
        cursor = connections[database_name].cursor()
    except KeyError:
        raise KeyError("Connection to " + database_name + " has not been established")
    cursor.execute(query)
    res = []
    for info in cursor:
        res.append(info)
    cursor.close()
    return res


def generate_query(fields, table, conditions=''):
    if conditions == '':
        return "SELECT " + fields + " FROM " + table
    else:
        return "SELECT " + fields + " FROM " + table + " " + conditions
