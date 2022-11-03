import { jest } from '@jest/globals'

/*export default class MockLevel {
   data: any
   jsonEncoding?: boolean

   constructor(path: string, options?: { valueEncoding?: 'json' }) {
      if (!path || typeof path !== 'string') {
         throw Error('Missing or invalid path!')
      }

      if (options) {
         if (options.valueEncoding == 'json') {
            this.jsonEncoding = true
         }
      }

      this.data = {}
   }

   sublevel(path) {
      return new MockLevel(path)
   }

   async put(key: string, value: string) {
      if (typeof key !== 'string') {
         throw Error('Invalid key!')
      }

      if (typeof value !== 'string') {
         throw Error('Invalid value!')
      }

      this.data[key] = value
   }

   async get(key: string) {
      if (typeof key !== 'string') {
         throw Error('Invalid key!')
      }

      if (!this.data[key]) {
         throw Error("Object doesn't exist!")
      }

      return this.data[key]
   }
}*/

export const mockPut = jest.fn()

const mLevel = jest.fn().mockImplementation(() => {
   return {
      put: mockPut,
   }
})
export default mLevel
