import { LevelAdapter, Query } from '..'
import { Config } from '../classes/types'

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

   console.log('DELETE AN ENTRY')

   await db.delete('users', 'tiffany')

   console.log(await db.read('users', 'tiffany'))

   // Queries
   console.log('TEST QUERIES')

   await db.create('users', 'john', {
      name: 'john doe',
      age: 24,
      pet: 'cat',
   })
   await db.create('users', 'tiffany', {
      name: 'tiffany sprout',
      age: 18,
      pet: 'cat',
   })
   await db.create('users', 'robot', {
      name: 'mister robot',
      age: 50,
      pet: 'dog',
   })

   console.log('Fetch every user who is more than 20')
   console.log(
      await LevelAdapter.getInstance().execute(
         Query.in('users').where('age', '>', 20),
      ),
   )

   console.log('Fetch all users who have a cat and sort them by age')
   console.log(
      await LevelAdapter.getInstance().execute(
         Query.in('users').where('pet', '==', 'cat').orderBy('age', 'desc'),
      ),
   )
})()
