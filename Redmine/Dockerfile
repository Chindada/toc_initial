FROM redmine
RUN pwd
COPY redmine_agile-1_5_4-light.zip plugins/redmine_agile-1_5_4-light.zip
WORKDIR /usr/src/redmine/plugins
RUN apt update \
    && apt -y install unzip \
    && unzip redmine_agile-1_5_4-light.zip \
    && rm redmine_agile-1_5_4-light.zip \
    && apt -y install git
WORKDIR /usr/src/redmine
RUN git clone https://github.com/makotokw/redmine-theme-gitmike.git public/themes/gitmike
RUN git clone https://gitlab.com/bdemirkir/sidebar_hide.git plugins/sidebar_hide
RUN bundle install --without development test --no-deployment
