FROM redmine

RUN install_packages build-essential default-libmysqlclient-dev libpq-dev libmagickwand-dev
RUN git clone https://github.com/makotokw/redmine-theme-gitmike.git public/themes/gitmike
RUN git clone https://gitlab.com/bdemirkir/sidebar_hide.git plugins/sidebar_hide

COPY redmine_agile /var/www/redmine/plugins/redmine_agile
WORKDIR /var/www/redmine
RUN bundle install --without development test --no-deployment
RUN bundle exec rake redmine:plugins NAME=redmine_agile RAILS_ENV=production