# system-dynamics-tool

This is a cross-platform application to draw [System Dynamics Map](https://www.systems-thinking.org/). It is under construction. Its features will comprise:

- drawing and styling
  - Causal Loop Diagram
  - Stock and Flow Diagram
- save as file and load it
- export as image file
- import csv file
- undo and redo
- Zoom In and Zoom Out
- find and mark loops
- find and mark archetypes
- auto poistion

With [Tauri Next.js](https://tauri.app/v1/guides/getting-started/setup/next-js), it uses React.js framework Next.js to build static web site and applications for Windows, Linux, and MacOS. It will be able to build mobile application after [Tauri 2.0](https://beta.tauri.app/blog/tauri-2-0-0-beta/) released.

Its development environment comprises:

- unit test for TDD - [React Testing Library with Jest](https://www.freecodecamp.org/news/how-to-setup-react-testing-library-with-nextjs/)
- documentation for development and source code - [Docusaurus with Typedoc](https://github.com/tgreyuk/typedoc-plugin-markdown/tree/master/packages/docusaurus-plugin-typedoc)
- UI component viewer for CDD - [Storybook With TailwindCSS](https://dev.to/lico/nextjs-using-tailwind-with-storybook-5aie)
- E2E test and BDD - [Cypress](https://docs.cypress.io/guides/tooling/typescript-support) with [Cucumber](https://github.com/badeball/cypress-cucumber-preprocessor)
- i18n - [i18n with static export](https://github.com/martinkr/next-export-i18n)
- check before git commit and push - [husky](https://typicode.github.io/husky/get-started.html) and [lint-staged](https://github.com/lint-staged/lint-staged#configuration)
  - format - [prettier](https://prettier.io/docs/en/precommit.html)
  - commit message whether following [conventional commits](https://www.conventionalcommits.org/) - [commitlint](https://commitlint.js.org/guides/getting-started.html)

## Prerequisites

[Install Rust](https://tauri.app/v1/guides/getting-started/prerequisites)

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

Build static web. The built static web site is located at out.

```bash
npm run build
```

Build app. The built execution file is located at sif-tauri/target/release.

```bash
npm run tauri build
```

## Document

Initialize docusaurus

```bash
cd docusaurus; npm i
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

E2E and BDD

```bash
npm run cypress open
```
