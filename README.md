# system-dynamics-tool

This is a [Tauri Next.js](https://tauri.app/v1/guides/getting-started/setup/next-js) project with:

- [React Testing Library with Jest](https://www.freecodecamp.org/news/how-to-setup-react-testing-library-with-nextjs/)
- [Docusaurus with Typedoc](https://github.com/tgreyuk/typedoc-plugin-markdown/tree/master/packages/docusaurus-plugin-typedoc)
- [Storybook With TailwindCSS](https://dev.to/lico/nextjs-using-tailwind-with-storybook-5aie)
- [Cypress](https://docs.cypress.io/guides/tooling/typescript-support)
- [Cucumber](https://github.com/badeball/cypress-cucumber-preprocessor)
- [i18n](https://github.com/martinkr/next-export-i18n)

## Prerequisites

[Install Rust](https://tauri.app/v1/guides/getting-started/prerequisites)

[Install pre-commit](https://pre-commit.com/)

Initialize pre-commit

```bash
pre-commit install
```

Initialize npm

```bash
npm i
```

## Getting Started

Development

```bash
npm run dev
```

or

```bash
npm run tauri dev
```

Build static web

```bash
npm run build
```

Build app

```bash
npm run tauri build
```

The built execution file is located at ./sif-tauri/target/release

## Document

Initialize docusaurus

```bash
cd docusaurus
npm i
```

Read document

```bash
npm run doc start -- -- --port 8080
```

## Test

Typescript

```bash
npm run jest -- --watch
```

UI Component

```bash
npm run storybook dev -- -p 6006
```

BDD

```bash
npm run cypress open
```
