import { LevelAdapter } from '..'
import { Config } from '../types'

const config: Config = {
   path: './storage',
   collections: {
      users: true,
      messages: true,
   },
}

const db = new LevelAdapter(config)

db.create('users', 'tiffany', {
   name: 'tiffany sprout',
   age: 18,
}).then(async () => {
   const tiff = await db.read('users', 'tiffany')

   console.log(tiff)
})
