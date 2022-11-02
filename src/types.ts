interface Config {
  path: string
  collections: Collections
}

interface Collections {
  [x: string]: true
}
