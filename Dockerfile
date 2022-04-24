FROM node:11
# ~MDC Not a huge fan of direct communication between grey and danvers, but enabled at present.
COPY ./proxy/certs/consult.crt consult.crt
ENV user node
USER $user
WORKDIR /home/$user
COPY --chown=$user:$user package.json .
RUN npm install --only=production
RUN npm config set prefix "/home/$user/.npm-packages"
RUN npm install sequelize-cli -g
ENV PATH="/home/$user/.npm-packages/bin:${PATH}"
# Copy code
COPY --chown=$user:$user . .
# Later ensures SQL start can be waited for.
COPY --chown=$user:$user ./bin/wait-for-it.sh wait-for-it.sh
# Run config
ENV NODE_ENV production
EXPOSE 3003
CMD ["npm", "start"]
