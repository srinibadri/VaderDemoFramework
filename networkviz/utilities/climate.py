"""
This module provides queries for climate inforamtion.

IMPORTANT!!!
The return type can be either Json of xml.
Currently Json just supports basic return value.
XML supports return value in different units.

Usage:
1. Query single information
    e.g. print climate.city()
         Berkley
    Available callings:
         climate.city
         climate.temperature
         climate.humidity
         climate.clouds
         climate.pressure
         climate.wind_speed
         climate.wind_heading
         climate.wind_gust

2. Query combined information
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

"""
import json
import token
import tokenize
import urllib2
from xml.dom import minidom
from StringIO import StringIO

from vaderviz import settings

return_type = 'xml'
query_category = 'weather'
base_url = settings.HOSTNAME + ':' + str(settings.PORT) + '/' + return_type.lower() + '/' + query_category + '/'


def query_climate(args=''):
    """

    :return: a Json object including all information
    """
    if args == '':
        args = 'cthlpsdg'
    return_value = {}
    for c in args:
        return_value[valid_key[c]['alias']] = valid_key[c]['callback']()
    return_value['clock'] = clock()
    return json.dumps(return_value)


def clock():
    return query('clock')


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


def generate_url(key):
    if key == 'clock':
        return settings.HOSTNAME + ':' + str(settings.PORT) + '/' + return_type.lower() + '/' + 'clock'
    if return_type.lower() == 'json' or key == 'c':
        url = base_url + valid_key[key]['basic']
    else:
        url = base_url + valid_key[key]['extended']
    return url.replace('%', '%25')


def query(key):
    connection = urllib2.urlopen(generate_url(key))
    info = connection.read()
    connection.close()
    if return_type.lower() == 'json':
        try:
            return json.loads(info)['value']
        except ValueError:
            return json.loads(fix_lazy_json(info))['value']
    else:
        xml_doc = minidom.parseString(info)
        item_list = xml_doc.getElementsByTagName('value')
        return item_list[0].childNodes[0].data


def fix_lazy_json(in_text):
    token_gen = tokenize.generate_tokens(StringIO(in_text).readline)
    result = []
    for tok_id, tok_val, _, _, _ in token_gen:
        # fix unquoted strings
        if tok_id == token.NAME:
            if tok_val not in ['true', 'false', 'null', '-Infinity', 'Infinity', 'NaN']:
                tok_id = token.STRING
                tok_val = u'"%s"' % tok_val

        # fix single-quoted strings
        elif tok_id == token.STRING:
            if tok_val.startswith("'"):
                tok_val = u'"%s"' % tok_val[1:-1].replace('"', '\\"')

        # remove invalid commas
        elif (tok_id == token.OP) and ((tok_val == '}') or (tok_val == ']')):
            if (len(result) > 0) and (result[-1][1] == ','):
                result.pop()

        # fix single-quoted strings
        elif tok_id == token.STRING:
            if tok_val.startswith("'"):
                tok_val = u'"%s"' % tok_val[1:-1].replace('"', '\\"')

        result.append((tok_id, tok_val))
    return tokenize.untokenize(result)
