FROM redmine

RUN apt install -y git

RUN git clone https://github.com/makotokw/redmine-theme-gitmike.git public/themes/gitmike
RUN git clone https://gitlab.com/bdemirkir/sidebar_hide.git plugins/sidebar_hide
RUN git clone https://github.com/RubyClickAP/clipboard_image_paste.git plugins/clipboard_image_paste

RUN apt install -y build-essential imagemagick libmagickcore-dev libmagickwand-dev ruby-dev && gem install rmagick

COPY a1 public/themes/a1
