# system-dynamics-tool

This is a [Tauri Next.js](https://tauri.app/v1/guides/getting-started/setup/next-js) project with:
* [React Testing Library with Jest](https://www.freecodecamp.org/news/how-to-setup-react-testing-library-with-nextjs/)
* [Docusaurus with Typedoc](https://github.com/tgreyuk/typedoc-plugin-markdown/tree/master/packages/docusaurus-plugin-typedoc)
* [Storybook With TailwindCSS](https://dev.to/lico/nextjs-using-tailwind-with-storybook-5aie)
* [Cypress](https://docs.cypress.io/guides/tooling/typescript-support)
* [Cucumber](https://github.com/badeball/cypress-cucumber-preprocessor)

```plantuml
@startmindmap
*:= System Dynamics Tool
====
Docusaurus
Cypress
Cucumber
;

**:= Frontend
====
TypeScript
React.js
Next.js
** SSG
** Router
** Framework
TailwindCSS
Redux
Tauri
Typedoc
;



***:= Components
====
useReducer
Storybook
;


****:= Testing
====
React testing library
Jest
;

/'
**:= To Do
====
DDD
DevOps

;

***:= Frontend
====
;

****:= i18n
====
i18next
;

****:= Form
====
Formik
React Hook Form
;

****:= UI Component Libraries
====
Material UI
Chakra UI
;

****:= Animation
====
React Spring
Framer Motion
;

****:= Data Visualization
====
Victory
React Chartjs 2
Recharts
;

****:= Table
====
Tanstack table
;

****:= Others
====
Drag & Drop
React Dropzone for File Upload
Firebase for Authentication
;

***:= Devtools
====
React Developer Tools
Redux devtools
Testing Playground
React Hook Form DevTools
Tanstack query devtools
;

***:= Backend
====
;

****:= Server State Management
====
TanStac Query
;
'/
@endmindmap
```

## Prerequisites

[Install Rust](https://tauri.app/v1/guides/getting-started/prerequisites)

Initialize npm

```bash
npm i
```

## Getting Started

Development

```bash
npm run tauri dev
```

Build

```bash
npm run tauri build
```

The built execution file is located at ./sif-tauri/target/release
