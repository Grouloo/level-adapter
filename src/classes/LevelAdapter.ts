import { Level } from 'level'
import Query from './Query'
import { Collections, Config, Payload, Sublevels } from './types'

export default class LevelAdapter {
   db: Level

   static instance: LevelAdapter

   constructor(config: Config) {
      if (LevelAdapter.instance) {
         throw Error('LevelAdapter cannot be instantiated more than one time.')
      }

      const { path, collections } = config

      this.db = new Level(path || './storage', { valueEncoding: 'json' })

      LevelAdapter.instance = this
   }

   /**
    * Returns the current LevelAdapter instance
    * @returns {LevelAdapter}
    */
   static getInstance() {
      return LevelAdapter.instance
   }

   /**
    * Patch an object
    * @param oldValue
    * @param newValue
    * @returns {object} Patched object
    */
   _patch(oldValue: any, newValue) {
      return Object.assign(oldValue, newValue)
   }

   /**
    * Checks if a collection name exists as a sublevel
    * @param collection
    * @returns {boolean}
    */
   // doesCollectionExist(collection: string) {
   //    if (Object.keys(this.collections).indexOf(collection) < 0) {
   //       throw Error(`Collection ${collection} does not exist.`)
   //    }

   //    return true
   // }

   getSublevel(collection: string) {
      return this.db.sublevel(collection, { valueEncoding: 'json' })
   }

   /**
    * Stores an object in the DB
    * @param collection Collection name
    * @param key Key
    * @param value Object to store
    * @returns {object} Value
    */
   async create(collection: string, key: string, value: { [x: string]: any }) {
      const db = this.getSublevel(collection)

      const stringifiedValue = JSON.stringify(value)

      try {
         await db.put(key, stringifiedValue)
      } catch (e) {
         console.log(e)
      }

      return value
   }

   /**
    * Fetches a stored object for a specific key
    * @param collection Collection name
    * @param key Key
    * @returns {object} Stored object
    */
   async read(collection: string, key: string) {
      const db = this.getSublevel(collection)

      try {
         const value = await db.get(key, {
            valueEncoding: 'utf8',
         })

         const parsedValue = JSON.parse(value)

         return parsedValue
      } catch (e) {
         return undefined
      }
   }

   /**
    * Updates a stored object by patching it
    * @param collection Collection name
    * @param key Key
    * @param value
    * @returns {object} Updated object
    */
   async update(collection: string, key: string, value: { [x: string]: any }) {
      const oldValue = await this.read(collection, key)

      const newValue = this._patch(oldValue, value)

      return await this.create(collection, key, newValue)
   }

   /**
    *
    * @param collection Collection name
    * @param key  Key
    * @returns {void}
    */
   async delete(collection: string, key: string) {
      const db = this.getSublevel(collection)

      await db.del(key)

      return
   }

   /**
    * Executes a Query
    * @param query Query
    * @returns {array}
    */
   async execute(query: Query): Promise<Payload> {
      const { collection, conditions, sortBy, sortOrder, start, limit } = query

      const db = this.getSublevel(collection)

      let res: any[] = []
      let i = 0

      for await (const doc of await db.values()) {
         i++

         const parsedDoc = JSON.parse(doc)

         // Check conditions
         let isValid: boolean = false

         if (!conditions || conditions.length == 0) {
            isValid = true
         }

         for (let condition of conditions) {
            const { field, operator, value } = condition

            switch (operator) {
               case '==':
                  isValid = parsedDoc[field] == value
                  break

               case '!=':
                  isValid = parsedDoc[field] != value
                  break

               case '<':
                  isValid = parsedDoc[field] < value
                  break

               case '>':
                  isValid = parsedDoc[field] > value
                  break

               case '<=':
                  isValid = parsedDoc[field] <= value
                  break

               case '>=':
                  isValid = parsedDoc[field] >= value
                  break
            }

            break
         }

         if (!isValid) {
            continue
         }

         res.push(parsedDoc)
      }

      // Sort
      if (sortBy && sortOrder) {
         res = res.sort((a: any, b: any) => {
            return sortOrder === 'asc'
               ? a[sortBy] - b[sortBy]
               : b[sortBy] - a[sortBy]
         })
      }

      // Putting start
      if (start) {
         res = res.slice(start)
      }

      // Putting limit
      if (limit) {
         res = res.slice(0, limit)
      }

      return {
         items: res,
         meta: {
            collection,
            orderedBy: sortBy || '_createdAt',
            order: sortOrder || 'asc',
            startAt: start || 0,
            endAt: limit || res.length,
            count: res.length,
            total: i,
         },
      }
   }
}
