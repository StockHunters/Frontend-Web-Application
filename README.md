# 🧪 WebApp Stock Hunters
¡Bienvenido al proyecto! Este repositorio contiene el código fuente de la aplicación web creada 
con **Vue 3**, **Vite**, y **JavaScript**. La idea es trabajar en equipo de forma organizada.

---
## 📚 Índice

- [🛠️ Requisitos](#️-requisitos)
- [🚀 Clonar y correr el proyecto en WebStorm](#-clonar-y-correr-el-proyecto-en-webstorm)
  - [1. Clonar el repositorio](#1-clonar-el-repositorio)
  - [2. Abrir el proyecto en WebStorm](#2-abrir-el-proyecto-en-webstorm)
  - [3. Instalar dependencias](#3-instalar-dependencias)
  - [4. Correr la app en modo desarrollo](#4-correr-la-app-en-modo-desarrollo)
- [🧩 Estructura básica del proyecto](#-estructura-básica-del-proyecto)
- [🤝 Recomendaciones para trabajar en equipo](#-recomendaciones-para-trabajar-en-equipo)
  - [🌿 Rama](#-rama)
    - [Formato de Nombres de Ramas](#formato-de-nombres-de-ramas)
    - [Tipos Comunes de Ramas](#tipos-comunes-de-ramas)
    - [Buenas Prácticas](#buenas-prácticas)
  - [✍️ Commits](#commits)
    - [Gitmoji](#gitmoji)
    - [Conventional Commits](#conventional-commits)
    - [Formato del Commit](#formato-del-commit)
    - [Tabla de Gitmoji y Tipos de Commit](#tabla-de-gitmoji-y-tipos-de-commit)
- [📦 Comandos útiles](#-comandos-útiles)

## 🛠️ Requisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión recomendada: ``18+``)
- **Git**
- **Gitmoji**
- **WebStorm** (aunque puedes usar cualquier editor, este README está enfocado en WebStorm)

---

## 🚀 Clonar y correr el proyecto en WebStorm

### 1. Clonar el repositorio
Abre una terminal y ejecuta:

```bash
git clone https://github.com/StockHunters/webapp.git
```
O usa la opción “Clone Repository” directamente desde WebStorm con la URL del repo.

### 2. Abrir el proyecto en WebStorm

Abre WebStorm.

Ve a **File > Open...** y selecciona la carpeta donde clonaste el repo.

WebStorm debería detectar automáticamente que es un proyecto con `package.json`.

### 3. Instalar dependencias
Una vez abierto en WebStorm, abre la terminal (dentro del IDE) y corre:

``` bash
npm install
```

Esto descargará todas las dependencias necesarias.

### 4. Correr la app en modo desarrollo
Después de instalar todo, ejecuta:

``` bash
npm run dev
```

Esto levantará un servidor local. Verás algo como esto:

```
VITE vX.X.X  ready in 300ms

➜  Local:   http://localhost:5173/
```

Abre esa URL en tu navegador y ¡listo! Ya tienes la app corriendo en local.

## 🧩 Estructura básica del proyecto

~~~ bash
src/
├── stock/                          # Bounded context: gestión de stock
│   ├── components/                # Componentes específicos del contexto stock (ej. StockTable.vue)
│   ├── models/                    # Entidades o modelos de dominio (ej. StockItem.js)
│   ├── services/                  # Lógica de negocio (ej. useStockService.js)
│   └── index.js                   # Archivo de entrada/exportación del contexto
│
├── shared/                        # Recursos compartidos reutilizables
│   ├── components/               # UI genérica (ej. BaseButton.vue, Modal.vue)
│   ├── utils/                    # Funciones utilitarias comunes (ej. formatDate.js)
│   └── types/                    # Tipos o constantes globales
│
├── views/                         # Vistas o páginas completas (ej. StockView.vue)
│
├── router/                        # Configuración de Vue Router (ej. rutas por contexto)
│
├── App.vue                        # Componente raíz
└── main.js                        # Punto de entrada principal del proyecto
~~~

## 🤝 Recomendaciones para trabajar en equipo

### 🌿 Rama

Para mantener nuestro flujo de trabajo en Git organizado, seguimos una convención simple para nombrar las ramas.

#### Formato de Nombres de Ramas

```
<type>/<description>
```
>[!Note]
> Para crear una rama usa el comando
> ```bash
> git checkout -b <nombre-de-tu-rama>
> ```


* **`<type>`**: Define el propósito de la rama.
* **`<description>`**: Una breve descripción en minúsculas de la tarea (usa guiones para separar palabras).

#### Tipos Comunes de Ramas

* **`feature/`**: Para nuevas funcionalidades.
  Ejemplo: `feature/login-page`

* **`refactor/`**: Para nuevas funcionalidades.
  Ejemplo: `refactor/login-page`

* **`bugfix/`**: Para correcciones de errores.
  Ejemplo: `bugfix/fix-header-layout`

* **`hotfix/`**: Para correcciones urgentes en producción.
  Ejemplo: `hotfix/fix-crash-on-login`

* **`release/`**: Para preparar una nueva versión.
  Ejemplo: `release/1.0.0`

* **`chore/`**: Para tareas de mantenimiento o actualizaciones.
  Ejemplo: `chore/update-dependencies`

* **`docs/`**: Para cambios en la documentación.
  Ejemplo: `docs/update-readme`

#### Buenas Prácticas

* Usa **`main`** para el código listo para producción.
* Usa **`develop`** para el desarrollo en curso.
* Crea una nueva rama para cada nueva funcionalidad, corrección de errores o tarea y elimínala luego de hacer un merge
* Usa pull requests para revisar el código antes de integrarlo a main.

### ✍️ Commits
Haz commits claros y descriptivos, utilizando [gitmoji😜](https://gitmoji.dev/) y 
guiandote de la estructura de los conventional commits. Para agilizar instala la CLI de gimoji

#### Gitmoji
Estos son los pasos rápidos para instalar y usar la **CLI de Gitmoji**:

##### 1. **Instalar la CLI de Gitmoji**

Para instalar la CLI de Gitmoji globalmente, utiliza el siguiente comando en tu terminal:

```bash
npm install -g gitmoji-cli
```

Esto instalará **Gitmoji CLI** en tu sistema para usarlo en cualquier repositorio.


##### 2. **Usar la CLI de Gitmoji**

Una vez instalada, puedes usar el siguiente comando para agregar emojis de Gitmoji a tus commits:

```bash
gitmoji -c
```

Esto abrirá una interfaz interactiva que te permitirá elegir un emoji de Gitmoji y crear un mensaje de commit con el formato adecuado.


##### 3. **Ver la lista de Emojis disponibles**

Si solo quieres ver los emojis disponibles, puedes ejecutar:

```bash
gitmoji -l
```

Esto te mostrará todos los emojis que puedes usar en tus commits.


##### 4. **Agregar Gitmoji a un Commit**

Cuando estés listo para hacer un commit, solo usa el siguiente comando:

```bash
gitmoji -c
```

Y sigue las instrucciones en la terminal para elegir el emoji adecuado.

---

#### Conventional Commits 

- **feat:** cuando se añade una nueva funcionalidad.

- **fix:** cuando se arregla un error.

- **chore:** tareas rutinarias que no sean específicas de una feature o un error como por ejemplo añadir contenido al fichero .gitignore o instalar una dependencia.

- **test:** si añadimos o arreglamos tests.

- **docs:** cuando solo se modifica documentación.

- **build:** cuando el cambio afecta al compilado del proyecto.

- **ci:** el cambio afecta a ficheros de configuración y scripts relacionados con la integración continua.

- **style:** cambios de legibilidad o formateo de código que no afecta a funcionalidad.

- **refactor:** cambio de código que no corrige errores ni añade funcionalidad, pero mejora el código.

- **perf:** usado para mejoras de rendimiento.

- **revert:** si el commit revierte un commit anterior. Debería indicarse el hash del commit que se revierte.

#### Formato del Commit

```bash
 <emoji> <type>: <message>
```
**Donde:**

- `<emoji>` es un Gitmoji que representa el tipo de cambio.

- `<type>` es el tipo de commit según Conventional Commits (por ejemplo, feat, fix, docs).

- `<message>` es una breve descripción de lo que se cambió.


#### Tabla de Gitmoji y Tipos de Commit

| Emoji | Type       | Description                                         | Example Commit Message                                   |
| ----- | ---------- | --------------------------------------------------- | -------------------------------------------------------- |
| 🎨    | `feat`     | A new feature or UI improvement                     | `🎨 feat: add stock table component`                     |
| 🐛    | `fix`      | A bug fix                                           | `🐛 fix: fix validation logic in stock management`       |
| 📝    | `docs`     | Documentation updates                               | `📝 docs: update README with deployment instructions`    |
| ✨     | `feat`     | Adding a new feature                                | `✨ feat: add search functionality by name in stock`      |
| ♻️    | `refactor` | Code refactoring (no new features or fixes)         | `♻️ refactor: refactor stock service logic`              |
| 🗑️   | `chore`    | Removing files or obsolete code                     | `🗑️ chore: remove deprecated code from product service` |
| ✅     | `test`     | Fixing or adding tests                              | `✅ test: fix unit tests for stockService`                |
| 💄    | `style`    | Styling or visual improvements (CSS, SCSS, etc.)    | `💄 style: update styles for stock table`                |
| ⬆️    | `deps`     | Updating dependencies                               | `⬆️ deps: update app dependencies`                       |
| 🚀    | `release`  | Preparing for a new release                         | `🚀 release: prepare for version 1.2.0 release`          |
| ⚙️    | `config`   | Configuration changes (e.g., Webpack, Router, etc.) | `⚙️ config: add Vue Router setup for stock context`      |
| ⚡     | `perf`     | Performance improvements                            | `⚡ perf: optimize stock data loading`                    |

Recuerda agregar comentarios si algo no es tan obvio.

### 📦 Comandos útiles

``` bash
npm run dev       # Inicia el servidor de desarrollo
npm run build     # Compila la app para producción
npm run preview   # Previsualiza el build de producción
```

### Testing (Proceso)

Para usar paquete de stripe:

``` bash
npm install @stripe/stripe-js

```