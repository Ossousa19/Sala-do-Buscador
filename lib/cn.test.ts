import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins only truthy classes", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
});
