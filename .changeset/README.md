# Changesets

We use [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs.

## Adding a changeset

When you make changes that should be released, add a changeset:

```bash
pnpm changeset add
```

Follow the prompts to describe your changes.

## Versioning

To bump versions based on changesets:

```bash
pnpm changeset version
```

## Publishing

To publish packages (when ready):

```bash
pnpm changeset publish
```
