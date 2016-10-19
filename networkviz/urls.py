from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^demo/', views.demo, name='demo'),
    url(r'^medium/', views.medium, name='medium'),
    url(r'^gent/', views.gent, name='gent'),
    url(r'^cmu/', views.cmu, name='cmu'),
    url(r'^d3/', views.d3, name='d3'),
    url(r'^api/(?P<element_name>[a-zA-Z0-9_]+)', views.dummyapi, name='dummyapi'),
    url(r'^ieee123/', views.ieee123, name='ieee123'),
    url(r'^map', views.map, name='map'),
    url(r'^console', views.console, name='console'),
    url(r'^dashboard', views.dashboard, name='dashboard'),
    url(r'^planning', views.planning, name='planning'),
    url(r'^real-time', views.realtime, name='real-time'),
    url(r'^PVDisagg/(?P<region_id>[0-9]+)$', views.pvdisagg, name='region_disagg'),
]
