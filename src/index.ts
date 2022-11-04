import { Level } from 'level'
import { Collections, Config, Sublevels } from './types'

export class LevelAdapter {
   db: Level
   sublevels: Sublevels
   collections: Collections

   static instance: LevelAdapter

   constructor(config: Config) {
      if (LevelAdapter.instance) {
         throw Error('LevelAdapter cannot be instantiated more than one time.')
      }

      const { path, collections } = config

      this.db = new Level(path || './storage', { valueEncoding: 'json' })
      this.collections = collections

      // Creating sublevels according to the described collections
      this.sublevels = {}
      Object.keys(this.collections).map((collection) => {
         this.sublevels[collection] = this.db.sublevel(
            collection,
         ) as unknown as Level
      })

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
   doesCollectionExist(collection: string) {
      if (Object.keys(this.collections).indexOf(collection) < 0) {
         throw Error(`Collection ${collection} does not exist.`)
      }

      return true
   }

   /**
    * Stores an object in the DB
    * @param collection Collection name
    * @param key Key
    * @param value Object to store
    * @returns {object} Value
    */
   async create(collection: string, key: string, value: { [x: string]: any }) {
      this.doesCollectionExist(collection)

      const stringifiedValue = JSON.stringify(value)

      try {
         await this.sublevels[collection].put(key, stringifiedValue)
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
      this.doesCollectionExist(collection)

      try {
         const value = await this.sublevels[collection].get(key, {
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
      this.doesCollectionExist(collection)

      await this.sublevels[collection].del(key)

      return
   }
}
