from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^demo/', views.demo, name='demo'),
    url(r'^medium/', views.medium, name='medium'),
    url(r'^gent/', views.gent, name='gent'),
    url(r'^cmu/', views.cmu, name='cmu'),
    url(r'^d3/', views.d3, name='d3'),
    url(r'^ieee123/', views.ieee123, name='ieee123'),
    url(r'^map', views.map, name='map'),
    url(r'^switch-prediction', views.dualmap, name='dualmap'),
    url(r'^console', views.console, name='console'),
    url(r'^dashboard', views.dashboard, name='dashboard'),
    url(r'^planning', views.planning, name='planning'),
    url(r'^real-time', views.realtime, name='real-time'),
    url(r'^PVDisagg', views.pvdisagg, name='disaggMain'),
    url(r'^MLPowerFlow', views.mlpowerflow, name='MLPowerFlow'),

    # API for VOLTAGE AND PV DISAGG demos
    url(r'^VoltageAPI/(?P<region_id>[0-9]+)/(?P<bus_id>[0-9]+)$', views.voltageWarning, name='region_disagg'),
    url(r'^PVAPI/(?P<region_id>[0-9]+)$', views.disaggregateRegion, name='region_disagg'),


    # API for Simulation Elements
    url(r'^api/meter/$', views.api_meters),
    url(r'^api/meter/(?P<element_query>[a-zA-Z0-9_\*]+)$', views.api_meters),

    url(r'^api/switch/$', views.api_switches),
    url(r'^api/switch/state/$', views.api_switch_state),
    url(r'^api/switch/state/(?P<actual>[a-zA-Z0-9_]+)$', views.api_switch_state),
    url(r'^api/switch/(?P<element_query>[a-zA-Z0-9_\*]+)$', views.api_switches),

    url(r'^api/load/$', views.api_loads),
    url(r'^api/load/(?P<element_query>[a-zA-Z0-9_\*]+)$', views.api_loads),

    url(r'^api/node/$', views.api_nodes),
    url(r'^api/node/(?P<element_query>[a-zA-Z0-9_\*]+)', views.api_nodes),

    url(r'^api/house/$', views.api_houses),
    url(r'^api/house/(?P<element_query>[a-zA-Z0-9_\*]+)', views.api_houses),

    # Also you should check for Line Sensors
    url(r'^api/line/$', views.api_lines),
    url(r'^api/line/(?P<element_query>[a-zA-Z0-9_\*]+)', views.api_lines),
    url(r'^api/sensor/$', views.api_sensors),
    url(r'^api/sensor/(?P<element_query>[a-zA-Z0-9_\*]+)', views.api_sensors),

    url(r'^api/region/$', views.api_regions),
    url(r'^api/region/(?P<element_query>[a-zA-Z0-9_\*]+)', views.api_regions),

    url(r'^api/capacitor/$', views.api_capacitors),

    url(r'^api/feeder/$', views.query_for_feeder, name='feeder'),
    url(r'^datatable', views.query_for_dataTable, name='datatable'),
]
