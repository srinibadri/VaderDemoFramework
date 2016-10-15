from networkviz.utilities.database import *


def obtain_object_name_list(simulation_name):
    res = obtain_object_name_raw(simulation_name)
    return list(item[0] for item in res)


def obtain_object_name_raw(simulation_name):
    connect_to_database(simulation_name, 'model')
    res = query_database(simulation_name, 'model',
                         raw_query='select name from objects where name is not NULL')
    close_connection(simulation_name, 'model')
    return res
