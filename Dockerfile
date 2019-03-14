FROM node:11

ENV user node

# Copy code
COPY package.json /home/$user/
COPY . /home/$user/

WORKDIR /home/$user

RUN chown $user --recursive .

USER $user

RUN cat requirements.txt | xargs npm install

RUN npm config set prefix "/home/$user/.npm-packages"
RUN npm install sequelize-cli -g
ENV PATH="/home/$user/.npm-packages/bin:${PATH}"

# Later ensures SQL start can be waited for.
RUN git clone https://github.com/vishnubob/wait-for-it.git

# Run config
ENV NODE_ENV production
EXPOSE 3001
CMD ["npm", "start"]