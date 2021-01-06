FROM redmine

RUN apt install -y git
RUN git clone https://github.com/makotokw/redmine-theme-gitmike.git public/themes/gitmike
RUN git clone https://gitlab.com/bdemirkir/sidebar_hide.git plugins/sidebar_hide

COPY redmine_agile /plugins/redmine_agile
# WORKDIR /var/www/redmine
RUN apt install -y build-essential imagemagick libmagickcore-dev libmagickwand-dev ruby-dev
RUN bundle install --without development test --no-deployment
RUN bundle exec rake redmine:plugins NAME=redmine_agile RAILS_ENV=production