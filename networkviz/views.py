from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

# Create your views here.

def index(request):
    return HttpResponse("""
    Made it to the index!

    """)

def vader(request):
    template = loader.get_template('vader/base.html')
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
