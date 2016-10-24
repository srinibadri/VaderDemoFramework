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
from vaderviz.settings import PICKLE_FOLDER
import numpy as np

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


def forecasting(request):
    return render(request,'forecasting.html')



def pvdisagg(request):
    ##data=disaggregateRegion(region_id)
    return render(request,'disagg.html')
def planning(request):
    return render(request,'planning.html')
def realtime(request):
    return render(request,'real-time.html')

def disaggregateRegion(request, region_id):
        #Generates random values to send via websocket
        ## Need to turn this into the message we will be appending to each visualization
        #with open(static_loc+'objs.pickle') as f:  # Python 3: open(..., 'rb')
        agg_netload, predictors, alphas, model_names,models, solar_true, minute_of_day,arrs = pickle.load(open(PICKLE_FOLDER+'objs.pickle','rb'))

        tt=int(time.time())*1000
        now = datetime.datetime.now()-datetime.timedelta(hours=7)
        current_minute=now.hour*60+now.minute
        if current_minute< minute_of_day[0]:
            i=False
        elif current_minute> minute_of_day[1]:
            i= minute_of_day[1]-minute_of_day[0]-1
        else:
            i=current_minute-minute_of_day[0]

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
        #print(current_minute)
        # ### AGGREGATE LOAD

        if region_id=="1":
            filtered_models=model_names[1:5]
            filteredArrs=arrs[1:5]

        elif region_id=="2":
            filtered_models=model_names[10:14]
            filteredArrs=arrs[10:14]

        agg_netload=[]
        for elem in zip(*filteredArrs):
            agg_netload.append(np.sum(elem))

        msg_list=[]
        message={}
        message['label']="Aggregate Net Load"
        vals=[agg_netload[elem] for elem in range(0,i)]
        times=list([t/60 for t in range(minute_of_day[0],current_minute)])
        message['data']=[list(a) for a in zip(times,vals) ]
        msg_list.append(message)
        overall["AggregateLoad"]=msg_list

        # ### SOLAR PROXY
        msg_list=[]
        message={}
        message['label']="Solar Proxy"
        vals=[elem[0] for elem in predictors['1169']]
        times=list([t/60 for t in range(minute_of_day[0],current_minute)])
        message['data']=[list(a) for a in zip(times,vals) ]
        msg_list.append(message)
        overall["SolarProxy"]=msg_list


        for elem in filtered_models:
            if ctr<4:
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
        ### rewrite
        return JsonResponse(json.dumps(overall),safe=False)

def mlpowerflow(request):
    ##data=disaggregateRegion(region_id)
    return render(request,'mlpowerflow.html')

def voltageWarning(request, region_id=0, bus_id=7):
    """
    For voltage warning demo
    :param request:
    :param region_id: 0, 1, 2
    :param bus_id: 1, 2, ..., 7
    :return:
    """
    print(PICKLE_FOLDER)
    region_id=int(region_id)
    bus_id=int(bus_id)
    with open(PICKLE_FOLDER + "dfs.pickle", 'rb') as f:
        df, df_forecast, estimated_rela_std = pickle.load(f)
    THRESHOLD = 1e-5
    df_std = df_forecast.std()
    for idx in df_std.index:
        if abs(df_std[idx]) < THRESHOLD:
            df_std[idx] = 1.
    df_forecast_norm = (df_forecast - df_forecast.mean()) / df_std

    df_forecast_norm_lb = df_forecast_norm - estimated_rela_std
    df_forecast_norm_ub = df_forecast_norm + estimated_rela_std

    df_forecast_lb = df_forecast_norm_lb * df_std + df_forecast.mean()
    df_forecast_ub = df_forecast_norm_ub * df_std + df_forecast.mean()

    now = datetime.datetime.now()
    now_round = datetime.datetime(year=now.year, month=now.month, day=now.day, hour=now.hour, minute=0)
    history_start = now_round - datetime.timedelta(days=6)
    actual_points = 6 * 24 + 1
    forecast_points = 7 * 24 + 1
    forecast_only_points = forecast_points - actual_points

    actual_ts = [history_start + i * datetime.timedelta(hours=1) for i in range(actual_points)]
    forecast_ts = [history_start + i * datetime.timedelta(hours=1) for i in range(forecast_points)]
    forecast_only_ts = [now_round + i * datetime.timedelta(hours=1) for i in range(forecast_only_points)]

    plot_names = ['load', 'voltage']
    var_names = ['p', 'v']

    overall = dict()
    for elem_idx, elem in enumerate(plot_names):
        msg_list = []

        message = {}
        message['label'] = elem + '_estimated'

        start_point = region_id * 24 * 7 * 4
        vals = list(df_forecast.ix[start_point:(start_point+forecast_points), str(var_names[elem_idx]) + str(bus_id)])
        times = list([(ts - datetime.datetime(1970,1,1)).total_seconds() for ts in forecast_ts])
        message['data'] = [list(a) for a in zip(times, vals)]
        msg_list.append(message)

        message = {}
        message['label'] = elem + '_true'
        vals = list(df_forecast.ix[start_point:(start_point+actual_points), str(var_names[elem_idx]) + str(bus_id)])
        times = list([(ts - datetime.datetime(1970,1,1)).total_seconds() for ts in actual_ts])
        message['data'] = [list(a) for a in zip(times, vals)]
        msg_list.append(message)

        overall[elem] = msg_list

    return JsonResponse(json.dumps(overall), safe=False)


