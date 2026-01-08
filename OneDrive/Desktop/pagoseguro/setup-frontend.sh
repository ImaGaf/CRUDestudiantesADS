#!/bin/bash

# ============================================================================
# Script de Inicialización del Frontend - PagoSeguroAGROTAC
# React 18 + TypeScript + Vite + Tailwind CSS
# ============================================================================

echo "🚀 Iniciando configuración del frontend..."

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo primero."
    exit 1
fi

echo "✅ Node.js encontrado: $(node -v)"
echo "✅ npm encontrado: $(npm -v)"

# ============================================================================
# CREAR PROYECTO CON VITE
# ============================================================================

echo ""
echo "📦 Creando proyecto con Vite..."

# Crear proyecto React + TypeScript con Vite
npm create vite@latest pagoseguro-frontend -- --template react-ts

cd pagoseguro-frontend

# ============================================================================
# INSTALAR DEPENDENCIAS
# ============================================================================

echo ""
echo "📥 Instalando dependencias principales..."

npm install react-router-dom@^6.20.1 \
            zustand@^4.4.7 \
            axios@^1.6.2 \
            react-hook-form@^7.49.2 \
            zod@^3.22.4 \
            @hookform/resolvers@^3.3.3 \
            lucide-react@^0.294.0

echo ""
echo "📥 Instalando dependencias de desarrollo..."

npm install -D tailwindcss@^3.3.6 \
               postcss@^8.4.32 \
               autoprefixer@^10.4.16

# ============================================================================
# INICIALIZAR TAILWIND CSS
# ============================================================================

echo ""
echo "🎨 Configurando Tailwind CSS..."

npx tailwindcss init -p

# ============================================================================
# CREAR ESTRUCTURA DE CARPETAS
# ============================================================================

echo ""
echo "📁 Creando estructura de carpetas..."

# Eliminar src por defecto y recrear estructura
rm -rf src
mkdir -p src/{components,pages,hooks,stores,services,schemas,types,utils,assets}

# Subcarpetas específicas
mkdir -p src/components/auth
mkdir -p src/components/common
mkdir -p src/components/layout
mkdir -p src/pages/auth
mkdir -p src/pages/dashboard

echo "✅ Estructura de carpetas creada"

# ============================================================================
# CREAR ARCHIVOS DE CONFIGURACIÓN
# ============================================================================

echo ""
echo "📝 Creando archivos de configuración..."

# tailwind.config.js
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#16a34a',
          600: '#15803d',
          700: '#166534',
          800: '#14532d',
          900: '#052e16',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
EOF

# postcss.config.js
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# vite.config.ts
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
EOF

# tsconfig.json (mejorado con alias)
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path alias */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

# .env.example
cat > .env.example << 'EOF'
# API Backend URL
VITE_API_URL=http://localhost:3000/api/v1

# Environment
VITE_ENV=development
EOF

# .env
cat > .env << 'EOF'
# API Backend URL
VITE_API_URL=http://localhost:3000/api/v1

# Environment
VITE_ENV=development
EOF

# .gitignore (agregar si no existe)
cat > .gitignore << 'EOF'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.*.local
EOF

# ============================================================================
# CREAR ARCHIVOS BASE
# ============================================================================

echo ""
echo "📄 Creando archivos base..."

# src/index.css
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-gray-50 text-gray-900 antialiased;
  }
}

@layer components {
  /* Botones */
  .btn-primary {
    @apply bg-primary-500 text-white px-4 py-2 rounded-lg font-medium 
           hover:bg-primary-600 transition-colors duration-200 
           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
           disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-secondary {
    @apply bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium 
           hover:bg-gray-300 transition-colors duration-200 
           focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
           disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-danger {
    @apply bg-red-500 text-white px-4 py-2 rounded-lg font-medium 
           hover:bg-red-600 transition-colors duration-200 
           focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
           disabled:opacity-50 disabled:cursor-not-allowed;
  }

  /* Inputs */
  .input-field {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg 
           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
           disabled:bg-gray-100 disabled:cursor-not-allowed
           transition-all duration-200;
  }

  .input-error {
    @apply border-red-500 focus:ring-red-500;
  }

  /* Labels */
  .label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }

  .label-required::after {
    content: " *";
    @apply text-red-500;
  }

  /* Mensajes de error */
  .error-text {
    @apply text-sm text-red-600 mt-1 flex items-center gap-1;
  }

  /* Cards */
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }

  .card-header {
    @apply border-b border-gray-200 pb-4 mb-4;
  }

  /* Alerts */
  .alert {
    @apply px-4 py-3 rounded-lg mb-4;
  }

  .alert-success {
    @apply bg-green-50 border border-green-200 text-green-700;
  }

  .alert-error {
    @apply bg-red-50 border border-red-200 text-red-700;
  }

  .alert-warning {
    @apply bg-yellow-50 border border-yellow-200 text-yellow-700;
  }

  .alert-info {
    @apply bg-blue-50 border border-blue-200 text-blue-700;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
EOF

# src/main.tsx
cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
EOF

# src/App.tsx (básico)
cat > src/App.tsx << 'EOF'
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<div className="p-8 text-center">Login Page - En construcción</div>} />
        <Route path="/register" element={<div className="p-8 text-center">Register Page - En construcción</div>} />
      </Routes>
    </div>
  )
}

