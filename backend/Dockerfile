FROM node:10

# set working directory
WORKDIR /app

COPY . ./

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies

RUN npm install
CMD [ "npm", "run", "createTables" ]
CMD [ "npm", "run", "createAdmin" ]
# start app
CMD [ "npm", "run", "dev" ]
