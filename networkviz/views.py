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
    try:
        url = "http://gridlabd.slac.stanford.edu:6267/json/%s/*" % (element_name)
        r = requests.get(url, timeout=0.5)
        if r:
            return JsonResponse(r.json());
        else:
            return JsonResponse({});
    # print(respon)
    except:
        return;

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
