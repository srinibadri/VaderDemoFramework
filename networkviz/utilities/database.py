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


def query_database(simulation, database, query):
    if query == '':
        raise KeyError("Query is empty")
    global connections
    database_name = simulation + '_' + database
    cursor = connections[database_name].cursor()
    cursor.execute(query)
    res = []
    for info in cursor:
        res.append(info)
    cursor.close()
    return res
