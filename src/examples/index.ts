import { LevelAdapter } from '..'
import { Config } from '../types'

const config: Config = {
   path: './storage',
   collections: {
      users: true,
      messages: true,
   },
}

;(async function example() {
   const db = new LevelAdapter(config)

   await db.create('users', 'tiffany', {
      name: 'tiffany sprout',
      age: 18,
   })

   console.log('CREATE AN ENTRY')

   const tiff = await db.read('users', 'tiffany')

   console.log(tiff)

   console.log('UPDATE AN ENTRY')

   await db.update('users', 'tiffany', {
      age: 19,
      pet: 'dog',
   })

   console.log(await db.read('users', 'tiffany'))
})()
