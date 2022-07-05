# pull official base image
FROM node:17-alpine

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
# RUN npm install react-scripts@3.4.1 -g --silent


# add app
COPY . ./

EXPOSE 3000

# start app
CMD ["npm", "start"]