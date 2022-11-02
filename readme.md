# Level Adapter

# Introduction

Level Adapter makes the usage of a noSQL embedded database in TypeScript and JavaScript projects easier by providing an abstraction layer to [LevelDB](https://github.com/google/leveldb)

# How to use

## Instantiate Level Adapter

```typescript
import { LevelAdapter } from "level-adapter"

const config = {
  path: "./storage",
  collections: {
    users: true,
    messages: true,
  },
}

const db = new LevelAdapter(config)
```

## Recover the LevelAdapter instance

```typescript
import { LevelAdapter } from "level-adapter"

const db = LevelAdapter.instance
// OR
const db = LevelAdapter.getInstance()
```

# License

[MIT](https://choosealicense.com/licenses/mit/#)
