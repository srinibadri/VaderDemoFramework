"""
This module provides queries for climate information.

IMPORTANT!!!
1. It's recommended to use the first method to retrieve the information, where it returns a json object that can be
transferred directly.

2. The query type from website can be either Json of xml.
Currently Json just supports basic return value.
XML supports return value in different units. (Default)

Usage:
1. Query combined information (returns json)
    e.g. query_climate()
         :returns: a Json object including all information of climate

         query_climate('cth')
         :returns a Json object including information of city, temperature and humidity

    example return json:

    '{
        "wind_speed": "17 mph",
        "city": "Bakersfield",
        "clouds": "103 %",
        "temperature": "77.1 degF",
        "wind_heading": "181 deg",
        "clock": "2016-10-05 17:15:01 PDT",
        "humidity": "49 %",
        "pressure": "29.53 inHg",
        "wind_gust": "0 mph"
    }'

    c -- city
    t -- temperature
    h -- humidity
    l -- clouds
    p -- pressure
    s -- wind speed
    d -- wind heading
    g -- wind gust

2. Query single information (returns string)
    e.g. print climate.city()
         Berkley
    Available callings:
         climate.city()
         climate.temperature()
         climate.humidity()
         climate.clouds()
         climate.pressure()
         climate.wind_speed()
         climate.wind_heading()
         climate.wind_gust()

"""
from networkviz.utilities.connection import *
from networkviz.utilities.simulation import clock

query_category = 'weather'


def query_climate(args=''):
    """
    :arg: the information to retrieve
    :return: a Json object including information

    """
    if args == '':
        args = 'cthlpsdg'
    return_value = {}
    for c in args:
        if c in valid_key:
            return_value[valid_key[c]['alias']] = valid_key[c]['callback']()
    return_value['clock'] = clock()
    return json.dumps(return_value)


def city():
    return query('c')


def temperature():
    return query('t')


def humidity():
    return query('h')


def clouds():
    return query('l')


def pressure():
    return query('p')


def wind_speed():
    return query('s')


def wind_heading():
    return query('d')


def wind_gust():
    return query('g')


valid_key = {
    'c': {
            'alias': 'city',              'basic':        'city',
            'callback': city
        },
    't': {
            'alias': 'temperature',       'basic':        'temperature',
            'callback': temperature,      'extended':     'temperature[degF,1f]'
        },
    'h': {
            'alias': 'humidity',          'basic':        'humidity',
            'callback': humidity,         'extended':     'humidity[%,0f]'
         },
    'l': {
            'alias': 'clouds',            'basic':        'opq_sky_cov',
            'callback': clouds,           'extended':     'opq_sky_cov[%,0f]'
        },
    'p': {
            'alias': 'pressure',          'basic':        'pressure',
            'callback': pressure,         'extended':     'pressure[inHg,2f]]'
        },
    's': {
            'alias': 'wind_speed',        'basic':        'wind_speed',
            'callback': wind_speed,       'extended':     'wind_speed[mph,0f]'
        },
    'd': {
            'alias': 'wind_heading',      'basic':        'wind_dir',
            'callback': wind_heading,     'extended':     'wind_dir[deg,0f]'
        },
    'g': {
            'alias': 'wind_gust',         'basic':        'wind_gust',
            'callback': wind_gust,        'extended':     'wind_gust[mph,0f]'
        },
}


def query(key):
    if return_type.lower() == 'json' or key == 'c':
        return get_property(query_category, valid_key[key]['basic'])
    else:
        return get_property(query_category, valid_key[key]['extended'])
