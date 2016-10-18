from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
import untangle, requests, json
from utilities import *

# Create your views here.


def index(request):
    return render(request,'landing.html')

def dashboard(request):
    template = loader.get_template('vader/board.html')
    context = {}
    return HttpResponse(template.render(context, request))

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
    try:
        url = "http://gridlabd.slac.stanford.edu:6267/json/%s/*" % (element_name)
        r = requests.get(url, timeout=0.5)
        if r:
            return HttpResponse(r);
        else:
            return HttpResponse({});
    # print(respon)
    except:
        return;

def multiapi(request, element_names=["meter"]):
    print("api")
    try:
        url = "http://gridlabd.slac.stanford.edu:6267/json/%s/*" % (element_name)
        r = requests.get(url, timeout=0.5)
        if r:
            return HttpResponse(r);
        else:
            return HttpResponse({});
    # print(respon)
    except:
        return;

def pvdisagg(request):
    return render(request,'disagg.html')
def planning(request):
    return render(request,'planning.html')
def realtime(request):
    return render(request,'real-time.html')
