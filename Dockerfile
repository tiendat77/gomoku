### STAGE 1: Build ###
FROM node:18-alpine AS build
WORKDIR /build
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

### STAGE 2: Run ###
FROM nginx:alpine
WORKDIR /www
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/dist /www

EXPOSE 80

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]