################### Switch Prediction ###############

# HTML Serving
def switch_prediction(request):
    template = loader.get_template('vader/switch-prediction.html')
    context = {}
    return HttpResponse(template.render(context, request))


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
    print elements_list
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


def api_capacitors(request, element_query="list"):
    elements_list = analyze.categorize_object_name("ieee123")['cap']
    print elements_list
    return api_objects(request, "cap", elements_list, element_query)

def api_regions(request, element_query="list"):
    regions = '''[
    {"group_num":0,"points":[[35.38503, -118.99987],[35.3831, -118.9997],[35.38459, -118.99775], [35.38455, -118.99487],[35.38501, -118.99492],[35.38602, -118.99685],[35.38546, -118.9985],[35.38517, -118.99893]]},
    {"group_num":1,"points":[
    [35.38375, -119.00266],[35.38524, -119.00281],[35.38581, -119.00416],[35.38669, -119.00399],[35.3865, -119.00262],[35.38632, -119.00195],[35.38929, -119.00187],[35.38963, -119.00217],[35.3915, -119.00206],[35.39169, -118.99704],[35.39075, -118.99702],[35.39078, -118.9991],[35.38506, -118.99919],[35.38503, -118.99994],[35.38422, -118.99996],[35.38419, -119.00161],[35.38377, -119.00172],[35.3838, -119.00261]]},
    {"group_num":2,"points":[[35.3904, -118.99908],[35.39045, -118.99431],[35.38989, -118.99442],[35.38984, -118.99625],[35.38863, -118.99616],[35.38786, -118.99702],[35.38776, -118.99786],[35.38595, -118.99809],[35.38596, -118.99722],[35.38556, -118.99723],[35.38556, -118.9994],[35.38594, -118.99941],[35.38774, -118.99927],[35.38782, -118.99853],[35.3899, -118.99853],[35.38993, -118.99906],[35.39043, -118.99906]]},
    {"group_num":3,"points":[[35.39276, -118.99479],
    [35.39285, -118.992],[35.39434, -118.99186],[35.39433, -118.99109],[35.39281, -118.99099],[35.3928, -118.988],[35.39223, -118.98794],[35.39218, -118.99094],[35.39127, -118.99105],[35.3912, -118.99309], [35.39048, -118.99318], [35.39061, -118.99462]]},
    {"group_num":4,"points":[[35.38641, -118.99702],[35.38595, -118.99696],[35.3854, -118.99435],[35.38773, -118.99357],[35.38789, -118.99405],[35.389, -118.99472],[35.38913, -118.99524],[35.38786, -118.99561],[35.38735, -118.99442],[35.38598, -118.99489],[35.38656, -118.99702]]},
    {"group_num":5,"points":[[35.38202, -118.9982],[35.38318, -118.99811],[35.38335, -118.99337],[35.38796, -118.9932],[35.38808, -118.99399],[35.39063, -118.99302],[35.39068, -118.99268],[35.39034, -118.99268],[35.39036, -118.99099],[35.38985, -118.98901],[35.38945, -118.98921],[35.38993, -118.99129],[35.38998, -118.99271],[35.38957, -118.99269],[35.38878, -118.98919],[35.38832, -118.98938],[35.38794, -118.99062],[35.38615, -118.99172],[35.38578, -118.99022],[35.38697, -118.98968],[35.38685, -118.98919],[35.38516, -118.9897],[35.38483, -118.99149],[35.38474, -118.99248],[35.3821, -118.99249],[35.38209, -118.99806]]}
    ]'''
    # print(regions)
    return HttpResponse(regions)


