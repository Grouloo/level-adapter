import { Level } from "level"

export default class LevelAdapter {
  db: Level
  collections: Collections
  static instance: LevelAdapter

  constructor(config: Config) {
    const { path, collections } = config

    this.db = new Level(path || "./storage", { valueEncoding: "json" })
    this.collections = collections

    LevelAdapter.instance = this
  }
}
