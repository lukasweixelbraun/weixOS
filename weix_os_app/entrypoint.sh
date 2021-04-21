#!/bin/sh
set -e

# bundle install
cd ${RAILS_ROOT}
bundle install

# db migrate
bin/rake db:migrate

# compile webpacker
bin/rails webpacker:compile

npm install
yarn install

# Generate Assets
bin/rake assets:clobber
bin/rake assets:precompile

exec "$@"
