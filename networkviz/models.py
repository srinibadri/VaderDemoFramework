import datetime
from django.db import models
from django.utils import timezone

# Create your models here.
class Map(models.Model):
    map_name = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published')

    def __str__(self):
        return self.map_name

    def was_published_recently(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)

class Event(models.Model):
    event_name = models.CharField(max_length=200)
    event_type = models.CharField(max_length=200)
    event_date = models.DateTimeField('event time')

    def __str__(self):
        return "("+str(self.event_type)+") " + self.event_name + " at " + str(self.event_date)

class LiveState(models.Model):
    MAX_DIGITS = 15
    DECIMAL_PLACES = 5

    model_name = models.CharField(max_length=200)

    total_power_generation = models.IntegerField(default=0)
    total_power_demand = models.IntegerField(default=0)
    average_efficiency = models.DecimalField(max_digits=MAX_DIGITS, decimal_places=DECIMAL_PLACES)
    pv_output = models.IntegerField(default=0)
    battery_storage = models.IntegerField(default=0)
    network_healthy = models.DecimalField(max_digits=MAX_DIGITS, decimal_places=DECIMAL_PLACES)

    def __str__(self):
        return '{"model-name":"'+str(self.model_name)+ '","total-live-power-generation":"'+str(self.total_power_generation)+ ',"total-live-power-demand":"'+str(self.total_power_demand)+ '","average-efficiency":"'+str(self.average_efficiency)+ '","total-live-pv-output":"'+str(self.pv_output)+ '","total-live-battery-storage":"'+str(self.battery_storage)+ '","live-network-healthy":"'+str(self.network_healthy)+'"}'
