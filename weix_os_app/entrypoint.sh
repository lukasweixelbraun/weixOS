#!/bin/sh
set -e

# bundle install
cd ${RAILS_ROOT}
bundle install

# db migrate
bin/rake db:migrate
bin/rake db:setup

npm install
yarn install
# compile webpacker

bin/rails webpacker:compile

# Generate Assets
bin/rake assets:clobber
bin/rake assets:precompile

exec "$@"
