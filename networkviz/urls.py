from django.conf.urls import url

from . import views

urlpatterns = [
    ## Landing Page
    url(r'^$', views.index, name='index'),

    ## Core Visualizations
    url(r'^map', views.map, name='map'),
    url(r'^console', views.console, name='console'),
    url(r'^dashboard', views.dashboard, name='dashboard'),

    ## Base Pages for Demos
    url(r'^dualmap', views.dualmap, name='dualmap'),

    ## Scientific Demos
    url(r'^switch-prediction', views.switch_prediction, name='switch-prediction'),
    url(r'^planning', views.planning, name='planning'),
    url(r'^real-time', views.realtime, name='real-time'),
    url(r'^PVDisagg', views.pvdisagg, name='disaggMain'),
    url(r'^MLPowerFlow', views.mlpowerflow, name='MLPowerFlow'),
    url(r'^forecasting', views.forecasting, name='forecasting'),
    url(r'^forecasting-pge', views.forecasting_pge, name='forecasting'),
    url(r'^topology', views.topology, name='topology'),
    url(r'^dataplug', views.dataplug, name='dataplug'),


    # API for VOLTAGE AND PV DISAGG demos
    url(r'^api/(?P<simulation_name>[a-zA-Z0-9_]+)/voltage/(?P<region_id>[0-9]+)/(?P<bus_id>[0-9]+)$', views.voltageWarning, name='region_disagg'),
    url(r'^api/(?P<simulation_name>[a-zA-Z0-9_]+)/pv/(?P<region_id>[0-9]+)$', views.disaggregateRegion, name='region_disagg'),


    # API for Simulation Elements
    url(r'^api/(?P<simulation_name>[a-zA-Z0-9_]+)/meter/$', views.api_meters),
    url(r'^api/(?P<simulation_name>[a-zA-Z0-9_]+)/meter/(?P<element_query>[a-zA-Z0-9_\*]+)$', views.api_meters),

    url(r'^api/(?P<simulation_name>[a-zA-Z0-9_]+)/switch/$', views.api_switches),
    url(r'^api/(?P<simulation_name>[a-zA-Z0-9_]+)/switch/state/$', views.api_switch_state),
    url(r'^api/(?P<simulation_name>[a-zA-Z0-9_]+)/switch/state/(?P<actual>[a-zA-Z0-9_]+)$', views.api_switch_state),
    url(r'^api/(?P<simulation_name>[a-zA-Z0-9_]+)/switch/(?P<element_query>[a-zA-Z0-9_\*]+)$', views.api_switches),

    url(r'^api/(?P<simulation_name>[a-zA-Z0-9_]+)/load/$', views.api_loads),
    url(r'^api/(?P<simulation_name>[a-zA-Z0-9_]+)/load/(?P<element_query>[a-zA-Z0-9_\*]+)$', views.api_loads),

    url(r'^api/(?P<simulation_name>[a-zA-Z0-9_]+)/node/$', views.api_nodes),
    url(r'^api/(?P<simulation_name>[a-zA-Z0-9_]+)/node/(?P<element_query>[a-zA-Z0-9_\*]+)', views.api_nodes),

    url(r'^api/(?P<simulation_name>[a-zA-Z0-9_]+)/house/$', views.api_houses),
    url(r'^api/(?P<simulation_name>[a-zA-Z0-9_]+)/house/(?P<element_query>[a-zA-Z0-9_\*]+)', views.api_houses),

    # Also you should check for Line Sensors
    url(r'^api/(?P<simulation_name>[a-zA-Z0-9_]+)/line/$', views.api_lines),
    url(r'^api/(?P<simulation_name>[a-zA-Z0-9_]+)/line/(?P<element_query>[a-zA-Z0-9_\*]+)', views.api_lines),
    url(r'^api/(?P<simulation_name>[a-zA-Z0-9_]+)/sensor/$', views.api_sensors),
    url(r'^api/(?P<simulation_name>[a-zA-Z0-9_]+)/sensor/(?P<element_query>[a-zA-Z0-9_\*]+)', views.api_sensors),

    url(r'^api/(?P<simulation_name>[a-zA-Z0-9_]+)/region/$', views.api_regions),
    url(r'^api/(?P<simulation_name>[a-zA-Z0-9_]+)/region/(?P<element_query>[a-zA-Z0-9_\*]+)', views.api_regions),

    url(r'^api/(?P<simulation_name>[a-zA-Z0-9_]+)/capacitor/$', views.api_capacitors),

    url(r'^api/(?P<simulation_name>[a-zA-Z0-9_]+)/feeder/$', views.query_for_feeder, name='feeder'),
    url(r'^api/(?P<simulation_name>[a-zA-Z0-9_]+)/climate', views.query_for_climate, name='climate'),

    ## User Interface specific helpers
    url(r'^getdata/(?P<simulation_name>[a-zA-Z0-9_]+)/datatable', views.query_for_datatable, name='datatable'),
    url(r'^getdata/(?P<simulation_name>[a-zA-Z0-9_]+)/cards', views.query_for_cards, name='cards'),
    url(r'^getdata/(?P<simulation_name>[a-zA-Z0-9_]+)/live', views.get_live_data),
    url(r'^getdata/(?P<simulation_name>[a-zA-Z0-9_]+)/history', views.get_history_data),
    url(r'^getdata/(?P<simulation_name>[a-zA-Z0-9_]+)/total-power', views.get_total_power),
    url(r'^getdata/(?P<simulation_name>[a-zA-Z0-9_]+)/structure', views.structure)
]
