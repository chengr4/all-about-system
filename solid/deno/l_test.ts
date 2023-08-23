import { assertEquals } from "https://deno.land/std@0.198.0/assert/mod.ts";
import { Rectangle, Square } from "./l.ts";

Deno.test(function RectangleTest() {
  const rec = new Square();

  rec.setHeight(2);
  rec.setWidth(3);

  assertEquals(rec.getArea(), 6);
});
