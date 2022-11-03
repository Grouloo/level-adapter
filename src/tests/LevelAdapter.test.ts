import { describe, test, expect, beforeAll, jest } from '@jest/globals'
import { Level } from 'level'
import { LevelAdapter } from '..'
import { Config } from '../types'

jest.mock(
   'level' /*, () =>
   jest.fn().mockImplementation(() => {
      return {
         sublevel: Level, //(path: string) => new Level(path, {}),
      }
   }),
*/,
)

// jest.spyOn(Level.prototype, 'sublevel').mockImplementation(() => new Level('vroum'))

beforeAll(async () => {
   //Level.mockClear()

   const config: Config = {
      path: './storage',
      collections: {
         users: true,
      },
   }

   new LevelAdapter(config)

   //await LevelAdapter.instance.db.open()
})

describe('test LevelAdapter instantiation', () => {
   test('should instantiate correctly', () => {
      /*const config: Config = {
         path: './storage',
         collections: {
            users: true,
         },
      }

      const db = new LevelAdapter(config)*/

      const db = LevelAdapter.instance

      expect(db.db).toBeInstanceOf(Level)

      expect(db.collections).toEqual({
         users: true,
      })
   })

   test(`should have a recoverable instance and shouldn't be instantiated multiple times`, () => {
      const config: Config = {
         path: './storage',
         collections: {
            users: true,
         },
      }

      expect(() => new LevelAdapter(config)).toThrow()

      expect(LevelAdapter.instance).toBeInstanceOf(LevelAdapter)

      expect(LevelAdapter.getInstance()).toEqual(LevelAdapter.instance)
   })
})

describe('test LevelAdapter instantiation', () => {
   test(`should throw as collection doesn't exist`, () => {
      expect(() =>
         LevelAdapter.getInstance().doesCollectionExist('accounts'),
      ).toThrow()
   })
})

describe('test creation', () => {
   test('should return the object', async () => {
      const user = {
         name: 'john doe',
         age: 24,
      }

      expect(
         LevelAdapter.getInstance().create('users', 'john', user),
      ).resolves.toEqual(user)
   })

   test(`should throw when using inexistant collection`, async () => {
      const user = {
         name: 'john doe',
         age: 24,
      }

      expect(
         LevelAdapter.getInstance().create('accounts', 'john', user),
      ).resolves.toThrow()
   })

   test(`should throw when using invalid key`, async () => {
      const user = {
         name: 'john doe',
         age: 24,
      }

      expect(
         LevelAdapter.getInstance().create('users', undefined, user),
      ).resolves.toThrow()
   })

   test(`should throw when using invalid value`, async () => {
      const user = {
         name: 'john doe',
         age: 24,
      }

      expect(
         LevelAdapter.getInstance().create('users', 'john', user),
      ).resolves.toThrow()
   })
})

describe('test reading', () => {
   test('should return undefined', async () => {
      expect(LevelAdapter.getInstance().read('users', '12345')).resolves.toBe(
         undefined,
      )
   })

   test(`should throw when using inexistant collection`, async () => {
      expect(
         LevelAdapter.getInstance().read('accounts', 'john'),
      ).resolves.toThrow()
   })

   test(`should throw when using invalid key`, async () => {
      expect(
         LevelAdapter.getInstance().read('users', undefined),
      ).resolves.toThrow()

      expect(
         LevelAdapter.getInstance().read('users', 1234 as any),
      ).resolves.toThrow()
   })
})
