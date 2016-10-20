from __future__ import division
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.template import loader
import untangle, requests, json
from utilities import analyze, connection, database, simulation, climate
import pickle
import pandas as pd
import time
from SolarDisaggregation import *
import datetime

# Create your views here.


def index(request):
    return render(request,'landing.html')

def dashboard(request):
    template = loader.get_template('vader/board.html')
    context = {}
    return HttpResponse(template.render(context, request))

def console(request):
    template = loader.get_template('vader/console.html')
    context = {}
    return HttpResponse(template.render(context, request))

def demo(request):
    template = loader.get_template('networkviz/simple.html')
    context = {}
    return HttpResponse(template.render(context, request))


def medium(request):
    template = loader.get_template('networkviz/medium.html')
    context = {}
    return HttpResponse(template.render(context, request))


def gent(request):
    template = loader.get_template('networkviz/board.html')
    context = {}
    return HttpResponse(template.render(context, request))


def cmu(request):
    template = loader.get_template('networkviz/cmu.html')
    context = {}
    return HttpResponse(template.render(context, request))


def d3(request):
    template = loader.get_template('networkviz/d3.js')
    context = {}
    return HttpResponse(template.render(context, request))


def ieee123(request):
    template = loader.get_template('networkviz/ieee123.xml')
    context = {}
    return HttpResponse(template.render(context, request))



def pvdisagg(request,region_id):
    data=disaggregateRegion(region_id)
    return render(request,'disagg.html', {'data': data})
def planning(request):
    return render(request,'planning.html')
def realtime(request):
    return render(request,'real-time.html')

def disaggregateRegion(region):
        #Generates random values to send via websocket
        ## Need to turn this into the message we will be appending to each visualization
        static_loc='/home/eckara/Desktop/CMU_Practicum/VADER/VaderDemoFramework/networkviz/static/data/'
        #with open(static_loc+'objs.pickle') as f:  # Python 3: open(..., 'rb')
        agg_netload, predictors, alphas, model_names,models, solar_true, minute_of_day = pickle.load(open(static_loc+'objs.pickle','rb'))

        tt=int(time.time())*1000
        now = datetime.datetime.now()-datetime.timedelta(hours=7)
        current_minute=now.hour*60+now.minute
        if current_minute< minute_of_day[0]:
            ix=False
        elif current_minute> minute_of_day[1]:
            ix= minute_of_day
        else:
            ix=current_minute-minute_of_day[0]

        i=ix
        ### read netload, disaggrregate and send
        # print(get_till_ith_element_of_dict(predictors,i))
        # print([agg_netload[0:i]])
        model_names_per_region={}
        #model_names_per_region=
        disaggSignal=realtimeDisaggInvdSol(alphas,get_till_ith_element_of_dict(predictors,i),model_names,[[agg_netload[elem]] for elem in range(0,i)],models)
        # print(disaggSignal)
        overall={}
        ctr=0

        ### Come up with a seperation of houses based on model names
        ### Display aggregate net_load as an input.
        print(current_minute)

        for elem in model_names[1:]:
            msg_list=[]
            message={}
            message['label']=elem+'_estimated'
            vals=list(disaggSignal[elem])
            times=list([t/60 for t in range(minute_of_day[0],current_minute)])
            message['data']=[list(a) for a in zip(times,vals) ]
            msg_list.append(message)

            message={}
            message['label']=elem+'_true'

            vals=list(solar_true[elem])
            times=list([t/60 for t in range(minute_of_day[0],current_minute)])
            message['data']=[list(a) for a in zip(times,vals) ]
            msg_list.append(message)

            overall[str(ctr)]=msg_list
            ctr=ctr+1
        i=i+1
        ### rewrite

        return json.dumps(overall)


################### APIs for Maps ###################

# HTML Serving
def dualmap(request):
    template = loader.get_template('vader/dualmap.html')
    context = {}
    return HttpResponse(template.render(context, request))

def map(request):
    template = loader.get_template('vader/map.html')
    context = {}
    return HttpResponse(template.render(context, request))

# API Serving

def api_objects(request, element_prefix, elements_list, element_query="list"):
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

    If it fails, it will return a 500 error and a "<element_query> not found" message
    '''
    print("%s query requested: %s" % (element_prefix, element_query))
    # List all of the names of the elements
    if element_query == "list":
        return JsonResponse(elements_list, safe=False)
    # Provide all details of all of the elements
    elif element_query == "*":
        list_elements = []
        for element in elements_list:
            obj = connection.get_object(element)
            if not obj:
                return JsonResponse({'status':'false','message':'%s not found' % element}, status=500)
            list_elements.append(obj)
        return JsonResponse(list_elements, safe=False)
    # Attempt to get details of a single element
    else:
        if element_prefix not in element_query:
            element_query = element_prefix + element_query
        obj = connection.get_object(element_query)
        if not obj:
            return JsonResponse({'status':'false','message':'%s not found' % element_query}, status=500)
        return JsonResponse(obj)

def api_meters(request, element_query="list"):
    elements_list = analyze.categorize_object_name("ieee123")['meter']
    # import pdb; pdb.set_trace()
    return api_objects(request, "meter_", elements_list, element_query)

def api_switches(request, element_query="list"):
    elements_list = analyze.categorize_object_name("ieee123")['sw']
    return api_objects(request, "sw", elements_list, element_query)

def api_loads(request, element_query="list"):
    elements_list = analyze.categorize_object_name("ieee123")['load']
    return api_objects(request, "load_", elements_list, element_query)

def api_nodes(request, element_query="list"):
    elements_list = analyze.categorize_object_name("ieee123")['node']
    return api_objects(request, "node_", elements_list, element_query)

def api_houses(request, element_query="list"):
    elements_list = analyze.categorize_object_name("ieee123")['house']
    return api_objects(request, "house_", elements_list, element_query)

def api_lines(request, element_query="list"):
    elements_list = analyze.categorize_object_name("ieee123")['line']
    return api_objects(request, "line", elements_list, element_query)

def api_sensors(request, element_query="list"):
    elements_list = analyze.categorize_object_name("ieee123")['sensor']
    return api_objects(request, "sensor", elements_list, element_query)


def api_switch_state(request, actual=''):
    '''
    Get list of all switch states (Actual or Predicted)
    Returns something like this:

    [{"sw13to152": {"phase_C_state": "CLOSED", "phase_B_state": "CLOSED", "phase_A_state": "CLOSED"}}, {"sw61to6101": {"phase_C_state": "CLOSED", "phase_B_state": "CLOSED", "phase_A_state": "CLOSED"}}, {"sw18to135": {"phase_C_state": "CLOSED", "phase_B_state": "CLOSED", "phase_A_state": "CLOSED"}}]
    '''
    switch_state = {}
    elements_list = analyze.categorize_object_name("ieee123")['sw']
    if actual.lower() == 'actual':
        switch_state = analyze.get_actual_switch_states(elements_list)
        return JsonResponse(switch_state, safe=False)
    elif actual.lower() == 'predicted':
        switch_state = analyze.get_predicted_switch_states(elements_list)
        return JsonResponse(switch_state, safe=False)
    else:
        return JsonResponse({'status':'false','message':'Unknown state type: \'%s\'. Must be \'actual\' or \'predicted\'' % actual}, status=500)


# Helper methods
def is_int(s):
    try:
        int(s)
        return True
    except ValueError:
        return False
