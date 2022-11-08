import { TypeOperatorNode } from 'typescript'
import { Condition, operator } from './types'

const Operators: operator[] = ['==', '!=', '<', '>', '<=', '>=']

export default class Query {
   collection: string
   conditions: Condition[]
   start?: number
   limit?: number
   sortOrder?: 'asc' | 'desc'
   sortBy?: string

   constructor(collection: string) {
      this.collection = collection

      this.conditions = []
   }

   /**
    * Instantiates Query
    * @param collection Collection name
    * @returns {Query}
    */
   static in(collection: string) {
      return new this(collection)
   }

   /**
    * Adds a condition to the Query
    * @param field Field name
    * @param operator Operator
    * @param value Value
    * @returns {Query}
    */
   where(field: string, operator: operator, value: any) {
      if (!field || typeof field !== 'string') {
         throw Error('Invalid field name.')
      }

      if (Operators.indexOf(operator) < 0) {
         throw Error('Invalid operator.')
      }

      const condition: Condition = {
         field,
         operator,
         value,
      }

      this.conditions.push(condition)

      return this
   }

   /**
    * Adds sort clause
    * @param field Field name
    * @param order 'desc' or 'asc'
    * @returns {Query}
    */
   orderBy(field: string, order: 'asc' | 'desc') {
      if (order !== 'asc' && order !== 'desc') {
         throw Error(
            `Invalid sort order! Expected 'asc' or 'desc', but got ${order}`,
         )
      }

      this.sortBy = field
      this.sortOrder = order

      return this
   }

   startAt(start: number) {
      if (typeof start !== 'number' || start < 0) {
         throw Error('Invalid start. Should be a positive number or 0.')
      }

      this.start = start

      return this
   }

   setLimit(limit: number) {
      if (typeof limit !== 'number' || limit < 0) {
         throw Error('Invalid limit. Should be a positive number or 0.')
      }

      this.limit = limit

      return this
   }
}
