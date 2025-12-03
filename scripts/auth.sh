#!/bin/sh
# This project depends on Google Cloud Vertex AI with ADC authentication. 
# During local development, we have to auth for running testing code and everything right. 

SCRIPT_DIR="$(cd -- "$(dirname -- "$0")" >/dev/null 2>&1 && pwd)"
source "$SCRIPT_DIR/../.env"

if gcloud auth application-default print-access-token > /dev/null; then
    echo "GCloud ADC Valid"
else
    gcloud -q auth application-default login
    gcloud -q config set project studio-507334424-2a172
fi

if gcloud auth print-access-token > /dev/null; then
    echo "GCloud Auth Valid"
else
    gcloud -q auth login
fi

if FIREBASE_LOGIN=$(firebase login:list); then
    echo "Firebase Auth Valid: $FIREBASE_LOGIN"
else
    firebase login
fi
