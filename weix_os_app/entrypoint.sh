#!/bin/sh
set -e

# bundle install
cd ${RAILS_ROOT}
bundle install

# db migrate
bin/rake db:migrate

# compile webpacker
bin/rails webpacker:compile

exec "$@"
