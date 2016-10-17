"""
This .py provides analyzing utilities.

e.g. analyze.obtain_object_name_list("ieee123")
    [u'ami', u'cap_83', u'cap_88', u'cap_90', ..., ]

"""
from networkviz.utilities import database


def obtain_object_name_list(simulation_name):
    """

    :param simulation_name: e.g., "ieee123", "ieee123s", "ieee123z", "ieee123zs"
    :return: a list of object name
    """
    res = obtain_object_name_raw(simulation_name)
    return list(item[0] for item in res)


def obtain_object_name_raw(simulation_name):
    database.connect_to_database(simulation_name, 'model')
    res = database.query_database(simulation_name, 'model',
                                  raw_query='select name from objects where name is not NULL')
    database.close_connection(simulation_name, 'model')
    return res


def analyze_table(simulation_name, db_name, table):
    database.connect_to_database(simulation_name, db_name)
    res = database.query_database(simulation_name, db_name,
                                  raw_query='describe ' + table)
    database.close_connection(simulation_name, db_name)
    return list(item[0] for item in res)
