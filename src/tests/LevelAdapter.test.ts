import { describe, test, expect, beforeAll, jest } from '@jest/globals'
import { Level } from 'level'
import { LevelAdapter } from '..'
import { Config } from '../types'

jest.mock('level')

const config: Config = {
   path: './storage',
   collections: {
      users: true,
   },
}

const user = {
   name: 'john doe',
   age: 24,
}

beforeAll(async () => {
   new LevelAdapter(config)
})

describe('test LevelAdapter instantiation', () => {
   test('should instantiate correctly', () => {
      const db = LevelAdapter.instance

      expect(db.db).toBeInstanceOf(Level)

      expect(db.collections).toEqual({
         users: true,
      })
   })

   test(`should have a recoverable instance and shouldn't be instantiated multiple times`, () => {
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
      expect(
         LevelAdapter.getInstance().create('users', 'john', user),
      ).resolves.toEqual(user)
   })

   test(`should throw when using inexistant collection`, async () => {
      expect(
         LevelAdapter.getInstance().create('accounts', 'john', user),
      ).resolves.toThrow()
   })

   test(`should throw when using invalid key`, async () => {
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

describe('test updating', () => {
   test(`should throw when using inexistant collection`, async () => {
      expect(
         LevelAdapter.getInstance().update('accounts', 'john', user),
      ).resolves.toThrow()
   })

   test(`should throw when using invalid key`, async () => {
      expect(
         LevelAdapter.getInstance().update('users', undefined, user),
      ).resolves.toThrow()

      expect(
         LevelAdapter.getInstance().update('users', 1234 as any, user),
      ).resolves.toThrow()
   })

   test('should patch the object', async () => {
      const newUser = {
         age: 25,
         pet: 'cat',
      }

      expect(
         LevelAdapter.getInstance().update('accounts', 'john', newUser),
      ).resolves.toThrow()

      expect(LevelAdapter.getInstance()._patch(user, newUser)).toEqual({
         name: 'john doe',
         age: 25,
         pet: 'cat',
      })
   })
})

describe('test deleting', () => {
   test(`should throw when using inexistant collection`, async () => {
      expect(
         LevelAdapter.getInstance().update('accounts', 'john', user),
      ).resolves.toThrow()
   })

   test(`should throw when using invalid key`, async () => {
      expect(
         LevelAdapter.getInstance().delete('users', undefined),
      ).resolves.toThrow()

      expect(
         LevelAdapter.getInstance().delete('users', 1234 as any),
      ).resolves.toThrow()
   })
})