export default App
EOF

# src/vite-env.d.ts
cat > src/vite-env.d.ts << 'EOF'
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
EOF

# index.html (mejorado)
cat > index.html << 'EOF'
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Sistema de gestión de pagos y créditos - El Granito AGROTAC" />
    <title>El Granito - Sistema de Pagos</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

# README.md
cat > README.md << 'EOF'
# PagoSeguroAGROTAC - Frontend

Sistema de gestión de pagos y créditos para El Granito de AGROTAC.

## 🚀 Stack Tecnológico

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Zustand** - State Management
- **React Hook Form** - Form Handling
- **Zod** - Schema Validation
- **Axios** - HTTP Client
- **Lucide React** - Icons

## 📋 Prerequisitos

- Node.js >= 20.0.0
- npm >= 10.0.0

## ⚙️ Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones
```

## 🎯 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Build
npm run build            # Compilar para producción
npm run preview          # Preview de producción

# Linting
npm run lint             # Verificar código
```

## 🌐 Configuración

Edita el archivo `.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_ENV=development
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── auth/           # Componentes de autenticación
│   ├── common/         # Componentes comunes
│   └── layout/         # Layouts
├── pages/              # Páginas principales
│   ├── auth/           # Páginas de autenticación
│   └── dashboard/      # Dashboards por rol
├── hooks/              # Custom hooks
├── stores/             # Estado global (Zustand)
├── services/           # Servicios HTTP
├── schemas/            # Validaciones Zod
├── types/              # TypeScript types
├── utils/              # Utilidades
└── assets/             # Assets estáticos
```

## 🔐 Autenticación

El sistema implementa autenticación basada en JWT con:
- Access tokens (15 minutos)
- Refresh tokens (7 días)
- Rutas protegidas por rol
- Redirección automática

## 🎨 Diseño

- Paleta de colores verde institucional
- Diseño responsive
- Accesibilidad WCAG 2.1
- Componentes reutilizables con Tailwind

## 🧪 Testing

```bash
npm test                 # Ejecutar tests
npm run test:coverage    # Cobertura
```

## 📦 Build para Producción

```bash
npm run build
```

Los archivos optimizados estarán en la carpeta `dist/`

## 🚀 Deploy

El proyecto puede desplegarse en:
- Vercel
- Netlify
- GitHub Pages
- Servidor propio (Nginx/Apache)

## 📝 Licencia

MIT - Grupo 3 AGROTAC
EOF

# ============================================================================
# CREAR ARCHIVO .vscode/settings.json (opcional)
# ============================================================================

mkdir -p .vscode

cat > .vscode/settings.json << 'EOF'
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
EOF

cat > .vscode/extensions.json << 'EOF'
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "usernamehw.errorlens"
  ]
}
EOF

# ============================================================================
# CREAR ESTRUCTURA DE CARPETAS VACÍAS CON .gitkeep
# ============================================================================

echo ""
echo "📂 Creando archivos .gitkeep en carpetas vacías..."

touch src/components/common/.gitkeep
touch src/components/layout/.gitkeep
touch src/pages/dashboard/.gitkeep
touch src/utils/.gitkeep
touch src/assets/.gitkeep

# ============================================================================
# ACTUALIZAR package.json con scripts adicionales
# ============================================================================

echo ""
echo "📦 Configurando scripts en package.json..."

# Usar node para modificar package.json (más seguro que sed)
node << 'NODESCRIPT'
const fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

packageJson.scripts = {
  ...packageJson.scripts,
  "preview": "vite preview",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "type-check": "tsc --noEmit"
};

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
NODESCRIPT

# ============================================================================
# INSTRUCCIONES FINALES
# ============================================================================

echo ""
echo "================================================================"
echo "✅ FRONTEND CONFIGURADO EXITOSAMENTE"
echo "================================================================"
echo ""
echo "📂 Proyecto creado en: $(pwd)"
echo ""
echo "🎯 Próximos pasos:"
echo ""
echo "1️⃣  Revisar configuración:"
echo "   cat .env"
echo ""
echo "2️⃣  Iniciar servidor de desarrollo:"
echo "   npm run dev"
echo ""
echo "3️⃣  Abrir en el navegador:"
echo "   http://localhost:5173"
echo ""
echo "📝 Notas importantes:"
echo ""
echo "   • El backend debe estar corriendo en http://localhost:3000"
echo "   • Configura las variables de entorno en .env"
echo "   • Los componentes de autenticación deben ser agregados manualmente"
echo "   • Revisa el README.md para más información"
echo ""
echo "📚 Estructura creada:"
echo "   ✓ Configuración de Vite + React + TypeScript"
echo "   ✓ Tailwind CSS configurado"
echo "   ✓ Estructura de carpetas organizada"
echo "   ✓ Archivos de configuración listos"
echo "   ✓ Path alias @ configurado"
echo ""
echo "================================================================"
echo "🚀 ¡Listo para empezar a desarrollar!"
echo "================================================================"
echo ""
EOF

chmod +x setup-frontend.sh