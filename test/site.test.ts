import assert from "node:assert/strict";
import test from "node:test";

import { sitePath } from "../src/lib/site.ts";

test("sitePath prefixes the configured base path", () => {
  assert.equal(sitePath("overlay/"), "/social-media-rotator-site/overlay/");
  assert.equal(sitePath("assets/bank-qr.png"), "/social-media-rotator-site/assets/bank-qr.png");
});
