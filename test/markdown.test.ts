import test from "node:test";
import assert from "node:assert/strict";
import { parseMarkdownBlocks } from "../src/markdown";

test("parseMarkdownBlocks accepts common and extended fence info without stalling", () => {
  assert.deepEqual(parseMarkdownBlocks("```c#\nConsole.WriteLine();\n```"), [
    { kind: "code", language: "c#", text: "Console.WriteLine();" },
  ]);
  assert.deepEqual(parseMarkdownBlocks("````python title=demo\nprint('ok')\n````"), [
    { kind: "code", language: "python", text: "print('ok')" },
  ]);
  assert.deepEqual(parseMarkdownBlocks("~~~{.matlab}\ndisp('ok')\n~~~"), [
    { kind: "code", language: "{.matlab}", text: "disp('ok')" },
  ]);
});

test("parseMarkdownBlocks consumes unclosed and unusual fences to completion", () => {
  assert.deepEqual(parseMarkdownBlocks("```python title=demo\nprint('ok')"), [
    { kind: "code", language: "python", text: "print('ok')" },
  ]);
  assert.deepEqual(parseMarkdownBlocks("````\nraw\n```\nstill raw"), [
    { kind: "code", language: "", text: "raw\n```\nstill raw" },
  ]);
});

test("parseMarkdownBlocks preserves the supported block structure", () => {
  assert.deepEqual(parseMarkdownBlocks("# Heading\n\n- one\n- two\n\n1. first\n\nparagraph\ncontinued"), [
    { kind: "heading", level: 1, text: "Heading" },
    { kind: "unorderedList", items: ["one", "two"] },
    { kind: "orderedList", items: ["first"] },
    { kind: "paragraph", text: "paragraph\ncontinued" },
  ]);
});

test("parseMarkdownBlocks handles a large transcript payload in one pass", () => {
  const input = Array.from({ length: 10_000 }, (_, index) => `line ${index}`).join("\n");
  const blocks = parseMarkdownBlocks(input);
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0]?.kind, "paragraph");
  assert.equal(blocks[0]?.kind === "paragraph" ? blocks[0].text.length : 0, input.length);
});
