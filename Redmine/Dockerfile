FROM bitnami/redmine


RUN install_packages build-essential default-libmysqlclient-dev libpq-dev libmagickwand-dev
WORKDIR /opt/bitnami/redmine

RUN apt install -y git
RUN git clone https://github.com/makotokw/redmine-theme-gitmike.git public/themes/gitmike
RUN git clone https://gitlab.com/bdemirkir/sidebar_hide.git plugins/sidebar_hide

COPY redmine_agile /opt/bitnami/redmine/plugins/redmine_agile
RUN bundle install --no-deployment
RUN bundle exec rake redmine:plugins NAME=redmine_agile RAILS_ENV=production