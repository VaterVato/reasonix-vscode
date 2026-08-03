import assert from "node:assert/strict";
import test from "node:test";
import { normalizeReasonixPath, selectReasonixPath } from "../src/reasonixLauncher";

test("Windows PATH resolution preserves PATH precedence between runnable entries", () => {
  const stdout = [
    String.raw`C:\Users\dev\AppData\Roaming\npm\reasonix`,
    String.raw`C:\Users\dev\AppData\Roaming\npm\reasonix.cmd`,
    String.raw`C:\Tools\Reasonix\reasonix.exe`,
  ].join("\r\n");

  assert.equal(selectReasonixPath(stdout, "win32"), String.raw`C:\Users\dev\AppData\Roaming\npm\reasonix.cmd`);
});

test("Windows PATH resolution prefers the npm cmd shim over its extensionless shell shim", () => {
  const stdout = [
    String.raw`C:\Program Files\nodejs\reasonix`,
    String.raw`C:\Program Files\nodejs\reasonix.cmd`,
  ].join("\r\n");

  assert.equal(selectReasonixPath(stdout, "win32"), String.raw`C:\Program Files\nodejs\reasonix.cmd`);
});

test("non-Windows PATH resolution preserves the first result", () => {
  assert.equal(selectReasonixPath("/opt/reasonix/bin/reasonix\n/usr/bin/reasonix\n", "darwin"), "/opt/reasonix/bin/reasonix");
});

test("an explicitly configured extensionless Windows shim resolves to a native sibling first", async () => {
  const configured = String.raw`C:\Program Files\nodejs\reasonix`;
  const existing = new Set([`${configured}.exe`, `${configured}.cmd`]);

  assert.equal(await normalizeReasonixPath(configured, "win32", async (candidate) => existing.has(candidate)), `${configured}.exe`);
});

test("a global npm cmd shim resolves directly to the packaged native executable", async () => {
  const configured = String.raw`C:\Users\dev\AppData\Roaming\npm\reasonix.cmd`;
  const executable = String.raw`C:\Users\dev\AppData\Roaming\npm\node_modules\reasonix\node_modules\@reasonix\cli-win32-x64\bin\reasonix.exe`;

  assert.equal(
    await normalizeReasonixPath(configured, "win32", async (candidate) => candidate === executable, "x64"),
    executable,
  );
});

test("a local npm bin shim resolves a hoisted packaged native executable", async () => {
  const configured = String.raw`C:\workspace\node_modules\.bin\reasonix.cmd`;
  const executable = String.raw`C:\workspace\node_modules\@reasonix\cli-win32-arm64\bin\reasonix.exe`;

  assert.equal(
    await normalizeReasonixPath(configured, "win32", async (candidate) => candidate === executable, "arm64"),
    executable,
  );
});

test("an explicitly configured extensionless Windows shim falls back to its cmd sibling", async () => {
  const configured = String.raw`C:\Users\dev\AppData\Roaming\npm\reasonix`;

  assert.equal(
    await normalizeReasonixPath(configured, "win32", async (candidate) => candidate === `${configured}.cmd`),
    `${configured}.cmd`,
  );
});

test("configured native and non-Windows paths are not rewritten", async () => {
  assert.equal(await normalizeReasonixPath(String.raw`C:\Reasonix\reasonix.exe`, "win32"), String.raw`C:\Reasonix\reasonix.exe`);
  assert.equal(await normalizeReasonixPath("/usr/local/bin/reasonix", "linux"), "/usr/local/bin/reasonix");
});

test("a custom cmd wrapper is not replaced by an adjacent Reasonix package", async () => {
  const configured = String.raw`C:\Tools\custom-reasonix.cmd`;

  assert.equal(await normalizeReasonixPath(configured, "win32", async () => true, "x64"), configured);
});
