"""
Unlike climate.py and simulation.py, there is no abbreviation in this module.
This is because the names here (e.g. sw13to152, sw18to135) cannot be easily abbreviated.
"""
from networkviz.utilities.connection import *
from networkviz.utilities.simulation import clock


valid_key = {
    'm': {
        'alias': 'modelname',                   'basic':        'modelname',
        'callback': model_name
    },
}
