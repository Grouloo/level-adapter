# Level Adapter

## Introduction

Level Adapter makes the usage of a noSQL embedded database in TypeScript and JavaScript projects easier by providing an abstraction layer to [LevelDB](https://github.com/google/leveldb)

Based on the [Level JS module](https://github.com/Level/level)

## How to use

### Instantiate Level Adapter

```typescript
import { LevelAdapter } from 'level-adapter'

const config = {
   path: './storage',
   collections: {
      users: true,
      messages: true,
   },
}

const db = new LevelAdapter(config)
```

### Recover the LevelAdapter instance

```typescript
import { LevelAdapter } from 'level-adapter'

const db = LevelAdapter.instance
// OR
const db = LevelAdapter.getInstance()
```

### Create an entry

```typescript
import { LevelAdapter } from 'level-adapter'

const user = {
   name: 'john doe',
   age: 24,
}

LevelAdapter.getInstance().create('users', 'john', user)
```

### Read an entry

```typescript
import { LevelAdapter } from 'level-adapter'

const user = await LevelAdapter.getInstance().read('users', 'john')

console.log(user)

// {
//   name: 'john doe',
//   age: 24
// }
```

### Update an entry

```typescript
import { LevelAdapter } from 'level-adapter'

const user = {
   age: 25,
   pet: 'cat',
}

const user = await LevelAdapter.getInstance().update('users', 'john', user)

console.log(user)

// {
//   name: 'john doe',
//   age: 25,
//   pet: 'cat'
// }
```

### Delete an entry

```typescript
import { LevelAdapter } from 'level-adapter'

await LevelAdapter.getInstance().delete('users', 'john')
```

### Queries

```typescript
import { LevelAdapter, Query } from 'level-adapter'

const query =  Query.in('users').where('pet', '==', 'cat')
   .orderBy('age', 'desc')
   .setLimit(1).startAt(1)

await LevelAdapter.getInstance().execute(query)

// {
//    items: [],
//    meta: {
//       collection: 'users',
//       orderedBy: 'age',
//       order: 'desc',
//       startAt: 1,
//       endAt: 1,
//       count: 0,
//       total: 1
//    } 
// }
```

## License

[MIT](https://choosealicense.com/licenses/mit/#)
