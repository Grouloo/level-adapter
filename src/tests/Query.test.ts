import { describe, test, expect, beforeAll, jest } from '@jest/globals'
import Query from '../classes/Query'

describe('test Query instantiation', () => {
   test('should instantiate correctly', () => {
      const query = new Query('users')

      expect(query).toHaveProperty('collection')
      expect(query).toHaveProperty('conditions')
   })
})

describe('test in method', () => {
   test('should not throw', () => {
      expect(Query.in('users')).toEqual(new Query('users'))
   })
})

describe('test where method', () => {
   test('should not throw', () => {
      const q = Query.in('users').where('name', '==', 'john doe')

      expect(q.conditions[0]).toEqual({
         field: 'name',
         operator: '==',
         value: 'john doe',
      })
   })

   test('should throw when using bad operator', () => {
      expect(() =>
         Query.in('users').where('name', 'equals' as any, 'john doe'),
      ).toThrow()
   })
})

describe('test orderBy method', () => {
   test('should not throw', () => {
      const q = Query.in('users').orderBy('age', 'desc')

      expect(q.sortBy).toBe('age')
      expect(q.sortOrder).toBe('desc')
   })

   test('should throw when using bad order', () => {
      expect(() => Query.in('users').orderBy('age', 'abcd' as any)).toThrow()
   })
})

describe('test startAt method', () => {
   test('should not throw', () => {
      const q = Query.in('users').startAt(10)

      expect(q.start).toBe(10)
   })

   test('should throw when using invalid start', () => {
      expect(() => Query.in('users').startAt('10' as any)).toThrow()

      expect(() => Query.in('users').startAt(-10)).toThrow()
   })
})

describe('test setLimit method', () => {
   test('should not throw', () => {
      const q = Query.in('users').setLimit(10)

      expect(q.limit).toBe(10)
   })

   test('should throw when using invalid limit', () => {
      expect(() => Query.in('users').setLimit('10' as any)).toThrow()

      expect(() => Query.in('users').setLimit(-10)).toThrow()
   })
})
