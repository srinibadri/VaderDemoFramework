"""
This .py implements the connection utilities.
Besides, the following functions implements the same functionalities used in .js file:

GLDSetProperty => set_property
GLDGetProperty => get_property
GLDSetGlobal => get_global
GLDGetGlobal => set_global

"""
import json
import re
import token
import tokenize
import urllib
import urllib2
from StringIO import StringIO
from xml.dom import minidom

from networkviz.utilities import helper
from vaderviz import settings


def generate_base_url(simulation_name):
    return settings.HOSTNAME + ':' + str(
        settings.SIMULATION_PORT[simulation_name]) + '/' + settings.HTTP_RETURN_TYPE.lower() + '/'


def get_global(simulation_name, name):
    url = generate_base_url(simulation_name) + urllib.quote(name)
    return get_data(url)


def get_property(simulation_name, category, name):
    url = generate_base_url(simulation_name) + urllib.quote(category) + '/' + urllib.quote(name)
    return get_data(url)


def set_global(simulation_name, name, value):
    url = generate_base_url(simulation_name) + urllib.quote(name) + '=' + urllib.quote(value)
    set_data(url)
    return get_global(simulation_name, name)


def set_property(simulation_name, category, name, value):
    url = generate_base_url(simulation_name) + urllib.quote(category) + '/' + urllib.quote(name) + '=' + urllib.quote(
        value)
    set_data(url)
    return get_property(simulation_name, category, name)


def get_object(simulation_name, object_name, use_json=True):
    obj = {}
    url = generate_base_url(simulation_name).replace('xml', 'json') + object_name + "/*"
    print(url)
    try:
        info = get_raw_data_from_connection(url)
        # Fix the trailing comma in some of the lists
        info = clean_json(info)
        # Fix the list of objects that GridlabD returns
        if use_json:
            bad_obj = json.loads(info)
            obj = helper.merge_dicts(*bad_obj)
        else:
            obj = {}
    except ValueError:
        helper.eprint("%s not found" % (object_name))
    return obj


def get_objects(simulation_name, element_prefix, func_get_elements, element_query="list"):
    """

    :param simulation_name: e.g., 'ieee123'
    :param element_prefix: Element name prefix (so that meter/meter_1 and meter/1 both work)
    :param func_get_elements: A function object that can be used to retrieve a list of all
                              the elements of that type in the simulation
    :param element_query: Which collection of data requested. See below.
    :return:
    Note: You can replace 'meter' with switch, load, node, house, etc.
    Handles a few types of queries in the "element_query" field:

    /           --> Returns list of element names of that type
    /list       --> Returns list of element names of that type
    /meter_1    --> Returns data about single element with name 'meter_1'
    /1          --> Returns data about single element with name 'meter_1'. More specifically, with the name (element_prefix+'1')
    /*          --> Returns a list containing full data on each of the elements in the /list

    If it fails, it will return None
    """
    print("%s query requested: %s" % (element_prefix, element_query))
    # List all of the names of the elements
    if element_query == "list":
        return func_get_elements()
    # Provide all details of all of the elements
    elif element_query == "*":
        list_elements = []
        for element in func_get_elements():
            obj = get_object(simulation_name, element)
            if not obj:
                return None
            list_elements.append(obj)
        return list_elements
    # Attempt to get details of a single element
    else:
        if element_prefix not in element_query:
            element_query = element_prefix + element_query
        obj = get_object(simulation_name, element_query)
        if not obj:
            return None
        return obj


def set_data(url):
    connection = urllib2.urlopen(url)
    connection.read()
    connection.close()
    if connection.code == '200':
        return True
    else:
        return False


def get_raw_data_from_connection(url):
    connection = urllib2.urlopen(url)
    info = connection.read()
    connection.close()
    return info


def get_data(url):
    info = get_raw_data_from_connection(url)
    if settings.HTTP_RETURN_TYPE.lower() == 'json':
        try:
            return json.loads(info)['value']
        except ValueError:
            return json.loads(fix_lazy_json(info))['value']
    else:
        xml_doc = minidom.parseString(info)
        item_list = xml_doc.getElementsByTagName('value')
        return item_list[0].childNodes[0].data


def clean_json(string):
    string = re.sub(",[ \t\r\n]+}", "}", string)
    string = re.sub(",[ \t\r\n]+\]", "]", string)
    return string


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
