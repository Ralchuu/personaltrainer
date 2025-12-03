##Dockerfile for Vite + React app

FROM node:18-alpine AS build
WORKDIR /app

# install dependencies (use package-lock if present)
COPY package*.json ./
RUN npm ci --silent

# copy source and build
COPY . .
RUN npm run build

# production image
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
