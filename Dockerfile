### STAGE 1:BUILD DE L'APPLICATION ###

# Utilisation de l'image de nodje alpine
FROM node:20.9.0-alpine3.17 AS build

# creation d'un dossier virtuel dans l'image
WORKDIR /dist/src/app

# copie des fichiers des dependences
COPY package.json package-lock.json ./

# Vider tous les caches
RUN npm cache clean --force

# copy des fichiers locaux dans l'image
COPY . .

ARG ENVIRONMENT=production
RUN npm install
RUN npm run build -- $ENVIRONMENT

### STAGE 2: LANCEMENT DE L'APPLICATION ###
# Definition de l'image nginx à utliser
FROM nginx:latest AS ngi
COPY --from=build /dist/src/app/dist/bhadmin /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf
# Exposé le port 7003
EXPOSE 7010

