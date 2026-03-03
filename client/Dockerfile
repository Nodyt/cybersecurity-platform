FROM node:18-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Provide API URL at build time for Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM node:18-slim
WORKDIR /app
RUN npm install express@4
COPY --from=builder /app/dist ./dist
# Simple express server to serve static files
RUN echo "const express = require('express'); const path = require('path'); const app = express(); const PORT = process.env.PORT || 3000; app.use(express.static(path.join(__dirname, 'dist'))); app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'dist', 'index.html')); }); app.listen(PORT, () => { console.log('Server running on port ' + PORT); });" > server.js
EXPOSE 3000
CMD ["node", "server.js"]
