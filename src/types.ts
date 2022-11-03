import { Level } from "level"

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
