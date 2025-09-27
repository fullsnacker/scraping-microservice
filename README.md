# 🕷️ Scraping Microservice

Un microservicio de scraping robusto y escalable construido con **NestJS** que permite extraer datos estructurados de páginas web mediante reglas configurables.

## ✨ Características

- **🚀 Alto rendimiento** - Built con NestJS y Express
- **📦 Escalable** - Arquitectura basada en reglas modular
- **🔧 Fácil de extender** - Agrega nuevas reglas sin modificar código existente
- **🛡️ TypeSafe** - Desarrollado completamente en TypeScript
- **🌐 CORS habilitado** - Listo para integraciones frontend
- **⏱️ Timeouts configurables** - Manejo robusto de peticiones HTTP

## 📋 Requisitos

- Node.js 16+
- npm o yarn
- NestJS CLI

## 🚀 Instalación rápida

```bash
# Clonar el repositorio
git clone git@github.com:fullsnacker/scraping-microservice.git
cd scraping-microservice

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run start:dev
```

## 🏗️ Estructura del proyecto

```
src/
├── rules/                 # 🔧 Reglas de scraping
│   ├── rule.interface.ts  # Interfaz base para reglas
│   ├── rule.factory.ts    # Factory pattern para reglas
│   └── linkedin-job-positions.rule.ts  # Ejemplo de regla
├── scraper/               # 🕷️ Servicio principal de scraping
│   └── scraper.service.ts
├── dto/                   # 📝 Data Transfer Objects
└── app.module.ts          # 🧩 Módulo principal
```

## 📚 Uso

### 1. Obtener reglas disponibles

```bash
GET http://localhost:3000/scrape/rules
```

**Respuesta:**

```json
{
  "rules": ["linkedinJobPositions"]
}
```

### 2. Ejecutar scraping

```bash
POST http://localhost:3000/scrape
Content-Type: application/json

{
  "url": "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=react&location=Argentina",
  "ruleName": "linkedinJobPositions"
}
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "data": {
    "totalResults": 10,
    "jobPositions": [
      {
        "title": "Senior React Developer",
        "company": "Tech Company",
        "location": "Buenos Aires, Argentina",
        "date": "Hace 1 día",
        "link": "https://linkedin.com/jobs/view/123",
        "position": 1
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🛠️ Desarrollo

### Agregar una nueva regla de scraping

1. **Crear la nueva regla** en `src/rules/`:

```typescript
// src/rules/nueva-rule.rule.ts
import * as cheerio from 'cheerio';
import { ScrapingRule } from './rule.interface';

export class NuevaRule implements ScrapingRule {
  name = 'nuevaRule';

  async execute(html: string): Promise<any> {
    const $ = cheerio.load(html);
    // Tu lógica de scraping aquí
    return { datos: 'estructurados' };
  }
}
```

2. **Registrar la regla** en `RuleFactory`:

```typescript
// src/rules/rule.factory.ts
import { NuevaRule } from './nueva-rule.rule';

export class RuleFactory {
  private static rules: Map<string, ScrapingRule> = new Map();

  static {
    this.registerRule(new LinkedInJobPositionsRule());
    this.registerRule(new NuevaRule()); // ← Nueva regla
  }
  // ... resto del código
}
```

3. **¡Listo!** La nueva regla estará disponible automáticamente.

## 📊 Reglas incluidas

### 🔍 LinkedIn Job Positions

- **Nombre:** `linkedinJobPositions`
- **Propósito:** Extrae información de ofertas de trabajo de LinkedIn
- **Campos extraídos:** título, empresa, ubicación, fecha, enlace

## 🚀 Comandos disponibles

```bash
# Desarrollo
npm run start:dev        # Servidor con hot-reload

# Producción
npm run build           # Compilar TypeScript
npm run start:prod      # Ejecutar compilado

# Calidad de código
npm run lint            # ESLint
npm run format          # Prettier

# Testing
npm test                # Ejecutar tests
npm run test:watch      # Tests con watch mode
```

## 🔧 Configuración

El servicio incluye configuración por defecto optimizada:

- **Timeout:** 30 segundos por petición
- **User-Agent:** Navegador moderno para evitar bloqueos
- **CORS:** Habilitado para todos los orígenes
- **Puerto:** 3000 (configurable via environment variables)

## 🌐 Ejemplo de integración frontend

```javascript
// Ejemplo de uso desde React/Vue/Angular
const scrapeData = async (url, ruleName) => {
  const response = await fetch('http://localhost:3000/scrape', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, ruleName }),
  });

  return await response.json();
};

// Uso
scrapeData(
  'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=react',
  'linkedinJobPositions',
).then((data) => console.log(data));
```

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una branch para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Roadmap

- [ ] ✅ Soporte para LinkedIn Jobs
- [ ] 🔄 Cache de respuestas
- [ ] 📊 Métricas y monitoring
- [ ] 🔐 Autenticación JWT
- [ ] 🐛 Rate limiting
- [ ] 📄 Soporte para PDF scraping
- [ ] 🔍 Soporte para Selenium (JS dinámico)

## ⚠️ Consideraciones legales

Este software está diseñado para uso educativo y en compliance con:

- `robots.txt` de los sitios web
- Términos de servicio de las plataformas
- Leyes locales de protección de datos

**⚠️ Úsalo responsablemente y respeta los términos de servicio de los sitios web.**

## 📄 Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.

## 👨‍💻 Autor

Creado con ❤️ usando NestJS y TypeScript.

---

**¿Preguntas?** Abre un issue o contribuye al proyecto! 🚀
