# -------------
# WEIXOS APP PUMA
# -------------
FROM ruby:3.0.1-alpine

# Set working directory, where the commands will be ran
WORKDIR /var/www

# Install dependencies
RUN apk add --update --no-cache \
    build-base \
    bash \
    openssh \
    postgresql-dev \
    tzdata \
    nodejs \
    npm \
    yarn

# Install python/pip
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

# Set an environment variables for rails
ENV RAILS_ROOT="/var/www/weix_os"
ENV SECRET_KEY_BASE=17ffad5bbab9e0939f560eb9214d62086e13aca81abd66aa66e0d23929bd65386381497c9a6fa58006b6fccf4bbcd687a2059d1821acc9eeafb4498d00e4c563
ENV RAILS_SERVE_STATIC_FILES=false

# copy data
COPY ./app ${RAILS_ROOT}

# bundle install
RUN cd ${RAILS_ROOT} && \
    bundle install

RUN rm -rf ${RAILS_ROOT}

RUN mkdir -p ${RAILS_ROOT}/tmp/pids/

# Initialize container at runtime
COPY entrypoint.sh /usr/local/bin/
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

VOLUME ["/usr/local/bundle", "${RAILS_ROOT}"]

EXPOSE 3000
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
