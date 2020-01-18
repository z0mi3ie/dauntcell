#!/bin/bash

#IMAGE_NAME='dc-postgres'

#POSTGRES_PASSWORD='password'

#docker build . \
#    --tag ${IMAGE_NAME}

#docker run ${IMAGE_NAME} \
#    -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
#    -d postgres

docker run \
    --rm \
    --name pg_docker \
    --env POSTGRES_PASSWORD=docker \
    --env POSTGRES_USER=docker \
    --env POSTGRES_DB=dauntcell \
    --publish 5432:5432 \
    --name dauntcell-pg \
    postgres