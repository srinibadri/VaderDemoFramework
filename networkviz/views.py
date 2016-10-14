from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
import untangle, requests, json
from utilities import *

# Create your views here.


def index(request):
    return HttpResponse("""
    Made it to the index!
    <a href="networkviz/board.html">Go here for the dashboard</a>
    """)

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
    respon = ""
    try:
        url = "http://gridlabd.slac.stanford.edu:6267/xml/%s/voltage_1" % (element_name)
        # print(url)
        r = requests.get(url, timeout=0.1)
        # print(r.text)
        obj = None
        if r:
            obj = untangle.parse(r.text)
        v1 = 0.0
        if obj:
            v1 = obj.property.value.cdata
        print("v1")

        obj_v2 = None
        r = requests.get("http://gridlabd.slac.stanford.edu:6267/xml/%s/voltage_2" % (element_name), timeout=0.1)
        if r:
            obj_v2 = untangle.parse(r.text)
        v2 = 0.0
        if obj_v2:
            v2 = obj.property.value.cdata
        print("v2")

        obj_v3 = None
        r = requests.get("http://gridlabd.slac.stanford.edu:6267/xml/%s/voltage_3" % (element_name), timeout=0.1)
        if r:
            obj_v3 = untangle.parse(r.text)
        v3 = 0.0
        if obj_v3:
            v3 = obj.property.value.cdata
        print("v3")

        obj_p1 = None
        r = requests.get("http://gridlabd.slac.stanford.edu:6267/xml/%s/power_1" % (element_name), timeout=0.1)
        if r:
            obj_p1 = untangle.parse(r.text)
        p1 = 0.0
        if obj_p1:
            p1 = obj.property.value.cdata
        print("p1")

        obj_p2 = None
        r = requests.get("http://gridlabd.slac.stanford.edu:6267/xml/%s/power_2" % (element_name), timeout=0.1)
        if r:
            obj_p2 = untangle.parse(r.text)
        p2 = 0.0
        if obj_p2:
            p2 = obj.property.value.cdata
        print("p2")

        obj_p3 = None
        r = requests.get("http://gridlabd.slac.stanford.edu:6267/xml/%s/power_3" % (element_name), timeout=0.1)
        if r:
            obj_p3 = untangle.parse(r.text)
        p3 = 0.0
        if obj_p3:
            p3 = obj.property.value.cdata
        print("p3")

        respon = {"object":obj.property.object.cdata,
            "name":obj.property.name.cdata,
            "value":obj.property.value.cdata,
            "voltage_1": v1,
            "voltage_2": v2,
            "voltage_3": v3,
            "power_1": p1,
            "power_2": p2,
            "power_3": p3}

        return HttpResponse(json.dumps(respon));

    # print(respon)
    except:
        return;
