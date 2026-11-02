# LobsterPots

A fun game I have written in angular, based on an existing game!

# Angular Info

This project uses [Angular](https://angular.dev) 22 and is managed with [pnpm](https://pnpm.io).

## Development server

Run `pnpm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `pnpm ng generate component component-name` to generate a new component. You can also use `pnpm ng generate directive|pipe|service|class|guard|interface|enum`.

## Build

Run `pnpm build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `pnpm test` to execute the unit tests via [Vitest](https://vitest.dev).

## Deploying to GitHub Pages

The project deploys with [angular-cli-ghpages](https://github.com/angular-schule/angular-cli-ghpages) to the `gh-pages` branch:

```bash
pnpm deploy:gh
```

This builds with `--base-href=/lobster-pots/` — required for a project page at `https://joshp93.github.io/lobster-pots/` — and publishes the build output to `gh-pages`. In GitHub, set **Settings → Pages → Build and deployment → Source** to **Deploy from a branch**, branch **gh-pages**, folder **/ (root)**. Running the command again updates the live site.

For a custom domain, add `--cname=your.domain` and adjust the base href. For a `<user>.github.io` user site, use `--base-href=/`.

## Formatting and linting

Run `pnpm lint` to check formatting and lint rules with [Biome](https://biomejs.dev), or `pnpm lint:fix` to apply safe fixes and format the project. Biome covers TypeScript, JSON and SCSS. Angular templates (`*.html`) are excluded because Biome's HTML parser cannot parse Angular control-flow expressions such as `@if (value < 10)`.

## Further help

To get more help on the Angular CLI use `pnpm ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/cli) page.
