# pipelineguard-demo-vulnerable-app

> ⚠️ **REPO DE DEMOSTRACIÓN — CONTIENE VULNERABILIDADES INTENCIONALES**
>
> Este repositorio existe únicamente para probar de extremo a extremo la
> [PipelineGuard GitHub Action](https://github.com/CamiloUrrea/PipelineGuard).
> **No lo uses en producción, no reutilices ningún valor de aquí, y no lo
> tomes como ejemplo de buenas prácticas de seguridad.**

## Qué hay aquí a propósito

- **`src/index.js`**: una app Node.js mínima que usa `lodash` (`_.merge`) para
  combinar el cuerpo de una petición HTTP no confiable dentro de un objeto de
  configuración — un vector clásico de *prototype pollution*.
- **`package.json` / `package-lock.json`**: fijan `lodash` en la versión
  exacta `4.17.15`, vulnerable a **CVE-2020-8203**, **CVE-2019-10744** y
  **CVE-2020-28500** (corregidas en `4.17.21`).
- **`config/settings.py`**: contiene tres "secretos" con el formato de una
  AWS access key, un GitHub PAT y una Stripe API key. **Son cadenas
  inventadas al azar, no credenciales reales de nadie.** Su único propósito
  es que `gitleaks` los detecte durante el escaneo.
- **`.pipelineguard.yml`**: configurado con `enforce: true` y
  `fail_threshold: CRITICAL`, para que el workflow falle de verdad cuando
  PipelineGuard encuentre los hallazgos `CRITICAL` esperados.
- **`.github/workflows/pipelineguard.yml`**: workflow de `pull_request` que
  instala `gitleaks` y `trivy` y ejecuta la Action de PipelineGuard sobre el
  PR.

## Propósito

Sirve como fixture reproducible para verificar que PipelineGuard:

1. Detecta secretos hardcodeados (gitleaks).
2. Detecta dependencias vulnerables conocidas (trivy).
3. Aplica correctamente `fail_threshold` y hace fallar el check del PR
   cuando corresponde.

## Repo real

El proyecto que este repo pone a prueba vive en:
👉 https://github.com/CamiloUrrea/PipelineGuard
