"""
This module provides queries for simulation information.

IMPORTANT!!!
1. It's recommended to use the first method to retrieve the information, where it returns a json object that can be
transferred directly.


Usage:
1. Query combined information (returns json)
    e.g. query_status()
         :returns: a Json object including all information of climate

    example return json:

    {
        "dumpall": "FALSE",
         "warn": "TRUE",
         "show_progress": "FALSE",
         "modelname": "model-6268.glm",
         "verbose": "FALSE",
         "clock": "2016-10-06 18:19:13 PDT",
         "realtime_metric": "+0.942004",
         "server_info": "http://gridlabd.slac.stanford.edu:6268",
         "quiet": "FALSE",
         "suppress_repeat_messages": "FALSE",
         "debug": "FALSE"
    }


mrvdaqsuwi
    c -- clock
    m -- model name
    r -- realtime metric
    v -- verbose
    d -- debug
    a -- dump all
    q -- quiet
    s -- show progress
    u -- suppress repeat messages
    w -- warn
    i -- server_info

2. Query single information (returns string)
    e.g. print simulation.clock()

    Available callings:
         simulation.model_name()
         simulation.realtime_metric()
         simulation.verbose()
         simulation.debug()
         simulation.dump_all()
         simulation.quiet()
         simulation.show_progress()
         simulation.suppress_repeat_messages()
         simulation.warn()
         simulation.server_info()

"""
from networkviz.utilities.connection import *
from vaderviz import settings


#TODO: Modify the simulation status

def query_status(args=''):
    """
    :arg: the information to retrieve
    :return: a Json object including information

    """
    if args == '':
        args = 'mrvdaqsuwi'
    return_value = {}
    for c in args:
        if c in valid_key:
            return_value[valid_key[c]['alias']] = valid_key[c]['callback']()
    return_value['clock'] = clock()
    return json.dumps(return_value)


def clock():
    return get_global('clock')


def model_name():
    return get_global(valid_key['m']['basic'])


def realtime_metric():
    return get_global(valid_key['r']['basic'])


def verbose():
    return get_global(valid_key['v']['basic'])


def debug():
    return get_global(valid_key['d']['basic'])


def dump_all():
    return get_global(valid_key['a']['basic'])


def quiet():
    return get_global(valid_key['q']['basic'])


def show_progress():
    return get_global(valid_key['s']['basic'])


def suppress_repeat_messages():
    return get_global(valid_key['u']['basic'])


def warn():
    return get_global(valid_key['w']['basic'])


def server_info():
    return settings.HOSTNAME + ':' + str(settings.PORT)


valid_key = {
    'm': {
        'alias': 'modelname',                   'basic':        'modelname',
        'callback': model_name
    },
    'r': {
        'alias': 'realtime_metric',             'basic':        'realtime_metric',
        'callback': realtime_metric
    },
    'v': {
        'alias': 'verbose',                     'basic':        'verbose',
        'callback': verbose
    },
    'd': {
        'alias': 'debug',                       'basic':        'debug',
        'callback': debug
    },
    'a': {
        'alias': 'dumpall',                     'basic':        'dumpall',
        'callback': dump_all
    },
    'q': {
        'alias': 'quiet',                       'basic':        'quiet',
        'callback': quiet
    },
    's': {
        'alias': 'show_progress',               'basic':        'show_progress',
        'callback': show_progress
    },
    'u': {
        'alias': 'suppress_repeat_messages',    'basic':        'suppress_repeat_messages',
        'callback': suppress_repeat_messages
    },
    'w': {
        'alias': 'warn',                        'basic':        'warn',
        'callback': warn
    },
    'i': {
        'alias': 'server_info',
        'callback': server_info
    },
}
