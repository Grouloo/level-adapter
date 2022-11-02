import { describe, test, expect } from "@jest/globals"
import { Level } from "level"
import { LevelAdapter } from ".."

describe("test LevelAdapter methods", () => {
  test("should instantiate correctly", () => {
    const config: Config = {
      path: "./storage",
      collections: {
        users: true,
      },
    }

    const db = new LevelAdapter(config)

    expect(db.db).toBeInstanceOf(Level)

    expect(db.collections).toEqual({
      users: true,
    })
  })
})
