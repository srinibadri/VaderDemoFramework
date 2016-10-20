# Sets up all the necessary dependencies and launches the vader application

# Using Ubuntu for no particular reason
FROM ubuntu

MAINTAINER Ben Draffin <ben@bendraffin.com>

RUN apt-get update && apt-get upgrade -y && apt-get install -y \
    git \
    python \
    python-pip \
    python-dev \
    build-essential \
    libmysqlclient-dev \
    liblapack-dev \
     && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip
RUN pip install django untangle requests lxml pykml mysql-connector mysql mysql-connector-python-rf pandas scipy cvxopt

RUN git clone https://github.com/slacgismo/VaderDemoFramework.git

# RUN python VaderDemoFramework/manage.py runserver

# CMD ["/usr/bin/python", "/VaderDemoFramework/manage.py", "runserver"]
