from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^demo/', views.demo, name='demo'),
    url(r'^medium/', views.medium, name='medium'),
    url(r'^cmu/', views.cmu, name='cmu'),
    url(r'^d3/', views.d3, name='d3'),
    url(r'^ieee123/', views.ieee123, name='ieee123'),
    url(r'^vader/map', views.vader, name='vader'),
    url(r'^vader/console', views.console, name='console'),
    url(r'^vader/graphTest', views.graphTest, name='graphTest'),
]
