import { Level } from 'level'

export interface Config {
   path: string
   collections: Collections
}

export interface Collections {
   [x: string]: true
}

export interface Sublevels {
   [x: string]: Level
}

export type Payload = {
   items: { [field: string]: any }[]
   meta: {
      collection: string
      order: 'asc' | 'desc'
      orderedBy: string
      startAt: number
      endAt: number
      count: number
      total: number
   }
}

export type operator = '==' | '!=' | '<' | '>' | '<=' | '>=' | 'in' | 'not-in'

export type Condition = {
   field: string
   operator: operator
   value: any
}
