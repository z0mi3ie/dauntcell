# https://hub.docker.com/r/fenglc/pgadmin4
# 
#    localhost:5050/
#    default admin (from public docs, so not secret :))
#    user: pgadmin4@pgadmin.org
#    password: admin
#
#    Add server for dauntcell-pg:5432

docker run --name dauntcell-pgadmin4 \
           --link dauntcell-pg:dauntcell-pg \
           -p 5050:5050 \
           -d fenglc/pgadmin4