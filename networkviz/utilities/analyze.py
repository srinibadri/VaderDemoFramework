"""
This .py provides analyzing utilities.

e.g. analyze.obtain_object_name_list("ieee123")
    [u'ami', u'cap_83', u'cap_88', u'cap_90', ..., ]

"""
import re

from networkviz.utilities import database, connection


def obtain_object_name_list(simulation_name):
    """

    :param simulation_name: e.g., "ieee123", "ieee123s", "ieee123z", "ieee123zs"
    :return: a list of object name
    """
    res = obtain_object_name_raw(simulation_name)
    return list(item[0] for item in res)


def categorize_object_name(simulation_name):
    """

    :param simulation_name: e.g., "ieee123", "ieee123s", "ieee123z", "ieee123zs"
    :return: a dictionary object that categorize the list.
    e.g.,
        {
            'load' : ['load_1', 'load_3', ... ],
            'node' : ['node_1', 'node_4', ...],
            ...
        }

    If you use .keys() function on the return value, it returns the categories.
    e.g., res = categorize_object_name('ieee123')
          res.keys()

          [u'load', u'node', u'olc', u'house', u'meter', u'weather', u'lc', u'ls', u'rc', u'scheme',
           u'sensor', u'tc', u'scada', u'ami', u'line', u'xfrm', u'xfmr', u'cap', u'sw', u'reg', u'ulc', u'trans']

    """
    res = obtain_object_name_list(simulation_name)
    categorized_res = {}
    for item in res:
        info = re.split("[0-9_]", item)
        if info[0] not in categorized_res:
            categorized_res[info[0]] = []
        categorized_res[info[0]].append(item)
    return categorized_res


def analyze_table(simulation_name, db_name, table):
    """

    :param simulation_name: e.g., "ieee123", "ieee123s", "ieee123z", "ieee123zs"
    :param db_name: db_name. e.g., model, ami, data, scada
    :param table: e.g., objects
    :return: a list of table columns.

    e.g., analyze.analyze_table('ieee123', 'model', 'objects')
    [u'id', u'module', u'class', u'name', u'groupid', u'parent', u'rank',
     u'clock', u'valid_to', u'schedule_skew', u'latitude', u'longitude',
     u'in_svc', u'in_svc_micro', u'out_svc', u'out_svc_micro', u'rngstate', u'heartbeat', u'flags']


    """
    database.connect_to_database(simulation_name, db_name)
    res = database.query_database(simulation_name, db_name,
                                  raw_query='describe ' + table)
    database.close_connection(simulation_name, db_name)
    return list(item[0] for item in res)


def obtain_object_name_raw(simulation_name):
    database.connect_to_database(simulation_name, 'model')
    res = database.query_database(simulation_name, 'model',
                                  raw_query='select name from objects where name is not NULL')
    database.close_connection(simulation_name, 'model')
    return res


def get_predicted_switch_states(switches, simulation_name="ieee123"):
    """

    :param simulation_name: e.g., "ieee123", "ieee123s", "ieee123z", "ieee123zs"
    :return: a list of predicted switch states
    """
    switch_states = []
    for switch in switches:
        switch_states.append({switch:
            {"phase_A_state":"CLOSED", "phase_B_state": "CLOSED", "phase_C_state": "OPEN"}
        })
    return switch_states

def get_actual_switch_states(switches, simulation_name="ieee123"):
    """

    :param simulation_name: e.g., "ieee123", "ieee123s", "ieee123z", "ieee123zs"
    :return: a list of actual switch states
    """
    switch_states = []
    for switch in switches:
        obj = connection.get_object(switch)
        switch_states.append({switch:
            {"phase_A_state":obj['phase_A_state'], "phase_B_state": obj['phase_B_state'], "phase_C_state": obj['phase_C_state']}
        })
    return switch_states
