# README
## VADER Network Visualization

## To Install

### Mac

1. $ git clone https://github.com/slacgismo/VaderDemoFramework
1. $ brew update
1. $ brew upgrade
1. $ brew install <<<INCOMPLETE LIST>>>
1. $ pip2 install --upgrade pip
1. $ pip2 install django untangle requests lxml pykml mysql-connector mysql mysql-connector-python-rf pandas scipy cvxopt
1. $ cd VaderDemoFramework
1. $ git checkout master
1. $ python2 manage.py runserver



### Ubuntu

1. $ sudo apt-get update
1. $ sudo apt-get upgrade
1. $ sudo apt-get install -y git python python-pip python-dev build-essential libmysqlclient-dev liblapack-dev
1. $ pip install --upgrade pip
1. $ pip install django untangle requests lxml pykml mysql-connector mysql mysql-connector-python-rf pandas scipy cvxopt
1. $ git clone https://github.com/slacgismo/VaderDemoFramework.git
1. $ cd VaderDemoFramework
1. $ git checkout master
1. $ python manage.py runserver


### Docker

Install Docker (https://docs.docker.com/engine/installation/)

1. $ cd VaderDemoFramework/docker
1. $ docker build -t vader .
1. $ docker run -p 8000:8000 vader python VaderDemoFramework/manage.py runserver 0.0.0.0:8000

You can also replace the '8000's above with whatever port number you would like. The '-p 8000:8000' is -p <hostport>:<containerport>

For example, you could run on a public-facing webserver using:
$ docker run -p 80:8000 app python VaderDemoFramework/manage.py runserver 0.0.0.0:8000
