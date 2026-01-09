# Configuración y Desarrollo

## Requisitos

- Node.js 20.x + Angular CLI 17.x
- Cuenta de Firebase

## Setup Local

```bash
# Instalar
npm install

# Configurar environment.local.ts
cp src/environments/environment.ts src/environments/environment.local.ts
# Actualizar con tus endpoints y Firebase API Key
```

## Desarrollo

```bash
npm run start:local  # Backend local (http://localhost:4200)
npm run start        # Backend producción
npm run watch        # Build con watch
```

## Build

```bash
npm run build:prod   # Producción (tree shaking, minificado)
npm run build:local  # Desarrollo (source maps)
```

**Optimizaciones automáticas:** Tree shaking, minificación, hashing, budgets (650kb/1mb)

## Testing

```bash
npm run test:e2e        # Headless
npm run test:e2e:open   # UI
npm run test:e2e:prod   # Contra producción
```

## Deploy

```bash
npm run deploy          # Manual
```

Push a `main` → Deploy automático

## Variables de Entorno

**Local:** `environment.local.ts`
**Producción:** GitHub Secrets (`FIREBASE_API_KEY`, `FIREBASE_SERVICE_ACCOUNT`)

## Comandos Útiles

```bash
npm run lint                                  # ESLint
ng g c components/nombre --standalone         # Generar componente
ng g s core/services/nombre                   # Generar servicio
rm -rf node_modules package-lock.json dist && npm install  # Reset
```

## Troubleshooting

```bash
# Puerto ocupado
lsof -i :4200 && kill -9 <PID>

# Build falla
rm -rf .angular && npm run build:prod

# Cypress
npm install cypress --save-dev && npx cypress verify
```

## CI/CD

**Workflows:** CI (lint, build, E2E) | CD (deploy Firebase)

**Secrets GitHub:**
```bash
FIREBASE_SERVICE_ACCOUNT=<json>
FIREBASE_API_KEY=<key>
```
