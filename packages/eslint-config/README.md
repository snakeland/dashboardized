# @dashboardized/eslint-config

Shared ESLint configuration for the Dashboardized monorepo.

## Usage

### For TypeScript packages

Create `.eslintrc.js`:

```javascript
module.exports = {
  extends: ['@dashboardized/eslint-config'],
}
```

### For Vue 3 + TypeScript packages

Create `.eslintrc.js`:

```javascript
module.exports = {
  extends: ['@dashboardized/eslint-config/vue'],
}
```

## Includes

- ESLint recommended rules
- TypeScript ESLint recommended rules
- Vue 3 recommended rules (vue.js config)
- Prettier compatibility

## Rules

- Unused variables/args prefixed with `_` are allowed
- `any` type generates warnings (not errors)
- Explicit return types are optional
- Single-word component names are allowed in Vue
