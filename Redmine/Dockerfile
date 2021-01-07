FROM redmine
RUN pwd

COPY redmine_agile-1_5_4-light.zip plugins/redmine_agile-1_5_4-light.zip
COPY redmine_checklists-3_1_18-light.zip plugins/redmine_checklists-3_1_18-light.zip
COPY configuration.yml config/configuration.yml

WORKDIR /usr/src/redmine/plugins
RUN apt update \
    && apt -y install unzip \
    && unzip redmine_agile-1_5_4-light.zip \
    && rm redmine_agile-1_5_4-light.zip \
    && unzip redmine_checklists-3_1_18-light.zip \
    && rm redmine_checklists-3_1_18-light.zip \
    && apt -y install git

WORKDIR /usr/src/redmine

COPY a1 public/themes/a1

RUN git clone https://github.com/makotokw/redmine-theme-gitmike.git public/themes/gitmike
RUN git clone https://github.com/akiko-pusu/redmine_banner.git plugins/redmine_banner
RUN git clone https://gitlab.com/bdemirkir/sidebar_hide.git plugins/sidebar_hide

RUN bundle install --without development test --no-deployment
