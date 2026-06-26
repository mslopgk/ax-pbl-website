# ── AX-PBL · multi-stage build (build context = project root) ──────────────
# Stage 1: build the Vite/React SPA
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm install
COPY . .
RUN npm run build

# Stage 2: serve with nginx (SPA + static concept 시안s)
FROM nginx:alpine
RUN rm -f /etc/nginx/conf.d/default.conf
COPY deploy/nginx.conf /etc/nginx/conf.d/axedu.conf
# main app
COPY --from=build /app/dist /usr/share/nginx/html
# design-concept gallery + 12 시안s (served at /concepts/)
COPY --from=build /app/concepts /usr/share/nginx/html/concepts
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=4s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
