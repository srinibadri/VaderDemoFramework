"""
This .py implements the connection utilities.
Besides, the following functions implements the same functionalities used in .js file:

GLDSetProperty => set_property
GLDGetProperty => get_property
GLDSetGlobal => get_global
GLDGetGlobal => set_global

"""
from __future__ import print_function
import sys
import json
import token
import tokenize
import urllib
import urllib2
from xml.dom import minidom
from StringIO import StringIO

from vaderviz import settings

return_type = 'xml'
base_url = settings.HOSTNAME + ':' + str(settings.PORT) + '/' + return_type.lower() + '/'


def get_global(name):
    url = base_url + urllib.quote(name)
    return get_data(url)


def get_property(category, name):
    url = base_url + urllib.quote(category) + '/' + urllib.quote(name)
    return get_data(url)


def set_global(name, value):
    url = base_url + urllib.quote(name) + '=' + urllib.quote(value)
    set_data(url)
    return get_global(name)


def set_property(category, name, value):
    url = base_url + urllib.quote(category) + '/' + urllib.quote(name) + '=' + urllib.quote(value)
    set_data(url)
    return get_property(category, name)


#TODO: Add XML support
def get_object(object_name, useJson=True):
    obj = {}
    url = base_url.replace('xml', 'json') + object_name + "/*"
    print(url)
    try:
        info = get_raw_data_from_connection(url)

        # Fix the list of objects that GridlabD returns
        if useJson:
            badObj = json.loads(info)
            obj = merge_dicts(*badObj)
        else:
            obj = {}
    except ValueError:
        eprint("%s not found" % (object_name))
    return obj

def get_objects(element_prefix, func_get_elements, element_query="list"):
    '''

    Single handler method for gathering lists of elements (meters, switches, nodes, houses, etc).
    Arguments:
        request             -- Django Request object
        element_prefix      -- Element name prefix (so that meter/meter_1 and meter/1 both work)
        func_get_elements   -- A function object that can be used to retrieve a list of all the elements of that type in the simulation
        element_query       -- Which collection of data requested. See below.

    Note: You can replace 'meter' with switch, load, node, house, etc.
    Handles a few types of queries in the "element_query" field:

    /           --> Returns list of element names of that type
    /list       --> Returns list of element names of that type
    /meter_1    --> Returns data about single element with name 'meter_1'
    /1          --> Returns data about single element with name 'meter_1'. More specifically, with the name (element_prefix+'1')
    /*          --> Returns a list containing full data on each of the elements in the /list

    If it fails, it will return None
    '''
    print("Element name requested: %s" % (element_query))
    # List all of the names of the elements
    if element_query == "list":
        return func_get_elements()
    # Provide all details of all of the elements
    elif element_query == "*":
        list_elements = []
        for element in func_get_elements():
            obj = connection.get_object(element)
            if not obj:
                return None
            list_elements.append(obj)
        return list_elements
    # Attempt to get details of a single element
    else:
        if element_prefix not in element_query:
            element_query = element_prefix + element_query
        obj = connection.get_object(element_query)
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
    if return_type.lower() == 'json':
        try:
            return json.loads(info)['value']
        except ValueError:
            return json.loads(fix_lazy_json(info))['value']
    else:
        xml_doc = minidom.parseString(info)
        item_list = xml_doc.getElementsByTagName('value')
        return item_list[0].childNodes[0].data

def merge_dicts(*dict_args):
    '''
    Given any number of dicts, shallow copy and merge into a new dict,
    precedence goes to key value pairs in latter dicts.
    '''
    result = {}
    for dictionary in dict_args:
        result.update(dictionary)
    return result


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

def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)
