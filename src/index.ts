import { Level } from "level"

export class LevelAdapter {
  db: Level
  collections: Collections

  static instance: LevelAdapter

  constructor(config: Config) {
    const { path, collections } = config

    this.db = new Level(path || "./storage", { valueEncoding: "json" })
    this.collections = collections

    LevelAdapter.instance = this
  }

  /**
   * Returns the current LevelAdapter instance
   * @returns {LevelAdapter}
   */
  static getInstance() {
    return LevelAdapter.instance
  }
}
