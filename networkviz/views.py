from __future__ import division
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.template import loader
import untangle, requests, json
from utilities import analyze
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

def map(request):
    template = loader.get_template('vader/map.html')
    context = {}
    return HttpResponse(template.render(context, request))

def dualmap(request):
    template = loader.get_template('vader/dualmap.html')
    context = {}
    return HttpResponse(template.render(context, request))

def dualmap_api(request, actual='actual'):
    # switch_state = {"states":[True,False,True,True,False,True]}
    switch_state = {}
    #{"states":[{"sw0":False},{"sw1":False},{"sw2":False},{"sw3":True},{"sw4":False},{"sw5":True},{"sw6":False},{"sw7":True},{"sw8":False},{"sw9":False}]}

    print(switch_state)
    if actual.lower() == 'actual':
        switch_state = analyze.get_actual_switch_states()
        return JsonResponse(switch_state)
    elif actual.lower() == 'predicted':
        switch_state = analyze.get_predicted_switch_states()
        return JsonResponse(switch_state)
    else:
        return JsonResponse({})

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

def dummyapi(request, element_name="meter"):
    print("api")
    url = "http://gridlabd.slac.stanford.edu:6267/json/%s/*" % (element_name)
    r = requests.get(url, timeout=0.5)
    if r:
        return JsonResponse({element_name:r.json()});
    else:
        return JsonResponse("{}");
    # print(respon)

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
        static_loc='/home/eckara/Desktop/CMU_Practicum/VADER/VaderDemoFramework/networkviz/static/data/'
        #with open(static_loc+'objs.pickle') as f:  # Python 3: open(..., 'rb')
        agg_netload, predictors, alphas, model_names,models, solar_true, minute_of_day,arrs = pickle.load(open(static_loc+'objs.pickle','rb'))

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
    region_id=int(region_id)
    bus_id=int(bus_id)
    static_loc = '/home/eckara/Desktop/CMU_Practicum/VADER/VaderDemoFramework/networkviz/static/data/'
    with open(static_loc + 'dfs.pickle', 'rb') as f:
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