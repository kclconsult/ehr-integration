#!/bin/sh

export CONSULT_DEV_HOME=/Users/sklar/research/consult/dev/
cd $CONSULT_DEV_HOME/ehr-integration
#virtualenv env
#. env/bin/activate
#pip install nodeenv
#nodeenv nenv
. nenv/bin/activate
#cat requirements.txt | xargs npm install -g
npm start
