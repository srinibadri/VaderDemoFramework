import json
import datetime
from networkviz.utilities import database


def convert_decimal_list_to_string(input_arg, index):
    return [str(x[index]) for x in input_arg]


def convert_decimal_list_to_float(input_arg, index):
    return [(float(x[index]) if x[index] else 0) for x in input_arg]


def get_demand_and_energy_by_time(simulation_name):
    database.connect_to_database(simulation_name, 'ami')
    res = database.query_database(simulation_name, 'ami',
                                  fields='t, SUM(cast(measured_demand as decimal(8,1))), SUM(cast(measured_real_power as decimal(8,1)))',
                                  table='meter',
                                  conditions='group by t order by t DESC')
    database.close_connection(simulation_name, 'ami')
    return res


def add_column_name_to_result(res, *args):
    if len(res[0]) is not len(args):
        raise IndexError("Length of result does not equal arguments length")
    res_list = []
    for item in res:
        res_list.append(convert_single_result_to_dictionary(item, *args))
    return res_list


def convert_list_to_json(res):
    return json.dumps(res)


def convert_single_result_to_dictionary(res, *args):
    """

    :param res: e.g., (datetime.datetime(2016, 10, 23, 23, 30), 3871001.5, 1209977.53)
    :param args:
    :return: a dictionary

    helper.convert_single_result_to_dictionary(a, 'time', 'demand', 'real_power')
    return:
        {'demand': 3871001.5, 'real_power': 1209977.53, 'time': datetime.datetime(2016, 10, 23, 23, 30)}
    """
    dic = {}
    for i in range(0, len(res)):
        dic[args[i]] = str(res[i]) if isinstance(res[i], datetime.datetime) else float(res[i])
    return dic


def select_two_column_from_result(res, index_1, index_2, convert_date_to_string=True):
    ret = []
    for item in res:
        if convert_date_to_string:
            ret.append([
                str(item[index_1]) if isinstance(item[index_1], datetime.datetime) else item[index_1],
                str(item[index_2]) if isinstance(item[index_2], datetime.datetime) else item[index_2],
            ])
        else:
            ret.append([item[index_1], item[index_2]])
    return ret


def wrapper_lists_and_add_name(name_list, *lists):
    """

    :param name_list
    :param lists:
    :return:
    e.g.,
    {
        "energy" : []
        "demand" : []
    }
    """
    dic = {}
    for i in range(0, len(name_list)):
        dic[name_list[i]] = lists[i]
    return dic
