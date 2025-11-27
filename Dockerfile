# ---------- Сборка зависимостей и билда ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package файлы и устанавливаем зависимости
COPY package.json package-lock.json* ./
RUN npm ci

# Копируем остальной код и собираем Next.js
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---------- Продакшен-контейнер ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Копируем только нужное для рантайма
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

EXPOSE 3000

# Используем стандартный next start
CMD ["npm", "run", "start"]

