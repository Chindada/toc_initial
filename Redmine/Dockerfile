FROM redmine

COPY redmine_agile-1_5_4-light.zip /usr/src/redmine/plugins/
RUN apt update \
    && apt -y install unzip \
    && cd /usr/src/redmine/plugins/ \
    && unzip redmine_agile-1_5_4-light.zip \
    && rm redmine_agile-1_5_4-light.zip \
    && apt -y install git

RUN git clone https://github.com/makotokw/redmine-theme-gitmike.git public/themes/gitmike
RUN git clone https://gitlab.com/bdemirkir/sidebar_hide.git plugins/sidebar_hide

RUN bundle install --without development test --no-deployment
RUN bundle exec rake redmine:plugins NAME=redmine_agile RAILS_ENV=production