def api_regions_old(request, element_query="list"):
    regions = '''[
    {"group_num":0,"points":[[35.38762, -118.99994],[35.38396, -118.99992],[35.38384, -119.00294], [35.38755, -119.00262]]},
    {"group_num":1,"points":[[35.38752, -118.9998],[35.38534, -118.99973],[35.38536, -118.99929],[35.38751, -118.99931]]},
    {"group_num":2,"points":[[35.38503, -118.99987],[35.3831, -118.9997],[35.38459, -118.99775], [35.38455, -118.99487],[35.38501, -118.99492],[35.38602, -118.99685],[35.38546, -118.9985],[35.38517, -118.99893]]},
    {"group_num":3,"points":[[35.39153, -119.00251],[35.38788, -119.00255],[35.38812, -118.9988], [35.39043, -118.9988], [35.39082, -118.99588], [35.39218, -118.99758]]},
    {"group_num":4,"points":[[35.3904, -118.99908],[35.39045, -118.99431],[35.38989, -118.99442],[35.38984, -118.99625],[35.38863, -118.99616],[35.38786, -118.99702],[35.38776, -118.99786],[35.38595, -118.99809],[35.38596, -118.99722],[35.38556, -118.99723],[35.38556, -118.9994],[35.38594, -118.99941],[35.38774, -118.99927],[35.38782, -118.99853],[35.3899, -118.99853],[35.38993, -118.99906],[35.39043, -118.99906]]},
    {"group_num":5,"points":[[35.38641, -118.99702],[35.38595, -118.99696],[35.3854, -118.99435],[35.38773, -118.99357],[35.38789, -118.99405],[35.389, -118.99472],[35.38913, -118.99524],[35.38786, -118.99561],[35.38735, -118.99442],[35.38598, -118.99489],[35.38656, -118.99702]]},
    {"group_num":6,"points":[[35.39276, -118.99479],
    [35.39285, -118.992],[35.39434, -118.99186],[35.39433, -118.99109],[35.39281, -118.99099],[35.3928, -118.988],[35.39223, -118.98794],[35.39218, -118.99094],[35.39127, -118.99105],[35.3912, -118.99309], [35.39048, -118.99318], [35.39061, -118.99462]]},
    {"group_num":7,"points":[[35.39102, -118.99279],[35.39108, -118.98647],[35.39062, -118.98648],[35.39069, -118.99275]]},
    {"group_num":8,"points":[[35.38202, -118.9982],[35.38318, -118.99811],[35.38335, -118.99337],[35.38796, -118.9932],[35.38808, -118.99399],[35.39063, -118.99302],[35.39068, -118.99268],[35.39034, -118.99268],[35.39036, -118.99099],[35.38985, -118.98901],[35.38945, -118.98921],[35.38993, -118.99129],[35.38998, -118.99271],[35.38957, -118.99269],[35.38878, -118.98919],[35.38832, -118.98938],[35.38794, -118.99062],[35.38615, -118.99172],[35.38578, -118.99022],[35.38697, -118.98968],[35.38685, -118.98919],[35.38516, -118.9897],[35.38483, -118.99149],[35.38474, -118.99248],[35.3821, -118.99249],[35.38209, -118.99806]]}
    ]'''
    # print(regions)
    return HttpResponse(regions)



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


def query_for_dataTable(request):
    simulation_name = request.GET.get('simulation_name')
    database_name = request.GET.get('database')
    field = request.GET.get('field')
    table = request.GET.get('table')
    print simulation_name, database_name, field, table
    database.connect_to_database(simulation_name, database_name)
    meters = database.query_database(simulation_name, database_name, field, table)
    print meters
    return HttpResponse(json.dumps(meters), content_type="application/json")


def query_for_feeder(request):
    sw_list = analyze.get_object_list('ieee123', "sw")
    cap_list = analyze.get_object_list('ieee123', "cap")
    context = {"sw_list": sw_list, "cap_list": cap_list}
    return render(request, 'vader/_console-feeder.html', context)
