# NPM Plugin

Publish to NPM.
Works in both a monorepo setting and for a single package.
This plugin is loaded by default when `auto` is installed through `npm`.
If you configure `auto` to use any other plugin this will be lost.
So you must add the `npm` plugin to your plugins array if you still want NPM functionality.

## Prerequisites

To publish to npm you will need an `NPM_TOKEN` set in your environment.

> Warning! Avoid using the `prepublishOnly` script as it can lead to errors. [Read more here.](https://intuit.github.io/auto/docs/welcome/quick-merge#beware-long-publishes)

## Installation

This plugin is included with the `auto` CLI so you do not have to install it. To install if you are using the `auto` API directly:

```bash
npm i --save-dev @auto-it/npm
# or
yarn add -D @auto-it/npm
```

> WARNING: You can only use one "package manager" at a time!
> Mixing them will lead to undesired results.

## Usage

```json
{
  "plugins": [
    "npm",
    // or with options
    ["npm", { "forcePublish": false }]
    // other plugins
  ]
}
```

> If you're using the `noVersionPrefix` option you will also need to add `tag-version-prefix=""` to your `.npmrc`.
> Otherwise when npm versions your code the tag it creates will have the `v` and `auto` will get confused.

## Monorepo Usage

The `npm` plugin works out of the box with `lerna` in both [`independent`](https://github.com/lerna/lerna#independent-mode) and [`fixed`](https://github.com/lerna/lerna#fixedlocked-mode-default) mode.
`auto` works on a repo basis and should be run from the root of the repo, not on each sub-package.
No additional setup is required.

> Do you have a package in your monorepo you don't want to publish but still want versioned?
> Just set that `"private": true` you that package's `package.json`!
## Options

### setRcToken

When running the `shipit` command auto will try to set your `.npmrc` token while publishing. To disable this feature you must set the `setRcToken` to false.

```json
{
  "plugins": [
    [
      "npm",
      {
        "setRcToken": false
      }
    ]
  ]
}
```

### forcePublish

By default `auto` will force publish all packages for monorepos. To disable this behavior you must set the `forcePublish` to false.

```json
{
  "plugins": [
    [
      "npm",
      {
        "forcePublish": false
      }
    ]
  ]
}
```

### exact

To force all packages publish with [exact versions](https://github.com/lerna/lerna/blob/master/commands/version/README.md#--exact).

```json
{
  "plugins": [
    [
      "npm",
      {
        "exact": true
      }
    ]
  ]
}
```

### subPackageChangelogs

`auto` will create a changelog for each sub-package in a monorepo.
You can disable this behavior by using the `subPackageChangelogs` option.

```json
{
  "plugins": [
    [
      "npm",
      {
        "subPackageChangelogs": false
      }
    ]
  ]
}
```

### monorepoChangelog

`auto` will group changelog lines by sub-packages in a monorepo.
You can disable this behavior by using the `monorepoChangelog` option.

```json
{
  "plugins": [
    [
      "npm",
      {
        "monorepoChangelog": false
      }
    ]
  ]
}
```

### commitNextVersion

Whether to create a commit for "next" version.
The default behavior will only create the tags.

```json
{
  "plugins": [
    [
      "npm",
      {
        "commitNextVersion": true
      }
    ]
  ]
}
```

### legacyAuth

When publishing packages that require authentication but you are working with an internally hosted npm registry that only uses the legacy Base64 version of username:password.
This is the same as the NPM publish \_auth flag.

For security this option only accepts a boolean.
When this option is set true `auto` will pass `--_auth $NPM_TOKEN` to the publish command.
Set `$NPM_TOKEN` to the "Base64 version of username:password".

```json
{
  "plugins": [
    [
      "npm",
      {
        "legacyAuth": true
      }
    ]
  ]
}
```

### canaryScope

Publishing canary versions comes with some security risks.
If your project is private you have nothing to worry about and can skip these, but if your project is open source there are some security holes.

> :warning: This feature works pretty easily/well for single packages. In a monorepo we have to deal with a lot more, and this options should be treated as experimental.

#### Setup

1. Create a test scope that you publish canaries under (ex: `@auto-canary` or `@auto-test`)
2. Create a user that only has access to that scope
3. Set the default `NPM_TOKEN` to a token that can publish to that scope (this is used for any pull request)
4. Set up a `secure` token that is only accessible on the main fork (still named `NPM_TOKEN`)
5. Set up alias (only monorepos)

Step 3 might not be possible on your build platform.

The following are the ways the `auto` team knows how to do it.
If you do not see the method for you build platform, please make a pull request!

**Platform Solutions:**

- [CircleCI Context](https://circleci.com/docs/2.0/contexts/) - Contexts provide a mechanism for securing and sharing environment variables across projects. The environment variables are defined as name/value pairs and are injected at runtime.

```json
{
  "plugins": [
    [
      "npm",
      {
        "canaryScope": "@auto-canary"
      }
    ]
  ]
}
```

##### Set up alias

If you are managing a non-monorepo you do not have to do anything for this step!
If you manage a monorepo we still have to do handle our packages importing each other.
Since we just changed the name of the package all imports to our packages are now broken!

There are multiple ways to make this work and the solution might be different depending on your build target.

- [module-alias](https://www.npmjs.com/package/module-alias) - Modifiy node's require for your canary deploys (This is what `auto` uses). Useful for node packages
- [Webpack Aliases](https://webpack.js.org/configuration/resolve/) Modify scoped requires for webpack based projects.
- [babel-plugin-module-resolver](https://www.npmjs.com/package/babel-plugin-module-resolver) - A Babel plugin to add a new resolver for your modules when compiling your code using Babel.

## Troubleshooting

## npm ERR! need auth auth required for publishing

This error will occur when you do not have a `NPM_TOKEN` set.

### Still getting errors?!

Make sure that `npm` is trying to publish to the correct registry. Force `npm`/`lerna` to use the public registry by adding the following to your package.json:

```json
{
  "publishConfig": {
    "registry": "https://registry.npmjs.org/",
    "access": "public"
  }
}
```
