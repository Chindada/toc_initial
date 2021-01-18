# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY ./vue/ /app/vue/
RUN npm install
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# CMD envsubst '${BACKEND_URI}' < /etc/nginx/conf.d/nginx.site.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'

