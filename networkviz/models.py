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
