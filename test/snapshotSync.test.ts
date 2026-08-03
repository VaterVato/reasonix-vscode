import test from "node:test";
import assert from "node:assert/strict";
import { applyTranscriptSplice, SnapshotSync, transcriptWindowStart } from "../src/snapshotSync";

test("SnapshotSync sends one full snapshot followed by revisioned patches", () => {
  const sync = new SnapshotSync<string>();
  const items = ["one", "two"];

  assert.deepEqual(sync.next({ status: "idle" }, items), {
    type: "stateSnapshot",
    revision: 1,
    state: { status: "idle", items },
  });
  assert.deepEqual(sync.next({ status: "ready" }, items), {
    type: "statePatch",
    revision: 2,
    state: { status: "ready" },
  });
});

test("SnapshotSync coalesces transcript changes and sends only the changed suffix", () => {
  const sync = new SnapshotSync<string>();
  const items = Array.from({ length: 10_000 }, (_, index) => `item-${index}`);
  sync.next({ status: "idle" }, items);

  items[items.length - 1] = "streamed update";
  sync.markTranscriptChanged(items.length - 1);
  const patch = sync.next({ status: "responding" }, items);

  assert.equal(patch.type, "statePatch");
  assert.deepEqual(patch.type === "statePatch" ? patch.transcript : undefined, {
    start: 9_999,
    deleteCount: 1,
    items: ["streamed update"],
  });
  assert.ok(JSON.stringify(patch).length < JSON.stringify({ items }).length / 100);
});

test("SnapshotSync keeps the earliest dirty index across a coalescing window", () => {
  const sync = new SnapshotSync<string>();
  const items = ["a", "b", "c", "d"];
  sync.next({}, items);
  sync.markTranscriptChanged(3);
  sync.markTranscriptChanged(1);

  const patch = sync.next({}, ["a", "B", "c", "D"]);
  assert.deepEqual(patch.type === "statePatch" ? patch.transcript : undefined, {
    start: 1,
    deleteCount: 3,
    items: ["B", "c", "D"],
  });
});

test("SnapshotSync can force recovery with a full snapshot", () => {
  const sync = new SnapshotSync<string>();
  sync.next({}, ["old"]);
  sync.requireFullSnapshot();

  assert.deepEqual(sync.next({ status: "recovered" }, ["new"]), {
    type: "stateSnapshot",
    revision: 2,
    state: { status: "recovered", items: ["new"] },
  });
});

test("transcript splice validation and windowing stay bounded", () => {
  const items = ["a", "b", "c"];
  assert.equal(applyTranscriptSplice(items, { start: 2, deleteCount: 1, items: ["C", "d"] }), true);
  assert.deepEqual(items, ["a", "b", "C", "d"]);
  assert.equal(applyTranscriptSplice(items, { start: 99, deleteCount: 0, items: [] }), false);
  assert.equal(transcriptWindowStart(10_000, 200), 9_800);
  assert.equal(transcriptWindowStart(50, 200), 0);
});
