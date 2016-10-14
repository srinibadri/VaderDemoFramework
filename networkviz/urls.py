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
    url(r'^vader/map', views.vader, name='vader'),
    url(r'^vader/console', views.console, name='console'),
    url(r'^vader/PVDisagg', views.pvdisagg, name='PVDisagg'),
    url(r'^vader/planning', views.planning, name='planning'),
    url(r'^vader/real-time', views.realtime, name='real-time'),

]
