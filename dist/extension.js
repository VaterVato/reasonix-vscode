"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/isexe/windows.js
var require_windows = __commonJS({
  "node_modules/isexe/windows.js"(exports2, module2) {
    module2.exports = isexe;
    isexe.sync = sync;
    var fs5 = require("fs");
    function checkPathExt(path9, options) {
      var pathext = options.pathExt !== void 0 ? options.pathExt : process.env.PATHEXT;
      if (!pathext) {
        return true;
      }
      pathext = pathext.split(";");
      if (pathext.indexOf("") !== -1) {
        return true;
      }
      for (var i = 0; i < pathext.length; i++) {
        var p = pathext[i].toLowerCase();
        if (p && path9.substr(-p.length).toLowerCase() === p) {
          return true;
        }
      }
      return false;
    }
    function checkStat(stat2, path9, options) {
      if (!stat2.isSymbolicLink() && !stat2.isFile()) {
        return false;
      }
      return checkPathExt(path9, options);
    }
    function isexe(path9, options, cb) {
      fs5.stat(path9, function(er, stat2) {
        cb(er, er ? false : checkStat(stat2, path9, options));
      });
    }
    function sync(path9, options) {
      return checkStat(fs5.statSync(path9), path9, options);
    }
  }
});

// node_modules/isexe/mode.js
var require_mode = __commonJS({
  "node_modules/isexe/mode.js"(exports2, module2) {
    module2.exports = isexe;
    isexe.sync = sync;
    var fs5 = require("fs");
    function isexe(path9, options, cb) {
      fs5.stat(path9, function(er, stat2) {
        cb(er, er ? false : checkStat(stat2, options));
      });
    }
    function sync(path9, options) {
      return checkStat(fs5.statSync(path9), options);
    }
    function checkStat(stat2, options) {
      return stat2.isFile() && checkMode(stat2, options);
    }
    function checkMode(stat2, options) {
      var mod = stat2.mode;
      var uid = stat2.uid;
      var gid = stat2.gid;
      var myUid = options.uid !== void 0 ? options.uid : process.getuid && process.getuid();
      var myGid = options.gid !== void 0 ? options.gid : process.getgid && process.getgid();
      var u = parseInt("100", 8);
      var g = parseInt("010", 8);
      var o = parseInt("001", 8);
      var ug = u | g;
      var ret = mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && myUid === 0;
      return ret;
    }
  }
});

// node_modules/isexe/index.js
var require_isexe = __commonJS({
  "node_modules/isexe/index.js"(exports2, module2) {
    var fs5 = require("fs");
    var core;
    if (process.platform === "win32" || global.TESTING_WINDOWS) {
      core = require_windows();
    } else {
      core = require_mode();
    }
    module2.exports = isexe;
    isexe.sync = sync;
    function isexe(path9, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      if (!cb) {
        if (typeof Promise !== "function") {
          throw new TypeError("callback not provided");
        }
        return new Promise(function(resolve6, reject) {
          isexe(path9, options || {}, function(er, is) {
            if (er) {
              reject(er);
            } else {
              resolve6(is);
            }
          });
        });
      }
      core(path9, options || {}, function(er, is) {
        if (er) {
          if (er.code === "EACCES" || options && options.ignoreErrors) {
            er = null;
            is = false;
          }
        }
        cb(er, is);
      });
    }
    function sync(path9, options) {
      try {
        return core.sync(path9, options || {});
      } catch (er) {
        if (options && options.ignoreErrors || er.code === "EACCES") {
          return false;
        } else {
          throw er;
        }
      }
    }
  }
});

// node_modules/which/which.js
var require_which = __commonJS({
  "node_modules/which/which.js"(exports2, module2) {
    var isWindows = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys";
    var path9 = require("path");
    var COLON = isWindows ? ";" : ":";
    var isexe = require_isexe();
    var getNotFoundError = (cmd) => Object.assign(new Error(`not found: ${cmd}`), { code: "ENOENT" });
    var getPathInfo = (cmd, opt) => {
      const colon = opt.colon || COLON;
      const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? [""] : [
        // windows always checks the cwd first
        ...isWindows ? [process.cwd()] : [],
        ...(opt.path || process.env.PATH || /* istanbul ignore next: very unusual */
        "").split(colon)
      ];
      const pathExtExe = isWindows ? opt.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "";
      const pathExt = isWindows ? pathExtExe.split(colon) : [""];
      if (isWindows) {
        if (cmd.indexOf(".") !== -1 && pathExt[0] !== "")
          pathExt.unshift("");
      }
      return {
        pathEnv,
        pathExt,
        pathExtExe
      };
    };
    var which = (cmd, opt, cb) => {
      if (typeof opt === "function") {
        cb = opt;
        opt = {};
      }
      if (!opt)
        opt = {};
      const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
      const found = [];
      const step = (i) => new Promise((resolve6, reject) => {
        if (i === pathEnv.length)
          return opt.all && found.length ? resolve6(found) : reject(getNotFoundError(cmd));
        const ppRaw = pathEnv[i];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path9.join(pathPart, cmd);
        const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        resolve6(subStep(p, i, 0));
      });
      const subStep = (p, i, ii) => new Promise((resolve6, reject) => {
        if (ii === pathExt.length)
          return resolve6(step(i + 1));
        const ext = pathExt[ii];
        isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
          if (!er && is) {
            if (opt.all)
              found.push(p + ext);
            else
              return resolve6(p + ext);
          }
          return resolve6(subStep(p, i, ii + 1));
        });
      });
      return cb ? step(0).then((res) => cb(null, res), cb) : step(0);
    };
    var whichSync = (cmd, opt) => {
      opt = opt || {};
      const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
      const found = [];
      for (let i = 0; i < pathEnv.length; i++) {
        const ppRaw = pathEnv[i];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path9.join(pathPart, cmd);
        const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        for (let j = 0; j < pathExt.length; j++) {
          const cur = p + pathExt[j];
          try {
            const is = isexe.sync(cur, { pathExt: pathExtExe });
            if (is) {
              if (opt.all)
                found.push(cur);
              else
                return cur;
            }
          } catch (ex) {
          }
        }
      }
      if (opt.all && found.length)
        return found;
      if (opt.nothrow)
        return null;
      throw getNotFoundError(cmd);
    };
    module2.exports = which;
    which.sync = whichSync;
  }
});

// node_modules/path-key/index.js
var require_path_key = __commonJS({
  "node_modules/path-key/index.js"(exports2, module2) {
    "use strict";
    var pathKey = (options = {}) => {
      const environment = options.env || process.env;
      const platform = options.platform || process.platform;
      if (platform !== "win32") {
        return "PATH";
      }
      return Object.keys(environment).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
    };
    module2.exports = pathKey;
    module2.exports.default = pathKey;
  }
});

// node_modules/cross-spawn/lib/util/resolveCommand.js
var require_resolveCommand = __commonJS({
  "node_modules/cross-spawn/lib/util/resolveCommand.js"(exports2, module2) {
    "use strict";
    var path9 = require("path");
    var which = require_which();
    var getPathKey = require_path_key();
    function resolveCommandAttempt(parsed, withoutPathExt) {
      const env2 = parsed.options.env || process.env;
      const cwd = process.cwd();
      const hasCustomCwd = parsed.options.cwd != null;
      const shouldSwitchCwd = hasCustomCwd && process.chdir !== void 0 && !process.chdir.disabled;
      if (shouldSwitchCwd) {
        try {
          process.chdir(parsed.options.cwd);
        } catch (err) {
        }
      }
      let resolved;
      try {
        resolved = which.sync(parsed.command, {
          path: env2[getPathKey({ env: env2 })],
          pathExt: withoutPathExt ? path9.delimiter : void 0
        });
      } catch (e) {
      } finally {
        if (shouldSwitchCwd) {
          process.chdir(cwd);
        }
      }
      if (resolved) {
        resolved = path9.resolve(hasCustomCwd ? parsed.options.cwd : "", resolved);
      }
      return resolved;
    }
    function resolveCommand(parsed) {
      return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
    }
    module2.exports = resolveCommand;
  }
});

// node_modules/cross-spawn/lib/util/escape.js
var require_escape = __commonJS({
  "node_modules/cross-spawn/lib/util/escape.js"(exports2, module2) {
    "use strict";
    var metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;
    function escapeCommand(arg) {
      arg = arg.replace(metaCharsRegExp, "^$1");
      return arg;
    }
    function escapeArgument(arg, doubleEscapeMetaChars) {
      arg = `${arg}`;
      arg = arg.replace(/(?=(\\+?)?)\1"/g, '$1$1\\"');
      arg = arg.replace(/(?=(\\+?)?)\1$/, "$1$1");
      arg = `"${arg}"`;
      arg = arg.replace(metaCharsRegExp, "^$1");
      if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, "^$1");
      }
      return arg;
    }
    module2.exports.command = escapeCommand;
    module2.exports.argument = escapeArgument;
  }
});

// node_modules/shebang-regex/index.js
var require_shebang_regex = __commonJS({
  "node_modules/shebang-regex/index.js"(exports2, module2) {
    "use strict";
    module2.exports = /^#!(.*)/;
  }
});

// node_modules/shebang-command/index.js
var require_shebang_command = __commonJS({
  "node_modules/shebang-command/index.js"(exports2, module2) {
    "use strict";
    var shebangRegex = require_shebang_regex();
    module2.exports = (string = "") => {
      const match = string.match(shebangRegex);
      if (!match) {
        return null;
      }
      const [path9, argument] = match[0].replace(/#! ?/, "").split(" ");
      const binary = path9.split("/").pop();
      if (binary === "env") {
        return argument;
      }
      return argument ? `${binary} ${argument}` : binary;
    };
  }
});

// node_modules/cross-spawn/lib/util/readShebang.js
var require_readShebang = __commonJS({
  "node_modules/cross-spawn/lib/util/readShebang.js"(exports2, module2) {
    "use strict";
    var fs5 = require("fs");
    var shebangCommand = require_shebang_command();
    function readShebang(command) {
      const size = 150;
      const buffer = Buffer.alloc(size);
      let fd;
      try {
        fd = fs5.openSync(command, "r");
        fs5.readSync(fd, buffer, 0, size, 0);
        fs5.closeSync(fd);
      } catch (e) {
      }
      return shebangCommand(buffer.toString());
    }
    module2.exports = readShebang;
  }
});

// node_modules/cross-spawn/lib/parse.js
var require_parse = __commonJS({
  "node_modules/cross-spawn/lib/parse.js"(exports2, module2) {
    "use strict";
    var path9 = require("path");
    var resolveCommand = require_resolveCommand();
    var escape = require_escape();
    var readShebang = require_readShebang();
    var isWin = process.platform === "win32";
    var isExecutableRegExp = /\.(?:com|exe)$/i;
    var isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
    function detectShebang(parsed) {
      parsed.file = resolveCommand(parsed);
      const shebang = parsed.file && readShebang(parsed.file);
      if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;
        return resolveCommand(parsed);
      }
      return parsed.file;
    }
    function parseNonShell(parsed) {
      if (!isWin) {
        return parsed;
      }
      const commandFile = detectShebang(parsed);
      const needsShell = !isExecutableRegExp.test(commandFile);
      if (parsed.options.forceShell || needsShell) {
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);
        parsed.command = path9.normalize(parsed.command);
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));
        const shellCommand = [parsed.command].concat(parsed.args).join(" ");
        parsed.args = ["/d", "/s", "/c", `"${shellCommand}"`];
        parsed.command = process.env.comspec || "cmd.exe";
        parsed.options.windowsVerbatimArguments = true;
      }
      return parsed;
    }
    function parse(command, args, options) {
      if (args && !Array.isArray(args)) {
        options = args;
        args = null;
      }
      args = args ? args.slice(0) : [];
      options = Object.assign({}, options);
      const parsed = {
        command,
        args,
        options,
        file: void 0,
        original: {
          command,
          args
        }
      };
      return options.shell ? parsed : parseNonShell(parsed);
    }
    module2.exports = parse;
  }
});

// node_modules/cross-spawn/lib/enoent.js
var require_enoent = __commonJS({
  "node_modules/cross-spawn/lib/enoent.js"(exports2, module2) {
    "use strict";
    var isWin = process.platform === "win32";
    function notFoundError(original, syscall) {
      return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: "ENOENT",
        errno: "ENOENT",
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args
      });
    }
    function hookChildProcess(cp, parsed) {
      if (!isWin) {
        return;
      }
      const originalEmit = cp.emit;
      cp.emit = function(name, arg1) {
        if (name === "exit") {
          const err = verifyENOENT(arg1, parsed);
          if (err) {
            return originalEmit.call(cp, "error", err);
          }
        }
        return originalEmit.apply(cp, arguments);
      };
    }
    function verifyENOENT(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawn");
      }
      return null;
    }
    function verifyENOENTSync(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawnSync");
      }
      return null;
    }
    module2.exports = {
      hookChildProcess,
      verifyENOENT,
      verifyENOENTSync,
      notFoundError
    };
  }
});

// node_modules/cross-spawn/index.js
var require_cross_spawn = __commonJS({
  "node_modules/cross-spawn/index.js"(exports2, module2) {
    "use strict";
    var cp = require("child_process");
    var parse = require_parse();
    var enoent = require_enoent();
    function spawn2(command, args, options) {
      const parsed = parse(command, args, options);
      const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);
      enoent.hookChildProcess(spawned, parsed);
      return spawned;
    }
    function spawnSync(command, args, options) {
      const parsed = parse(command, args, options);
      const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);
      result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
      return result;
    }
    module2.exports = spawn2;
    module2.exports.spawn = spawn2;
    module2.exports.sync = spawnSync;
    module2.exports._parse = parse;
    module2.exports._enoent = enoent;
  }
});

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var import_node_child_process2 = require("node:child_process");
var import_node_crypto = require("node:crypto");
var path8 = __toESM(require("node:path"));
var import_node_util = require("node:util");
var vscode5 = __toESM(require("vscode"));

// src/jsonRpc.ts
var import_node_events = require("node:events");
var JsonRpcPeer = class extends import_node_events.EventEmitter {
  constructor(writer, handlers = {}, trace) {
    super();
    this.writer = writer;
    this.handlers = handlers;
    this.trace = trace;
  }
  writer;
  handlers;
  trace;
  buffer = "";
  nextId = 1;
  pending = /* @__PURE__ */ new Map();
  closed = false;
  get isClosed() {
    return this.closed;
  }
  sendRequest(method, params) {
    if (this.closed) {
      return Promise.reject(new Error("JSON-RPC peer is closed"));
    }
    const id = this.nextId++;
    const frame = { jsonrpc: "2.0", id, method, params };
    const promise = new Promise((resolve6, reject) => {
      this.pending.set(id, { resolve: resolve6, reject });
    });
    this.writeFrame(frame);
    return promise;
  }
  sendNotification(method, params) {
    if (this.closed) {
      return;
    }
    const frame = { jsonrpc: "2.0", method, params };
    this.writeFrame(frame);
  }
  handleData(chunk) {
    this.buffer += chunk.toString();
    for (; ; ) {
      const i = this.buffer.indexOf("\n");
      if (i < 0) {
        return;
      }
      const line = this.buffer.slice(0, i).trim();
      this.buffer = this.buffer.slice(i + 1);
      if (line.length > 0) {
        this.dispatchLine(line);
      }
    }
  }
  close(reason = new Error("JSON-RPC peer closed")) {
    if (this.closed) {
      return;
    }
    this.closed = true;
    for (const pending of this.pending.values()) {
      pending.reject(reason);
    }
    this.pending.clear();
  }
  dispatchLine(line) {
    this.trace?.("< " + line);
    let frame;
    try {
      frame = JSON.parse(line);
    } catch (err) {
      this.reportError(err instanceof Error ? err : new Error(String(err)));
      return;
    }
    if ("method" in frame && frame.method && "id" in frame) {
      void this.handleRequest(frame);
      return;
    }
    if ("method" in frame && frame.method) {
      const handler = this.handlers.onNotification;
      if (handler) {
        void Promise.resolve().then(() => handler(frame.method, frame.params)).catch((err) => this.reportError(err instanceof Error ? err : new Error(String(err))));
      }
      return;
    }
    if ("id" in frame) {
      this.handleResponse(frame);
      return;
    }
    this.reportError(new Error("invalid JSON-RPC frame"));
  }
  async handleRequest(frame) {
    try {
      const result = this.handlers.onRequest ? await this.handlers.onRequest(frame.method, frame.params) : void 0;
      if (!this.closed) {
        this.writeFrame({ jsonrpc: "2.0", id: frame.id, result });
      }
    } catch (err) {
      if (!this.closed) {
        const message = err instanceof Error ? err.message : String(err);
        this.writeFrame({ jsonrpc: "2.0", id: frame.id, error: { code: -32603, message } });
      }
    }
  }
  handleResponse(frame) {
    const id = typeof frame.id === "number" ? frame.id : Number(frame.id);
    if (Number.isNaN(id)) {
      return;
    }
    const pending = this.pending.get(id);
    if (!pending) {
      return;
    }
    this.pending.delete(id);
    if (frame.error) {
      pending.reject(new Error(frame.error.message));
      return;
    }
    pending.resolve(frame.result);
  }
  writeFrame(frame) {
    const line = JSON.stringify(frame);
    this.trace?.("> " + line);
    this.writer.write(line + "\n");
  }
  reportError(err) {
    this.handlers.onError?.(err);
  }
};

// src/reasonixLauncher.ts
var import_promises = require("node:fs/promises");
var path = __toESM(require("node:path"));
var crossSpawn = require_cross_spawn();
var windowsExecutableExtensions = [".exe", ".com", ".cmd", ".bat"];
function selectReasonixPath(stdout, platform = process.platform) {
  const candidates = stdout.split(/\r?\n/).map((line) => line.trim()).filter((line) => line !== "");
  if (platform !== "win32") {
    return candidates[0];
  }
  return candidates.find(isRunnableWindowsPath) ?? candidates[0];
}
async function normalizeReasonixPath(configured, platform = process.platform, pathExists = defaultPathExists, arch = process.arch) {
  const candidate = configured.trim();
  if (platform !== "win32") {
    return candidate;
  }
  const extension = path.win32.extname(candidate).toLowerCase();
  if (extension === ".exe" || extension === ".com") {
    return candidate;
  }
  const bundledExecutable = await findBundledWindowsExecutable(candidate, arch, pathExists);
  if (bundledExecutable) {
    return bundledExecutable;
  }
  if (extension !== "") {
    return candidate;
  }
  for (const extension2 of windowsExecutableExtensions) {
    const sibling = `${candidate}${extension2}`;
    if (await pathExists(sibling)) {
      return sibling;
    }
  }
  return candidate;
}
function spawnReasonix(binaryPath, args, cwd) {
  return crossSpawn(binaryPath, [...args], {
    cwd,
    env: process.env,
    stdio: ["pipe", "pipe", "pipe"],
    windowsHide: true
  });
}
function isRunnableWindowsPath(candidate) {
  const extension = path.win32.extname(candidate).toLowerCase();
  return windowsExecutableExtensions.includes(extension);
}
async function findBundledWindowsExecutable(candidate, arch, pathExists) {
  const extension = path.win32.extname(candidate);
  const commandName = path.win32.basename(candidate, extension);
  if (commandName.toLowerCase() !== "reasonix") {
    return void 0;
  }
  const shimDirectory = path.win32.dirname(candidate);
  const nodeModules = path.win32.basename(shimDirectory).toLowerCase() === ".bin" ? path.win32.dirname(shimDirectory) : path.win32.join(shimDirectory, "node_modules");
  const platformPackage = `cli-win32-${arch}`;
  const executableCandidates = [
    path.win32.join(nodeModules, "reasonix", "node_modules", "@reasonix", platformPackage, "bin", "reasonix.exe"),
    path.win32.join(nodeModules, "@reasonix", platformPackage, "bin", "reasonix.exe")
  ];
  for (const executable of executableCandidates) {
    if (await pathExists(executable)) {
      return executable;
    }
  }
  return void 0;
}
async function defaultPathExists(candidate) {
  try {
    await (0, import_promises.access)(candidate);
    return true;
  } catch {
    return false;
  }
}

// src/acpProtocol.ts
var REASONIX_STATUS_METHOD = "_reasonix.io/session/status";
var REASONIX_STATUS_UPDATE_METHOD = "_reasonix.io/session/status_update";
var REASONIX_STATUS_SCHEMA_VERSION = 1;
function parseSessionUpdateParams(value) {
  if (!isRecord(value) || !nonEmptyString(value.sessionId) || !isRecord(value.update)) {
    return invalid("session/update params require sessionId and update");
  }
  const update = parseSessionUpdate(value.update);
  if (!update.ok) {
    return update;
  }
  return valid({ sessionId: value.sessionId, update: update.value });
}
function supportsReasonixStatusMethod(capabilities, method) {
  if (!isRecord(capabilities) || !isRecord(capabilities._meta)) {
    return false;
  }
  const advertised = capabilities._meta[method];
  return isRecord(advertised) && advertised.schemaVersion === REASONIX_STATUS_SCHEMA_VERSION;
}
function parseReasonixSessionStatus(value) {
  if (!isRecord(value) || value.schemaVersion !== REASONIX_STATUS_SCHEMA_VERSION || !nonNegativeInteger(value.sequence) || !nonEmptyString(value.sessionId) || !isRecord(value.usage) || !isReasonixStatusUsage(value.usage.turn) || !isReasonixStatusUsage(value.usage.cumulative)) {
    return invalid("Reasonix session status is malformed");
  }
  return valid(value);
}
function parseReasonixStatusUpdateParams(value) {
  if (!isRecord(value) || value.schemaVersion !== REASONIX_STATUS_SCHEMA_VERSION || !nonNegativeInteger(value.sequence) || !nonEmptyString(value.sessionId) || !nonEmptyString(value.event)) {
    return invalid("Reasonix status update is malformed");
  }
  const status = parseReasonixSessionStatus(value.status);
  if (!status.ok) {
    return status;
  }
  if (status.value.sequence !== value.sequence || status.value.sessionId !== value.sessionId) {
    return invalid("Reasonix status update does not match its status snapshot");
  }
  return valid(value);
}
function usageDataFromReasonixStatus(status) {
  const turn = status.usage.turn;
  const cumulative = status.usage.cumulative;
  return {
    promptTokens: turn.promptTokens,
    completionTokens: turn.completionTokens,
    totalTokens: turn.promptTokens + turn.completionTokens,
    cacheHitTokens: turn.cacheHitTokens,
    cacheMissTokens: turn.cacheMissTokens,
    reasoningTokens: turn.reasoningTokens,
    sessionCacheHitTokens: cumulative.cacheHitTokens,
    sessionCacheMissTokens: cumulative.cacheMissTokens,
    ...turn.estimatedCost === void 0 || turn.estimatedCost === null ? {} : { cost: turn.estimatedCost },
    ...turn.currency === void 0 || turn.currency === null ? {} : { currency: turn.currency }
  };
}
function parsePermissionRequestParams(value) {
  if (!isRecord(value) || !nonEmptyString(value.sessionId) || !isRecord(value.toolCall) || !Array.isArray(value.options)) {
    return invalid("permission request requires sessionId, toolCall, and options");
  }
  if (!nonEmptyString(value.toolCall.toolCallId)) {
    return invalid("permission toolCall requires toolCallId");
  }
  const options = value.options.filter(isPermissionOption);
  if (options.length !== value.options.length || options.length === 0) {
    return invalid("permission options are malformed or empty");
  }
  return valid(value);
}
function parseFSReadTextFileParams(value) {
  if (!isRecord(value) || !nonEmptyString(value.sessionId) || !nonEmptyString(value.path)) {
    return invalid("fs/read_text_file requires sessionId and path");
  }
  if (value.line !== void 0 && !positiveInteger(value.line)) {
    return invalid("fs/read_text_file line must be a positive integer");
  }
  if (value.limit !== void 0 && !positiveInteger(value.limit)) {
    return invalid("fs/read_text_file limit must be a positive integer");
  }
  return valid(value);
}
function parseFSWriteTextFileParams(value) {
  if (!isRecord(value) || !nonEmptyString(value.sessionId) || !nonEmptyString(value.path) || typeof value.content !== "string") {
    return invalid("fs/write_text_file requires sessionId, path, and content");
  }
  return valid(value);
}
function parseTerminalCreateParams(value) {
  if (!isRecord(value) || !nonEmptyString(value.sessionId) || !nonEmptyString(value.command)) {
    return invalid("terminal/create requires sessionId and command");
  }
  if (value.args !== void 0 && (!Array.isArray(value.args) || !value.args.every((arg) => typeof arg === "string"))) {
    return invalid("terminal/create args must be strings");
  }
  if (value.cwd !== void 0 && typeof value.cwd !== "string") {
    return invalid("terminal/create cwd must be a string");
  }
  if (value.outputByteLimit !== void 0 && !positiveInteger(value.outputByteLimit)) {
    return invalid("terminal/create outputByteLimit must be a positive integer");
  }
  return valid(value);
}
function parseTerminalIDParams(value) {
  if (!isRecord(value) || !nonEmptyString(value.sessionId) || !nonEmptyString(value.terminalId)) {
    return invalid("terminal request requires sessionId and terminalId");
  }
  return valid(value);
}
function parseSessionUpdate(update) {
  const tag = update.sessionUpdate;
  if (typeof tag !== "string") {
    return invalid("session update is missing sessionUpdate");
  }
  switch (tag) {
    case "user_message_chunk":
    case "agent_message_chunk":
    case "agent_thought_chunk":
      return isContentBlock(update.content) ? valid(update) : invalid(`${tag} requires a valid content block`);
    case "tool_call":
      if (!nonEmptyString(update.toolCallId)) {
        return invalid("tool_call requires toolCallId");
      }
      if (update.locations !== void 0 && (!Array.isArray(update.locations) || !update.locations.every(isToolLocation))) {
        return invalid("tool_call locations are malformed");
      }
      return valid(update);
    case "tool_call_update":
      if (!nonEmptyString(update.toolCallId)) {
        return invalid("tool_call_update requires toolCallId");
      }
      if (update.content !== void 0 && (!Array.isArray(update.content) || !update.content.every(isToolContent))) {
        return invalid("tool_call_update content is malformed");
      }
      return valid(update);
    case "available_commands_update":
      return Array.isArray(update.availableCommands) && update.availableCommands.every(isAvailableCommand) ? valid(update) : invalid("available_commands_update requires valid commands");
    case "config_option_update":
      return Array.isArray(update.configOptions) && update.configOptions.every(isConfigOption) ? valid(update) : invalid("config_option_update requires valid configOptions");
    case "plan":
      return Array.isArray(update.entries) && update.entries.every(isPlanEntry) ? valid(update) : invalid("plan update requires valid entries");
    case "current_mode_update":
      return nonEmptyString(update.currentModeId) ? valid(update) : invalid("current_mode_update requires currentModeId");
    case "usage":
      return isUsage(update.usage) ? valid(update) : invalid("usage update is malformed");
    default:
      return invalid(`unsupported session update: ${tag}`);
  }
}
function isContentBlock(value) {
  if (!isRecord(value)) {
    return false;
  }
  if (value.type === "text") {
    return typeof value.text === "string";
  }
  if (value.type === "image") {
    return typeof value.data === "string" && nonEmptyString(value.mimeType);
  }
  return value.type === "resource" && isRecord(value.resource) && nonEmptyString(value.resource.uri) && (value.resource.text === void 0 || typeof value.resource.text === "string") && (value.resource.mimeType === void 0 || typeof value.resource.mimeType === "string");
}
function isToolContent(value) {
  return isRecord(value) && typeof value.type === "string" && isContentBlock(value.content);
}
function isToolLocation(value) {
  return isRecord(value) && nonEmptyString(value.path) && (value.line === void 0 || positiveInteger(value.line));
}
function isAvailableCommand(value) {
  return isRecord(value) && nonEmptyString(value.name) && typeof value.description === "string" && (value.input === void 0 || isRecord(value.input) && typeof value.input.hint === "string");
}
function isConfigOption(value) {
  return isRecord(value) && nonEmptyString(value.id) && nonEmptyString(value.name) && typeof value.type === "string" && typeof value.currentValue === "string" && Array.isArray(value.options) && value.options.every((option) => isRecord(option) && typeof option.value === "string" && nonEmptyString(option.name));
}
function isPlanEntry(value) {
  return isRecord(value) && typeof value.content === "string" && typeof value.priority === "string" && typeof value.status === "string";
}
function isUsage(value) {
  if (!isRecord(value)) {
    return false;
  }
  return ["promptTokens", "completionTokens", "totalTokens", "cacheHitTokens", "cacheMissTokens", "sessionCacheHitTokens", "sessionCacheMissTokens"].every((key) => typeof value[key] === "number" && Number.isFinite(value[key]));
}
function isReasonixStatusUsage(value) {
  if (!isRecord(value)) {
    return false;
  }
  const counts = ["promptTokens", "completionTokens", "reasoningTokens", "cacheHitTokens", "cacheMissTokens"];
  return counts.every((key) => nonNegativeInteger(value[key])) && (value.estimated === void 0 || typeof value.estimated === "boolean") && optionalFiniteNumber(value.cacheHitRatio) && optionalFiniteNumber(value.estimatedCost) && (value.currency === void 0 || value.currency === null || typeof value.currency === "string") && typeof value.usageSource === "string";
}
function optionalFiniteNumber(value) {
  return value === void 0 || value === null || typeof value === "number" && Number.isFinite(value);
}
function isPermissionOption(value) {
  return isRecord(value) && nonEmptyString(value.optionId) && nonEmptyString(value.name) && nonEmptyString(value.kind);
}
function positiveInteger(value) {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}
function nonNegativeInteger(value) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}
function nonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function valid(value) {
  return { ok: true, value };
}
function invalid(error) {
  return { ok: false, error };
}

// src/sanitize.ts
function redactLocalPaths(text, cwd) {
  let out = text;
  const home = process.env.HOME || process.env.USERPROFILE;
  const pairs = [
    [cwd, "${workspace}"],
    [home, "~"]
  ];
  for (const [raw, replacement] of pairs) {
    if (!raw || raw.trim() === "") {
      continue;
    }
    out = replaceAll(out, raw, replacement);
    out = replaceAll(out, raw.replaceAll("\\", "/"), replacement);
  }
  return out;
}
function replaceAll(text, needle, replacement) {
  if (needle === "") {
    return text;
  }
  return text.split(needle).join(replacement);
}

// src/acpClient.ts
var AcpClient = class {
  constructor(options) {
    this.options = options;
  }
  options;
  child;
  peer;
  sessionId;
  runningPrompt = false;
  initialized;
  state = {};
  statusSequences = /* @__PURE__ */ new Map();
  get connected() {
    return this.child !== void 0 && this.peer !== void 0 && !this.peer.isClosed;
  }
  get running() {
    return this.runningPrompt;
  }
  get id() {
    return this.sessionId;
  }
  get capabilities() {
    return this.initialized?.agentCapabilities;
  }
  get authMethods() {
    return this.initialized?.authMethods ?? [];
  }
  get sessionState() {
    return this.state;
  }
  async start() {
    if (this.sessionId && this.connected) {
      return { sessionId: this.sessionId, isNewSession: false };
    }
    const args = ["acp"];
    if (this.options.model && this.options.model.trim() !== "") {
      args.push("--model", this.options.model.trim());
    }
    this.appendLine(`Starting ${this.options.binaryPath} ${args.join(" ")}`);
    this.child = spawnReasonix(this.options.binaryPath, args, this.options.cwd);
    this.peer = new JsonRpcPeer(
      this.child.stdin,
      {
        onNotification: (method, params) => this.handleNotification(method, params),
        onRequest: (method, params) => this.handleRequest(method, params),
        onError: (err) => this.appendLine(`ACP protocol error: ${err.message}`)
      },
      this.options.trace ? (line) => this.appendLine(line) : void 0
    );
    this.child.stdout.on("data", (chunk) => this.peer?.handleData(chunk));
    this.child.stderr.on("data", (chunk) => this.append(chunk.toString()));
    this.child.on("error", (err) => {
      this.peer?.close(err);
    });
    this.child.on("close", (code, signal) => {
      const reason = signal ? `signal ${signal}` : `exit ${code ?? "unknown"}`;
      this.peer?.close(new Error(`Reasonix ACP closed: ${reason}`));
      this.peer = void 0;
      this.child = void 0;
      this.runningPrompt = false;
      this.options.onDisconnect(reason);
    });
    this.initialized = await this.peer.sendRequest("initialize", {
      protocolVersion: 1,
      clientInfo: { name: "reasonix-vscode", title: "Reasonix VS Code", version: "0.2.0" },
      clientCapabilities: {
        fs: {
          readTextFile: this.options.fileSystem !== void 0,
          writeTextFile: this.options.fileSystem !== void 0
        },
        terminal: this.options.terminal !== void 0
      }
    });
    if (this.options.previousSessionId) {
      const previous = this.options.previousSessionId;
      this.sessionId = previous;
      this.options.onSessionId(previous);
      try {
        const resumed = await this.openExistingSession(previous);
        this.applySessionState(resumed);
        await this.syncReasonixStatus();
        return { sessionId: previous, isNewSession: false };
      } catch (err) {
        this.appendLine(`Could not restore Reasonix session ${previous}: ${errorMessage(err)}`);
        this.sessionId = void 0;
      }
    }
    const created = await this.peer.sendRequest("session/new", {
      cwd: this.options.cwd,
      mcpServers: []
    });
    if (!created || typeof created.sessionId !== "string" || created.sessionId.trim() === "") {
      throw new Error("Reasonix returned an invalid session/new result");
    }
    this.sessionId = created.sessionId;
    this.applySessionState(created);
    this.options.onSessionId(created.sessionId);
    await this.syncReasonixStatus();
    return { sessionId: created.sessionId, isNewSession: true };
  }
  async sendPrompt(prompt) {
    const peer = this.requirePeer();
    const sessionId = this.requireSession();
    const blocks = typeof prompt === "string" ? [{ type: "text", text: prompt }] : prompt;
    this.runningPrompt = true;
    try {
      return await peer.sendRequest("session/prompt", { sessionId, prompt: blocks });
    } finally {
      this.runningPrompt = false;
    }
  }
  cancel() {
    if (this.peer && this.sessionId) {
      this.peer.sendNotification("session/cancel", { sessionId: this.sessionId });
    }
  }
  async setMode(modeId) {
    await this.requirePeer().sendRequest("session/set_mode", { sessionId: this.requireSession(), modeId });
    if (this.state.modes) {
      this.applySessionState({ modes: { ...this.state.modes, currentModeId: modeId } });
    }
  }
  async setConfigOption(configId, value) {
    const result = await this.requirePeer().sendRequest("session/set_config_option", {
      sessionId: this.requireSession(),
      configId,
      value
    });
    const options = result?.configOptions ?? this.state.configOptions?.map((option) => option.id === configId ? { ...option, currentValue: value } : option) ?? [];
    this.applySessionState({ configOptions: options });
    return options;
  }
  async setModel(modelId) {
    const option = this.configOption("model");
    if (option) {
      await this.setConfigOption(option.id, modelId);
      return;
    }
    await this.requirePeer().sendRequest("session/set_model", { sessionId: this.requireSession(), modelId });
    if (this.state.models) {
      this.applySessionState({ models: { ...this.state.models, currentModelId: modelId } });
    }
  }
  async setEffort(_modelRef, level) {
    const option = this.configOption("thought_level") ?? this.state.configOptions?.find((candidate) => candidate.id.toLowerCase().includes("effort"));
    if (option) {
      await this.setConfigOption(option.id, level);
      return { modelRef: this.currentModelId(), level };
    }
    return await this.requirePeer().sendRequest("effort/set", { modelRef: this.currentModelId(), level });
  }
  async listSessions() {
    const result = await this.requirePeer().sendRequest("session/list", { cwd: this.options.cwd });
    return Array.isArray(result?.sessions) ? result.sessions : [];
  }
  async closeSession(sessionId = this.requireSession()) {
    await this.requirePeer().sendRequest("session/close", { sessionId });
  }
  async deleteSession(sessionId) {
    await this.requirePeer().sendRequest("session/delete", { sessionId });
  }
  // Private main-branch methods remain as guarded fallbacks for older binaries.
  async status() {
    return await this.requirePeer().sendRequest("session/status", { sessionId: this.requireSession() });
  }
  async listModels() {
    return await this.requirePeer().sendRequest("model/list", {});
  }
  dispose() {
    this.peer?.close(new Error("Reasonix ACP disposed"));
    this.peer = void 0;
    if (this.child && !this.child.killed) {
      this.child.kill();
    }
    this.child = void 0;
    this.runningPrompt = false;
  }
  async openExistingSession(sessionId) {
    const params = { sessionId, cwd: this.options.cwd, mcpServers: [] };
    if (this.options.resumeSession && this.capabilities?.sessionCapabilities?.resume) {
      try {
        return await this.requirePeer().sendRequest("session/resume", params);
      } catch (err) {
        this.appendLine(`Could not resume without replay; falling back to session/load: ${errorMessage(err)}`);
      }
    }
    return await this.requirePeer().sendRequest("session/load", params);
  }
  handleNotification(method, params) {
    if (method === REASONIX_STATUS_UPDATE_METHOD) {
      if (!supportsReasonixStatusMethod(this.capabilities, method)) {
        this.appendLine(`Ignoring unadvertised ACP notification: ${method}`);
        return;
      }
      const parsedStatus = parseReasonixStatusUpdateParams(params);
      if (!parsedStatus.ok) {
        this.appendLine(`Ignoring invalid Reasonix status update: ${parsedStatus.error}`);
        return;
      }
      this.acceptReasonixStatus(parsedStatus.value.status, parsedStatus.value.event);
      return;
    }
    if (method !== "session/update") {
      this.appendLine(`Ignoring unsupported ACP notification: ${method}`);
      return;
    }
    const parsed = parseSessionUpdateParams(params);
    if (!parsed.ok) {
      this.appendLine(`Ignoring invalid ACP session/update: ${parsed.error}`);
      return;
    }
    const update = parsed.value.update;
    if (update.sessionUpdate === "config_option_update") {
      this.applySessionState({ configOptions: update.configOptions });
    } else if (update.sessionUpdate === "current_mode_update" && this.state.modes) {
      this.applySessionState({ modes: { ...this.state.modes, currentModeId: update.currentModeId } });
    }
    this.options.onUpdate(parsed.value);
  }
  async syncReasonixStatus() {
    if (!supportsReasonixStatusMethod(this.capabilities, REASONIX_STATUS_METHOD)) {
      return;
    }
    try {
      const raw = await this.requirePeer().sendRequest(REASONIX_STATUS_METHOD, { sessionId: this.requireSession() });
      const parsed = parseReasonixSessionStatus(raw);
      if (!parsed.ok) {
        this.appendLine(`Ignoring invalid Reasonix session status: ${parsed.error}`);
        return;
      }
      this.acceptReasonixStatus(parsed.value);
    } catch (err) {
      this.appendLine(`Could not read Reasonix session status: ${errorMessage(err)}`);
    }
  }
  acceptReasonixStatus(status, event) {
    if (status.sessionId !== this.sessionId) {
      this.appendLine(`Ignoring Reasonix status for inactive session ${status.sessionId}`);
      return;
    }
    const previous = this.statusSequences.get(status.sessionId);
    if (previous !== void 0 && status.sequence <= previous) {
      return;
    }
    this.statusSequences.set(status.sessionId, status.sequence);
    this.options.onReasonixStatus?.(status, event);
  }
  async handleRequest(method, params) {
    switch (method) {
      case "session/request_permission": {
        const parsed = requireParsed(parsePermissionRequestParams(params));
        this.assertRequestSession(parsed.sessionId);
        return await this.options.onPermissionRequest(parsed);
      }
      case "fs/read_text_file": {
        const parsed = requireParsed(parseFSReadTextFileParams(params));
        this.assertRequestSession(parsed.sessionId);
        return await this.requireFileSystem().readTextFile(parsed);
      }
      case "fs/write_text_file": {
        const parsed = requireParsed(parseFSWriteTextFileParams(params));
        this.assertRequestSession(parsed.sessionId);
        return await this.requireFileSystem().writeTextFile(parsed);
      }
      case "terminal/create": {
        const parsed = requireParsed(parseTerminalCreateParams(params));
        this.assertRequestSession(parsed.sessionId);
        return await this.requireTerminal().create(parsed);
      }
      case "terminal/output": {
        const parsed = requireParsed(parseTerminalIDParams(params));
        this.assertRequestSession(parsed.sessionId);
        return await this.requireTerminal().output(parsed);
      }
      case "terminal/wait_for_exit": {
        const parsed = requireParsed(parseTerminalIDParams(params));
        this.assertRequestSession(parsed.sessionId);
        return await this.requireTerminal().waitForExit(parsed);
      }
      case "terminal/kill": {
        const parsed = requireParsed(parseTerminalIDParams(params));
        this.assertRequestSession(parsed.sessionId);
        return await this.requireTerminal().kill(parsed);
      }
      case "terminal/release": {
        const parsed = requireParsed(parseTerminalIDParams(params));
        this.assertRequestSession(parsed.sessionId);
        return await this.requireTerminal().release(parsed);
      }
      default:
        throw new Error(`unsupported ACP request: ${method}`);
    }
  }
  applySessionState(next) {
    this.state = {
      models: next.models ?? this.state.models,
      modes: next.modes ?? this.state.modes,
      configOptions: next.configOptions ?? this.state.configOptions
    };
    this.options.onSessionState?.(this.state);
  }
  configOption(category) {
    return this.state.configOptions?.find((option) => option.category === category);
  }
  currentModelId() {
    return this.configOption("model")?.currentValue ?? this.state.models?.currentModelId ?? this.options.model ?? "";
  }
  assertRequestSession(sessionId) {
    if (this.sessionId && sessionId !== this.sessionId) {
      throw new Error(`ACP request targets unexpected session ${sessionId}`);
    }
  }
  requireFileSystem() {
    if (!this.options.fileSystem) {
      throw new Error("Reasonix requested filesystem access that the client did not advertise");
    }
    return this.options.fileSystem;
  }
  requireTerminal() {
    if (!this.options.terminal) {
      throw new Error("Reasonix requested a terminal that the client did not advertise");
    }
    return this.options.terminal;
  }
  requirePeer() {
    if (!this.peer) {
      throw new Error("Reasonix ACP is not connected");
    }
    return this.peer;
  }
  requireSession() {
    if (!this.sessionId) {
      throw new Error("Reasonix session is not ready");
    }
    return this.sessionId;
  }
  append(value) {
    this.options.output.append(redactLocalPaths(value, this.options.cwd));
  }
  appendLine(value) {
    this.options.output.appendLine(redactLocalPaths(value, this.options.cwd));
  }
};
function requireParsed(result) {
  if (!result.ok) {
    throw new Error(result.error);
  }
  return result.value;
}
function errorMessage(err) {
  return err instanceof Error ? err.message : String(err);
}

// src/chatState.ts
function appendUserMessage(items, text) {
  return items.push({ type: "message", role: "user", text }) - 1;
}
function appendNotice(items, text) {
  return items.push({ type: "message", role: "notice", text }) - 1;
}
function appendApproval(items, params) {
  if (isQuestionRequest(params)) {
    const detail = params.toolCall.content?.map((part) => contentText(part.content)).filter(Boolean).join("\n");
    return items.push({
      type: "question",
      id: params.toolCall.toolCallId,
      title: params.toolCall.title ?? "Question",
      ...detail ? { detail } : {},
      options: params.options.filter((option) => !option.optionId.endsWith(":cancel") && !option.kind.startsWith("reject")).map((option) => ({ optionId: option.optionId, name: option.name })),
      status: "pending"
    }) - 1;
  }
  return items.push({
    type: "approval",
    id: params.toolCall.toolCallId,
    title: params.toolCall.title ?? params.toolCall.toolCallId,
    kind: params.toolCall.kind ?? "other",
    rawInput: params.toolCall.rawInput,
    preview: params.toolCall.preview,
    options: params.options,
    status: "pending"
  }) - 1;
}
function resolveApproval(items, id, selected) {
  const index = items.findIndex((candidate) => (candidate.type === "approval" || candidate.type === "question") && candidate.id === id);
  const item = items[index];
  if (item?.type === "approval" || item?.type === "question") {
    items[index] = { ...item, status: selected ? "selected" : "cancelled" };
    return index;
  }
  return void 0;
}
function applySessionUpdate(items, update) {
  switch (update.sessionUpdate) {
    case "user_message_chunk":
      return appendChunk(items, "user", contentText(update.content));
    case "agent_message_chunk":
      return appendChunk(items, "assistant", contentText(update.content));
    case "agent_thought_chunk":
      return appendChunk(items, "thought", contentText(update.content));
    case "tool_call": {
      const index = items.findIndex((item) => item.type === "tool" && item.id === update.toolCallId);
      const existing = items[index];
      if (existing?.type === "tool") {
        items[index] = {
          ...existing,
          title: update.title ?? existing.title,
          kind: update.kind ?? existing.kind,
          status: update.status ?? existing.status,
          rawInput: update.rawInput ?? existing.rawInput,
          ...update.preview !== void 0 ? { preview: update.preview } : {},
          ...update.locations !== void 0 ? { locations: update.locations } : {}
        };
        return index;
      }
      const toolItem = {
        type: "tool",
        id: update.toolCallId,
        title: update.title ?? update.toolCallId,
        kind: update.kind ?? "other",
        status: update.status ?? "pending",
        rawInput: update.rawInput,
        ...update.locations ? { locations: update.locations } : {}
      };
      if (update.preview !== void 0) {
        toolItem.preview = update.preview;
      }
      return items.push(toolItem) - 1;
    }
    case "tool_call_update": {
      const text = update.content?.map((part) => contentText(part.content)).join("\n") ?? "";
      const index = items.findIndex((item) => item.type === "tool" && item.id === update.toolCallId);
      const existing = items[index];
      if (existing?.type === "tool") {
        items[index] = { ...existing, status: update.status ?? existing.status, content: text };
        return index;
      }
      return items.push({
        type: "tool",
        id: update.toolCallId,
        title: update.toolCallId,
        kind: "other",
        status: update.status ?? "completed",
        content: text
      }) - 1;
    }
    case "usage": {
      const last = items.at(-1);
      if (last?.type === "usage") {
        const index = items.length - 1;
        items[index] = { ...last, usage: update.usage };
        return index;
      }
      return items.push({ type: "usage", usage: update.usage }) - 1;
    }
    case "plan": {
      const index = items.findIndex((item) => item.type === "plan");
      const existing = items[index];
      if (existing?.type === "plan") {
        items[index] = { ...existing, entries: update.entries };
        return index;
      } else {
        return items.push({ type: "plan", entries: update.entries }) - 1;
      }
    }
    case "available_commands_update":
    case "config_option_update":
    case "current_mode_update":
      return;
    default:
      return;
  }
}
function appendChunk(items, role, text) {
  if (text === "") {
    return;
  }
  const last = items.at(-1);
  if (last?.type === "message" && last.role === role) {
    const index = items.length - 1;
    items[index] = { ...last, text: last.text + text };
    return index;
  }
  return items.push({ type: "message", role, text }) - 1;
}
function isQuestionRequest(params) {
  return params.toolCall.toolCallId.startsWith("ask-") || isRecord2(params.toolCall.rawInput) && typeof params.toolCall.rawInput.question === "string";
}
function contentText(content) {
  if (content.type === "text") {
    return content.text;
  }
  return content.type === "image" ? "[image]" : content.resource.text ?? "";
}
function isRecord2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// src/attachments.ts
var MAX_ATTACHMENTS = 5;
var MAX_ATTACHMENT_TEXT_BYTES = 4e4;
var MAX_ATTACHMENT_IMAGE_BYTES = 2e6;
var IMAGE_MIME_BY_EXT = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp"
};
function mimeFromFileName(name) {
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".") + 1).toLowerCase() : "";
  return IMAGE_MIME_BY_EXT[ext] ?? "text/plain";
}
function isImageMime(mimeType) {
  return typeof mimeType === "string" && mimeType.startsWith("image/");
}
function isPendingAttachment(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const candidate = value;
  const kindOk = candidate.kind === "file" || candidate.kind === "image" || candidate.kind === "session";
  if (!kindOk || typeof candidate.name !== "string" || candidate.name.length === 0) {
    return false;
  }
  if (candidate.kind === "session") {
    return typeof candidate.sessionId === "string" && candidate.sessionId.length > 0;
  }
  return typeof candidate.uri === "string" && candidate.uri.length > 0;
}
function toBase64(bytes) {
  let binary = "";
  const chunkSize = 32768;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}
async function attachmentToBlock(attachment, readFile2) {
  if (attachment.kind === "session") {
    return {
      type: "resource",
      resource: {
        uri: `session://${attachment.sessionId}`,
        mimeType: "text/plain",
        text: `Referenced session: ${attachment.name} (session ${attachment.sessionId})`
      }
    };
  }
  const uri = attachment.uri ?? "";
  const mimeType = attachment.mimeType ?? mimeFromFileName(attachment.name);
  const bytes = await readFile2(uri);
  if (attachment.kind === "image" || isImageMime(mimeType)) {
    if (bytes.length > MAX_ATTACHMENT_IMAGE_BYTES) {
      throw new Error(`Image too large: ${attachment.name} (${bytes.length} bytes)`);
    }
    return { type: "image", data: toBase64(bytes), mimeType };
  }
  const truncated = bytes.length > MAX_ATTACHMENT_TEXT_BYTES;
  const slice = truncated ? bytes.subarray(0, MAX_ATTACHMENT_TEXT_BYTES) : bytes;
  const text = new TextDecoder("utf-8", { fatal: false }).decode(slice);
  return {
    type: "resource",
    resource: {
      uri,
      mimeType: "text/plain",
      text: `File: ${attachment.name}${truncated ? " (truncated)" : ""}
${text}`
    }
  };
}

// src/editorContext.ts
var path2 = __toESM(require("node:path"));
var vscode = __toESM(require("vscode"));
var cursorWindowRadius = 40;
function configuredSelectionMode() {
  const value = vscode.workspace.getConfiguration("reasonix").get("includeSelectionMode", "selectionOnly");
  return value === "off" || value === "nearby" || value === "selectionOnly" ? value : "selectionOnly";
}
function buildEditorContextBlock(mode = configuredSelectionMode()) {
  if (mode === "off") {
    return void 0;
  }
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.isUntitled) {
    return void 0;
  }
  const document = editor.document;
  const selection = editor.selection;
  const hasSelection = !selection.isEmpty;
  if (mode === "selectionOnly" && !hasSelection) {
    return void 0;
  }
  const range = hasSelection ? selection : cursorWindow(document, selection.active.line);
  const text = document.getText(range);
  if (text.trim() === "") {
    return void 0;
  }
  const folder = vscode.workspace.getWorkspaceFolder(document.uri);
  const filePath = folder ? path2.relative(folder.uri.fsPath, document.uri.fsPath).replace(/\\/g, "/") : document.uri.fsPath;
  const summary = `${filePath} lines ${range.start.line + 1}-${range.end.line + 1}`;
  const label = hasSelection ? "Selection" : "Cursor window";
  return {
    summary,
    block: {
      type: "resource",
      resource: {
        uri: document.uri.with({ fragment: `L${range.start.line + 1}-L${range.end.line + 1}` }).toString(),
        mimeType: "text/plain",
        text: `VS Code ${label.toLowerCase()}: ${summary}
Language: ${document.languageId}
${text}`
      }
    }
  };
}
function cursorWindow(doc, line) {
  const start = Math.max(0, line - cursorWindowRadius);
  const end = Math.min(doc.lineCount - 1, line + cursorWindowRadius);
  return new vscode.Range(start, 0, end, doc.lineAt(end).text.length);
}

// src/fileBridge.ts
var fs = __toESM(require("node:fs/promises"));
var path3 = __toESM(require("node:path"));
var vscode2 = __toESM(require("vscode"));
var WorkspaceFileBridge = class {
  constructor(folder, log) {
    this.folder = folder;
    this.log = log;
  }
  folder;
  log;
  async readTextFile(params) {
    this.requireTrustedWorkspace("read files");
    const uri = await this.resolveExisting(params.path);
    const open = await this.openDocument(uri);
    const document = open ?? await vscode2.workspace.openTextDocument(uri);
    const content = pageLines(document.getText(), params.line, params.limit);
    this.log(`ACP read ${this.relativeLabel(uri)}`);
    return { content };
  }
  async writeTextFile(params) {
    this.requireTrustedWorkspace("write files");
    const uri = await this.resolveForWrite(params.path);
    const open = await this.openDocument(uri);
    if (open) {
      const version = open.version;
      const edit = new vscode2.WorkspaceEdit();
      edit.replace(uri, fullDocumentRange(open), params.content);
      if (open.version !== version) {
        throw new Error(`Refusing ACP write because ${this.relativeLabel(uri)} changed concurrently`);
      }
      const applied = await vscode2.workspace.applyEdit(edit);
      if (!applied) {
        throw new Error(`VS Code rejected the ACP write to ${this.relativeLabel(uri)}`);
      }
      if (open.version !== version + 1) {
        throw new Error(`Refusing to save ${this.relativeLabel(uri)} because it changed during the ACP write`);
      }
      if (!await open.save()) {
        throw new Error(`VS Code could not save the ACP write to ${this.relativeLabel(uri)}`);
      }
    } else {
      await vscode2.workspace.fs.writeFile(uri, Buffer.from(params.content, "utf8"));
    }
    this.log(`ACP wrote ${this.relativeLabel(uri)}`);
    return {};
  }
  requireTrustedWorkspace(action) {
    if (!vscode2.workspace.isTrusted) {
      throw new Error(`Workspace trust is required for Reasonix to ${action}`);
    }
  }
  async resolveExisting(requestedPath) {
    const candidate = this.resolveLexical(requestedPath);
    let real;
    try {
      real = await fs.realpath(candidate);
    } catch {
      throw new Error(`File does not exist: ${this.relativeLabel(vscode2.Uri.file(candidate))}`);
    }
    await this.assertRealPathInside(real);
    return vscode2.Uri.file(real);
  }
  async resolveForWrite(requestedPath) {
    const candidate = this.resolveLexical(requestedPath);
    try {
      const real = await fs.realpath(candidate);
      await this.assertRealPathInside(real);
      return vscode2.Uri.file(real);
    } catch (err) {
      if (!isMissingPathError(err)) {
        throw err;
      }
    }
    const parent = path3.dirname(candidate);
    let realParent;
    try {
      realParent = await fs.realpath(parent);
    } catch {
      throw new Error(`Parent directory does not exist: ${this.relativeLabel(vscode2.Uri.file(parent))}`);
    }
    await this.assertRealPathInside(realParent);
    return vscode2.Uri.file(path3.join(realParent, path3.basename(candidate)));
  }
  resolveLexical(requestedPath) {
    if (requestedPath.includes("\0")) {
      throw new Error("ACP file path contains a null byte");
    }
    const root = path3.resolve(this.folder.uri.fsPath);
    const candidate = path3.resolve(root, requestedPath);
    if (!isInside(candidate, root)) {
      throw new Error("Reasonix file access is limited to the active workspace folder");
    }
    return candidate;
  }
  async assertRealPathInside(candidate) {
    const root = await fs.realpath(this.folder.uri.fsPath);
    if (!isInside(candidate, root)) {
      throw new Error("Reasonix file access cannot follow a symlink outside the workspace");
    }
  }
  async openDocument(uri) {
    const target = normalizePath(uri.fsPath);
    for (const document of vscode2.workspace.textDocuments) {
      if (document.uri.scheme !== "file") {
        continue;
      }
      if (normalizePath(document.uri.fsPath) === target) {
        return document;
      }
      try {
        if (normalizePath(await fs.realpath(document.uri.fsPath)) === target) {
          return document;
        }
      } catch {
      }
    }
    return void 0;
  }
  relativeLabel(uri) {
    return path3.relative(this.folder.uri.fsPath, uri.fsPath).replace(/\\/g, "/") || ".";
  }
};
function pageLines(content, line, limit) {
  if (line === void 0 && limit === void 0) {
    return content;
  }
  const lines = content.split(/\r?\n/);
  const start = Math.max(0, (line ?? 1) - 1);
  return lines.slice(start, limit === void 0 ? void 0 : start + limit).join("\n");
}
function fullDocumentRange(document) {
  const lastLine = Math.max(0, document.lineCount - 1);
  return new vscode2.Range(new vscode2.Position(0, 0), document.lineAt(lastLine).rangeIncludingLineBreak.end);
}
function isInside(candidate, root) {
  const relative8 = path3.relative(normalizePath(root), normalizePath(candidate));
  return relative8 === "" || !relative8.startsWith("..") && !path3.isAbsolute(relative8);
}
function normalizePath(value) {
  const resolved = path3.resolve(value);
  return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}
function isMissingPathError(err) {
  return typeof err === "object" && err !== null && "code" in err && err.code === "ENOENT";
}

// src/preview.ts
var path4 = __toESM(require("node:path"));
var vscode3 = __toESM(require("vscode"));
var DiffPreviewProvider = class {
  docs = /* @__PURE__ */ new Map();
  docOrder = [];
  maxDocs = 200;
  emitter = new vscode3.EventEmitter();
  onDidChange = this.emitter.event;
  register(context) {
    context.subscriptions.push(
      this.emitter,
      vscode3.workspace.registerTextDocumentContentProvider("reasonix-preview", this)
    );
  }
  provideTextDocumentContent(uri) {
    return this.docs.get(uri.toString()) ?? "";
  }
  async previewPermission(params, workspaceFolder) {
    if (params.toolCall.preview && params.toolCall.preview.binary !== true) {
      await this.previewChange(params.toolCall.preview, workspaceFolder);
      return;
    }
    const raw = params.toolCall.rawInput;
    if (!isRecord3(raw)) {
      return;
    }
    const input = raw;
    if (typeof input.path !== "string" || input.path.trim() === "") {
      return;
    }
    const tool = toolName(params.toolCall.title);
    const target = resolveTarget(input.path, workspaceFolder);
    const oldText = await readText(target);
    const nextText = applyPreview(tool, oldText, input);
    if (nextText === void 0 || nextText === oldText) {
      return;
    }
    await this.openPreview(target, oldText, nextText, workspaceFolder);
  }
  async previewChange(preview, workspaceFolder) {
    if (preview.binary === true) {
      return;
    }
    const target = resolveTarget(preview.path, workspaceFolder);
    await this.openPreview(target, preview.oldText ?? "", preview.newText ?? "", workspaceFolder);
  }
  async openPreview(target, oldText, nextText, workspaceFolder) {
    const title = `Reasonix Preview: ${workspaceFolder ? path4.relative(workspaceFolder.uri.fsPath, target.fsPath) : target.fsPath}`;
    const oldUri = oldText === "" ? this.putVirtual("old", target, oldText) : target;
    const newUri = this.putVirtual("new", target, nextText);
    await vscode3.commands.executeCommand("vscode.diff", oldUri, newUri, title, { preview: true });
  }
  putVirtual(kind, target, content) {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const uri = vscode3.Uri.from({
      scheme: "reasonix-preview",
      authority: kind,
      path: `/${id}/${path4.basename(target.fsPath)}`
    });
    const key = uri.toString();
    this.docs.set(key, content);
    this.docOrder.push(key);
    if (this.docOrder.length > this.maxDocs) {
      const oldest = this.docOrder.shift();
      if (oldest) {
        this.docs.delete(oldest);
      }
    }
    this.emitter.fire(uri);
    return uri;
  }
};
function toolName(title) {
  return (title ?? "").split(/\s+/, 1)[0] ?? "";
}
function resolveTarget(inputPath, workspaceFolder) {
  if (path4.isAbsolute(inputPath)) {
    return vscode3.Uri.file(inputPath);
  }
  const root = workspaceFolder?.uri.fsPath ?? vscode3.workspace.workspaceFolders?.[0]?.uri.fsPath ?? process.cwd();
  return vscode3.Uri.file(path4.join(root, inputPath));
}
async function readText(uri) {
  try {
    const bytes = await vscode3.workspace.fs.readFile(uri);
    return Buffer.from(bytes).toString("utf8");
  } catch {
    return "";
  }
}
function applyPreview(tool, oldText, input) {
  switch (tool) {
    case "write_file":
      return typeof input.content === "string" ? input.content : void 0;
    case "edit_file":
      if (typeof input.old_string !== "string" || typeof input.new_string !== "string") {
        return void 0;
      }
      return replaceOnce(oldText, input.old_string, input.new_string);
    case "multi_edit": {
      if (!Array.isArray(input.edits)) {
        return void 0;
      }
      let text = oldText;
      for (const edit of input.edits) {
        if (typeof edit.old_string !== "string" || typeof edit.new_string !== "string") {
          return void 0;
        }
        const next = edit.replace_all ? replaceAll2(text, edit.old_string, edit.new_string) : replaceOnce(text, edit.old_string, edit.new_string);
        if (next === void 0) {
          return void 0;
        }
        text = next;
      }
      return text;
    }
    default:
      return void 0;
  }
}
function replaceOnce(text, oldString, newString) {
  if (oldString === "") {
    return void 0;
  }
  const first = text.indexOf(oldString);
  if (first < 0 || text.indexOf(oldString, first + oldString.length) >= 0) {
    return void 0;
  }
  return text.slice(0, first) + newString + text.slice(first + oldString.length);
}
function replaceAll2(text, oldString, newString) {
  if (oldString === "" || !text.includes(oldString)) {
    return void 0;
  }
  return text.split(oldString).join(newString);
}
function isRecord3(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// src/resourceMentions.ts
var fs2 = __toESM(require("node:fs/promises"));
var path5 = __toESM(require("node:path"));
var import_node_url = require("node:url");
var maxMentions = 5;
var maxFileBytes = 4e4;
var maxTotalBytes = 12e4;
var maxDirectoryEntries = 80;
var maxTokenLength = 240;
async function buildPromptBlocks(prompt, workspacePath) {
  const mentions = await resolveFileMentions(prompt, workspacePath);
  const resources = mentions.map((mention) => ({
    type: "resource",
    resource: {
      uri: (0, import_node_url.pathToFileURL)(path5.resolve(workspacePath, mention.relativePath)).toString(),
      mimeType: "text/plain",
      text: mention.kind === "file" ? `File: ${mention.relativePath}${mention.truncated ? " (truncated)" : ""}
${mention.text}` : `Directory: ${mention.relativePath}${mention.truncated ? " (truncated)" : ""}
${mention.text}`
    }
  }));
  return { blocks: [{ type: "text", text: prompt }, ...resources], mentions };
}
async function resolveFileMentions(prompt, workspacePath) {
  const seen = /* @__PURE__ */ new Set();
  const mentions = [];
  let remainingBytes = maxTotalBytes;
  for (const token of extractMentionTokens(prompt)) {
    if (mentions.length >= maxMentions) {
      break;
    }
    const relativePath = normalizeMentionPath(token);
    if (!relativePath || seen.has(relativePath)) {
      continue;
    }
    seen.add(relativePath);
    const absolutePath = path5.resolve(workspacePath, relativePath);
    if (!isInsideWorkspace(absolutePath, workspacePath)) {
      continue;
    }
    try {
      const realPath = await fs2.realpath(absolutePath);
      if (!isInsideWorkspace(realPath, await fs2.realpath(workspacePath))) {
        continue;
      }
      const stat2 = await fs2.stat(realPath);
      if (stat2.isFile()) {
        const buffer = await fs2.readFile(realPath);
        const allowed = Math.max(0, Math.min(maxFileBytes, remainingBytes));
        if (allowed === 0) {
          break;
        }
        const truncated = buffer.byteLength > allowed;
        const visible = buffer.subarray(0, allowed);
        mentions.push({
          token,
          kind: "file",
          relativePath,
          text: visible.toString("utf8"),
          truncated
        });
        remainingBytes -= visible.byteLength;
      } else if (stat2.isDirectory()) {
        const entries = await fs2.readdir(realPath, { withFileTypes: true });
        const sorted = entries.filter((entry) => entry.name !== ".DS_Store").sort((a, b) => a.name.localeCompare(b.name));
        const visible = sorted.slice(0, maxDirectoryEntries);
        const truncated = sorted.length > visible.length;
        const text = visible.map((entry) => directoryEntryLine(entry)).join("\n");
        const buffer = Buffer.from(text, "utf8");
        const allowed = Math.max(0, remainingBytes);
        if (allowed === 0) {
          break;
        }
        const visibleBuffer = buffer.subarray(0, allowed);
        mentions.push({
          token,
          kind: "directory",
          relativePath,
          text: visibleBuffer.toString("utf8"),
          truncated: truncated || buffer.byteLength > allowed
        });
        remainingBytes -= visibleBuffer.byteLength;
      }
    } catch {
    }
  }
  return mentions;
}
function extractMentionTokens(prompt) {
  const tokens = [];
  const pattern = /(^|[\s([{])@([^\s)\]}>,;:"']+)/g;
  let match;
  while ((match = pattern.exec(prompt)) !== null) {
    const token = stripTrailingPunctuation(match[2] ?? "");
    if (token.length > 0 && token.length <= maxTokenLength) {
      tokens.push(token);
    }
  }
  return tokens;
}
function normalizeMentionPath(token) {
  let decoded;
  try {
    decoded = decodeURIComponent(token);
  } catch {
    return void 0;
  }
  if (decoded.includes("\0") || path5.isAbsolute(decoded)) {
    return void 0;
  }
  const normalized = path5.normalize(decoded).replace(/\\/g, "/");
  const canonical = normalized.replace(/\/+$/g, "");
  if (canonical === ".") {
    return "";
  }
  if (canonical.startsWith("../") || canonical === "..") {
    return void 0;
  }
  if (!looksLikePath(decoded) && !looksLikePath(canonical)) {
    return void 0;
  }
  return canonical.startsWith("./") ? canonical.slice(2) : canonical;
}
function looksLikePath(value) {
  return value.includes("/") || value.includes(".") || value.startsWith("./");
}
function isInsideWorkspace(absolutePath, workspacePath) {
  const relative8 = path5.relative(path5.resolve(workspacePath), absolutePath);
  return relative8 === "" || !relative8.startsWith("..") && !path5.isAbsolute(relative8);
}
function stripTrailingPunctuation(value) {
  return value.replace(/[.,!?]+$/g, "");
}
function directoryEntryLine(entry) {
  if (entry.isDirectory()) {
    return `${entry.name}/`;
  }
  if (entry.isSymbolicLink()) {
    return `${entry.name}@`;
  }
  return entry.name;
}

// src/resourceSuggestions.ts
var fs3 = __toESM(require("node:fs/promises"));
var path6 = __toESM(require("node:path"));
var maxQueryLength = 240;
var maxVisitedEntries = 2500;
var maxScanDepth = 6;
var ignoredDirectoryNames = /* @__PURE__ */ new Set([".git", ".reasonix", ".codegraph", "node_modules", "dist", "out"]);
async function suggestWorkspaceResources(query, workspacePath, limit = 8) {
  const root = path6.resolve(workspacePath);
  const normalizedQuery = normalizeSuggestionQuery(query);
  if (normalizedQuery.endsWith("/")) {
    return listDirectoryChildren(root, normalizedQuery, limit);
  }
  const scanned = normalizedQuery === "" ? await readDirectory(root, root, "") : await scanWorkspace(root);
  const ranked = scanned.map((resource) => ({ resource, rank: resourceRank(resource, normalizedQuery) })).filter((entry) => entry.rank < Number.POSITIVE_INFINITY).sort((a, b) => a.rank - b.rank || kindRank(a.resource.kind) - kindRank(b.resource.kind) || a.resource.relativePath.localeCompare(b.resource.relativePath)).slice(0, limit).map((entry) => toSuggestion(entry.resource));
  return ranked;
}
function normalizeSuggestionQuery(value) {
  const normalized = value.slice(0, maxQueryLength).replace(/\\/g, "/").replace(/^@/, "").replace(/^\/+/g, "").replace(/^\.\//, "");
  return normalized.includes("\0") ? "" : normalized;
}
async function listDirectoryChildren(root, query, limit) {
  const directoryPath = path6.resolve(root, query);
  if (!isInsideWorkspace2(directoryPath, root)) {
    return [];
  }
  const relativeDirectory = path6.relative(root, directoryPath).replace(/\\/g, "/");
  const resources = await readDirectory(root, directoryPath, relativeDirectory === "" ? "" : relativeDirectory);
  return resources.sort((a, b) => kindRank(a.kind) - kindRank(b.kind) || a.relativePath.localeCompare(b.relativePath)).slice(0, limit).map((resource) => toSuggestion(resource));
}
async function scanWorkspace(root) {
  const resources = [];
  const queue = [{ directory: root, depth: 0 }];
  let visited = 0;
  while (queue.length > 0 && visited < maxVisitedEntries) {
    const current = queue.shift();
    if (!current || current.depth > maxScanDepth) {
      continue;
    }
    let entries;
    try {
      entries = await fs3.readdir(current.directory, { withFileTypes: true });
    } catch {
      continue;
    }
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      visited += 1;
      if (visited > maxVisitedEntries || entry.name === ".DS_Store") {
        continue;
      }
      const absolutePath = path6.join(current.directory, entry.name);
      const relativePath = path6.relative(root, absolutePath).replace(/\\/g, "/");
      if (!relativePath || !isInsideWorkspace2(absolutePath, root)) {
        continue;
      }
      if (entry.isDirectory()) {
        resources.push({ kind: "directory", relativePath });
        if (!ignoredDirectoryNames.has(entry.name)) {
          queue.push({ directory: absolutePath, depth: current.depth + 1 });
        }
      } else if (entry.isFile()) {
        resources.push({ kind: "file", relativePath });
      }
    }
  }
  return resources;
}
async function readDirectory(root, directory, relativeDirectory) {
  let entries;
  try {
    entries = await fs3.readdir(directory, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries.filter((entry) => entry.name !== ".DS_Store" && !(relativeDirectory === "" && entry.isDirectory() && ignoredDirectoryNames.has(entry.name))).map((entry) => {
    const absolutePath = path6.join(directory, entry.name);
    if (!isInsideWorkspace2(absolutePath, root)) {
      return void 0;
    }
    const relativePath = path6.posix.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) {
      return { kind: "directory", relativePath };
    }
    if (entry.isFile()) {
      return { kind: "file", relativePath };
    }
    return void 0;
  }).filter((entry) => entry !== void 0);
}
function resourceRank(resource, query) {
  if (query === "") {
    return kindRank(resource.kind);
  }
  const pathText = resource.relativePath.toLowerCase();
  const queryText = query.toLowerCase();
  const baseName = path6.posix.basename(pathText);
  const queryBaseName = path6.posix.basename(queryText);
  if (pathText === queryText) {
    return 0;
  }
  if (pathText.startsWith(queryText)) {
    return 1;
  }
  if (baseName.startsWith(queryBaseName)) {
    return 2;
  }
  if (pathText.includes(queryText)) {
    return 3;
  }
  return Number.POSITIVE_INFINITY;
}
function toSuggestion(resource) {
  const insertText = resource.kind === "directory" ? `${resource.relativePath}/` : resource.relativePath;
  return {
    kind: resource.kind,
    relativePath: resource.relativePath,
    insertText,
    label: path6.posix.basename(resource.relativePath) || resource.relativePath,
    detail: insertText
  };
}
function kindRank(kind) {
  return kind === "directory" ? 0 : 1;
}
function isInsideWorkspace2(absolutePath, workspacePath) {
  const relative8 = path6.relative(path6.resolve(workspacePath), absolutePath);
  return relative8 === "" || !relative8.startsWith("..") && !path6.isAbsolute(relative8);
}

// src/slashCommands.ts
var commands2 = [
  {
    names: ["help", "?"],
    description: "Show the built-in Reasonix slash commands.",
    build: () => [
      "List the built-in Reasonix VS Code slash commands and when to use them.",
      "",
      "Commands: /explain, /fix, /tests, /search, /mcp, /skills."
    ].join("\n")
  },
  {
    names: ["explain"],
    description: "Explain referenced code, files, or workspace areas.",
    build: (args) => withRequest(
      "Explain the referenced code, file, or workspace area. Focus on purpose, important flows, and risky edges.",
      args
    )
  },
  {
    names: ["fix"],
    description: "Fix a referenced issue or code area.",
    build: (args) => withRequest(
      "Fix the referenced issue or code. Keep the change focused, preserve existing behavior, and explain what changed.",
      args
    )
  },
  {
    names: ["tests", "test"],
    description: "Run, identify, or diagnose relevant tests.",
    build: (args) => withRequest(
      "Run or identify the relevant tests for this workspace. If failures appear, diagnose the likely cause and propose the smallest fix.",
      args
    )
  },
  {
    names: ["search"],
    description: "Search the repository and summarize key files.",
    build: (args) => withRequest(
      "Search the repository for the referenced implementation, summarize what you find, and point to the key files.",
      args
    )
  },
  {
    names: ["mcp"],
    description: "Inspect connected MCP context and use relevant tools.",
    build: (args) => withRequest(
      "Inspect the connected MCP context and use MCP tools only when they are relevant to the request. Summarize which MCP server or tool was useful.",
      args
    )
  },
  {
    names: ["skills", "skill"],
    description: "Use the appropriate available Reasonix/Codex skills.",
    build: (args) => withRequest(
      "Use the appropriate Reasonix/Codex skills for this request if they are available. State which skill is relevant and what it contributes.",
      args
    )
  }
];
function expandSlashCommand(input) {
  const trimmedStart = input.trimStart();
  if (!trimmedStart.startsWith("/")) {
    return { prompt: input };
  }
  const match = /^\/([A-Za-z0-9_-]+|\?)(?:\s+([\s\S]*))?$/.exec(trimmedStart);
  if (!match) {
    return { prompt: input };
  }
  const name = (match[1] ?? "").toLowerCase();
  const args = (match[2] ?? "").trim();
  const command = commands2.find((candidate) => candidate.names.includes(name));
  if (!command) {
    return { prompt: input };
  }
  return { prompt: command.build(args), command: name };
}
function withRequest(instruction, args) {
  if (args === "") {
    return instruction;
  }
  return `${instruction}

User request:
${args}`;
}

// src/snapshotSync.ts
var SnapshotSync = class {
  revision = 0;
  sentTranscriptLength = 0;
  dirtyTranscriptStart;
  fullSnapshotRequired = true;
  reset() {
    this.revision = 0;
    this.sentTranscriptLength = 0;
    this.dirtyTranscriptStart = void 0;
    this.fullSnapshotRequired = true;
  }
  requireFullSnapshot() {
    this.fullSnapshotRequired = true;
  }
  markTranscriptChanged(start) {
    if (start === void 0 || !Number.isInteger(start) || start < 0) {
      return;
    }
    this.dirtyTranscriptStart = this.dirtyTranscriptStart === void 0 ? start : Math.min(this.dirtyTranscriptStart, start);
  }
  next(state, items) {
    this.revision += 1;
    if (this.fullSnapshotRequired) {
      this.fullSnapshotRequired = false;
      this.dirtyTranscriptStart = void 0;
      this.sentTranscriptLength = items.length;
      return {
        type: "stateSnapshot",
        revision: this.revision,
        state: { ...state, items: items.slice() }
      };
    }
    let start = this.dirtyTranscriptStart;
    if (start === void 0 && items.length !== this.sentTranscriptLength) {
      start = Math.min(items.length, this.sentTranscriptLength);
    }
    const message = {
      type: "statePatch",
      revision: this.revision,
      state
    };
    if (start !== void 0) {
      const safeStart = Math.min(start, items.length, this.sentTranscriptLength);
      message.transcript = {
        start: safeStart,
        deleteCount: this.sentTranscriptLength - safeStart,
        items: items.slice(safeStart)
      };
    }
    this.dirtyTranscriptStart = void 0;
    this.sentTranscriptLength = items.length;
    return message;
  }
};

// src/terminalBridge.ts
var import_node_child_process = require("node:child_process");
var fs4 = __toESM(require("node:fs/promises"));
var path7 = __toESM(require("node:path"));
var vscode4 = __toESM(require("vscode"));
var WorkspaceTerminalBridge = class {
  constructor(folder, log) {
    this.folder = folder;
    this.log = log;
  }
  folder;
  log;
  terminals = /* @__PURE__ */ new Map();
  nextId = 1;
  async create(params) {
    if (!vscode4.workspace.isTrusted) {
      throw new Error("Workspace trust is required for Reasonix terminal commands");
    }
    const cwd = await this.resolveCwd(params.cwd);
    const args = params.args ?? [];
    const child = (0, import_node_child_process.spawn)(params.command, args, {
      cwd,
      env: process.env,
      shell: args.length === 0,
      stdio: ["pipe", "pipe", "pipe"]
    });
    const terminalId = `reasonix-${Date.now().toString(36)}-${this.nextId++}`;
    const pty = new ReasonixPseudoterminal((data) => child.stdin.write(data), () => {
      if (!child.killed) {
        child.kill();
      }
    });
    const terminal = vscode4.window.createTerminal({ name: `Reasonix: ${commandLabel(params.command)}`, pty });
    let resolveExit;
    const exited = new Promise((resolve6) => {
      resolveExit = resolve6;
    });
    const record = {
      child,
      terminal,
      pty,
      chunks: [],
      bytes: 0,
      byteLimit: Math.min(Math.max(params.outputByteLimit ?? 1 << 20, 4096), 4 << 20),
      truncated: false,
      exited,
      resolveExit
    };
    this.terminals.set(terminalId, record);
    const capture = (chunk) => {
      pty.write(chunk.toString("utf8"));
      record.chunks.push(chunk);
      record.bytes += chunk.byteLength;
      trimOutput(record);
    };
    child.stdout.on("data", capture);
    child.stderr.on("data", capture);
    child.on("error", (err) => capture(Buffer.from(`
${err.message}
`, "utf8")));
    child.on("close", (code, signal) => {
      const status = signal ? { signal } : { exitCode: code ?? -1 };
      record.exitStatus = status;
      resolveExit(status);
      pty.finish(code ?? 1);
    });
    terminal.show(true);
    this.log(`ACP terminal started: ${commandLabel(params.command)}`);
    return { terminalId };
  }
  output(params) {
    const record = this.requireTerminal(params.terminalId);
    return {
      output: Buffer.concat(record.chunks).toString("utf8"),
      truncated: record.truncated,
      ...record.exitStatus ? { exitStatus: record.exitStatus } : {}
    };
  }
  async waitForExit(params) {
    return await this.requireTerminal(params.terminalId).exited;
  }
  kill(params) {
    const record = this.requireTerminal(params.terminalId);
    if (!record.child.killed && record.exitStatus === void 0) {
      record.child.kill();
    }
    return {};
  }
  release(params) {
    const record = this.requireTerminal(params.terminalId);
    if (!record.child.killed && record.exitStatus === void 0) {
      record.child.kill();
    }
    record.terminal.dispose();
    this.terminals.delete(params.terminalId);
    return {};
  }
  dispose() {
    for (const id of [...this.terminals.keys()]) {
      this.release({ sessionId: "", terminalId: id });
    }
  }
  requireTerminal(id) {
    const record = this.terminals.get(id);
    if (!record) {
      throw new Error(`Unknown Reasonix terminal: ${id}`);
    }
    return record;
  }
  async resolveCwd(requested) {
    const root = path7.resolve(this.folder.uri.fsPath);
    const cwd = path7.resolve(root, requested || ".");
    const relative8 = path7.relative(root, cwd);
    if (relative8.startsWith("..") || path7.isAbsolute(relative8)) {
      throw new Error("Reasonix terminal cwd is limited to the active workspace folder");
    }
    const [realRoot, realCwd] = await Promise.all([fs4.realpath(root), fs4.realpath(cwd)]);
    const realRelative = path7.relative(realRoot, realCwd);
    if (realRelative.startsWith("..") || path7.isAbsolute(realRelative)) {
      throw new Error("Reasonix terminal cwd cannot follow a symlink outside the workspace");
    }
    return realCwd;
  }
};
var ReasonixPseudoterminal = class {
  constructor(input, closeHandler) {
    this.input = input;
    this.closeHandler = closeHandler;
  }
  input;
  closeHandler;
  writeEmitter = new vscode4.EventEmitter();
  closeEmitter = new vscode4.EventEmitter();
  onDidWrite = this.writeEmitter.event;
  onDidClose = this.closeEmitter.event;
  open() {
  }
  close() {
    this.closeHandler();
  }
  handleInput(data) {
    this.input(data);
  }
  write(data) {
    this.writeEmitter.fire(data.replace(/(?<!\r)\n/g, "\r\n"));
  }
  finish(code) {
    this.closeEmitter.fire(code);
  }
};
function trimOutput(record) {
  while (record.bytes > record.byteLimit && record.chunks.length > 0) {
    const first = record.chunks[0];
    if (!first) {
      break;
    }
    const excess = record.bytes - record.byteLimit;
    if (first.byteLength <= excess) {
      record.chunks.shift();
      record.bytes -= first.byteLength;
    } else {
      record.chunks[0] = first.subarray(excess);
      record.bytes -= excess;
    }
    record.truncated = true;
  }
}
function commandLabel(command) {
  const compact = command.trim().replace(/\s+/g, " ");
  return compact.length > 44 ? `${compact.slice(0, 41)}...` : compact;
}

// src/webviewProtocol.ts
function parseWebviewMessage(value) {
  if (!isRecord4(value) || typeof value.command !== "string") {
    return void 0;
  }
  switch (value.command) {
    case "sendPrompt": {
      if (typeof value.text !== "string") {
        return void 0;
      }
      const attachments = parseAttachments(value.attachments);
      if (attachments === void 0 && value.attachments !== void 0) {
        return void 0;
      }
      const message = withPromptModes({
        command: "sendPrompt",
        text: value.text
      }, value);
      if (attachments !== void 0) {
        message.attachments = attachments;
      }
      return message;
    }
    case "cancel":
    case "connect":
    case "newSession":
    case "pickAttachment":
    case "pickModel":
    case "pickEffort":
    case "pickUiLanguage":
    case "selectBinary":
    case "openNativeSettings":
    case "showOutput":
    case "stateSnapshot":
      return { command: value.command };
    case "setContextMode":
      return value.mode === "off" || value.mode === "selectionOnly" || value.mode === "nearby" ? { command: "setContextMode", mode: value.mode } : void 0;
    case "setModel":
      return isRuntimeOptionValue(value.value) ? { command: "setModel", value: value.value } : void 0;
    case "setEffort":
      return isRuntimeOptionValue(value.optionId) && isRuntimeOptionValue(value.value) ? { command: "setEffort", optionId: value.optionId, value: value.value } : void 0;
    case "setExecutionMode":
      return isCollaborationMode(value.value) ? { command: "setExecutionMode", value: value.value } : void 0;
    case "setWorkMode":
      return isRuntimeOptionValue(value.optionId) && isTokenMode(value.value) ? { command: "setWorkMode", optionId: value.optionId, value: value.value } : void 0;
    case "setToolApprovalMode":
      return isRuntimeOptionValue(value.optionId) && isToolApprovalMode(value.value) ? { command: "setToolApprovalMode", optionId: value.optionId, value: value.value } : void 0;
    case "updateSetting":
      return parseUpdateSetting(value);
    case "loadSession":
      return typeof value.sessionId === "string" && value.sessionId.trim() !== "" ? { command: "loadSession", sessionId: value.sessionId } : void 0;
    case "deleteSession":
      return typeof value.sessionId === "string" && value.sessionId.trim() !== "" ? { command: "deleteSession", sessionId: value.sessionId } : void 0;
    case "quickPrompt":
      return value.action === "explainFile" || value.action === "fixSelection" || value.action === "runTests" || value.action === "searchRepo" ? { command: "quickPrompt", action: value.action } : void 0;
    case "copyText":
      return typeof value.text === "string" ? { command: "copyText", text: value.text } : void 0;
    case "openExternal":
      return typeof value.href === "string" ? { command: "openExternal", href: value.href } : void 0;
    case "insertMessage":
    case "retryMessage":
    case "continueMessage":
    case "openToolPreview":
      return isValidIndex(value.index) ? { command: value.command, index: value.index } : void 0;
    case "openToolLocation":
      return isValidIndex(value.index) && isValidIndex(value.locationIndex) ? { command: "openToolLocation", index: value.index, locationIndex: value.locationIndex } : void 0;
    case "approvalDecision":
      return typeof value.id === "string" && typeof value.optionId === "string" ? { command: "approvalDecision", id: value.id, optionId: value.optionId } : void 0;
    case "resourceSuggestions":
      return isValidIndex(value.requestId) && typeof value.query === "string" && value.query.length <= 240 ? { command: "resourceSuggestions", requestId: value.requestId, query: value.query } : void 0;
    case "fileDrop":
      return parseFileDropUris(value.uris);
    case "insertApplied":
      return isValidIndex(value.id) ? { command: "insertApplied", id: value.id } : void 0;
    default:
      return void 0;
  }
}
var MAX_FILE_DROP_URIS = 5;
var MAX_DROP_URI_LENGTH = 4096;
function parseFileDropUris(value) {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_FILE_DROP_URIS) {
    return void 0;
  }
  const uris = value.filter(
    (item) => typeof item === "string" && (item.startsWith("file:") || item.startsWith("vscode-remote:")) && item.length <= MAX_DROP_URI_LENGTH
  );
  return uris.length === value.length ? { command: "fileDrop", uris } : void 0;
}
function isRuntimeOptionValue(value) {
  return typeof value === "string" && value.trim() !== "" && value.length <= 240;
}
function parseAttachments(value) {
  if (value === void 0) {
    return void 0;
  }
  if (!Array.isArray(value) || value.length > MAX_ATTACHMENTS) {
    return void 0;
  }
  return value.every(isPendingAttachment) ? value : void 0;
}
function withPromptModes(message, value) {
  if (isCollaborationMode(value.collaborationMode)) {
    message.collaborationMode = value.collaborationMode;
  }
  if (value.tokenMode === "standard") {
    message.tokenMode = "balanced";
  } else if (isTokenMode(value.tokenMode)) {
    message.tokenMode = value.tokenMode;
  }
  if (isToolApprovalMode(value.toolApprovalMode)) {
    message.toolApprovalMode = value.toolApprovalMode;
  }
  return message;
}
function parseUpdateSetting(value) {
  if (!isSettingKey(value.key)) {
    return void 0;
  }
  switch (value.key) {
    case "binaryPath":
    case "model":
      return typeof value.value === "string" ? { command: "updateSetting", key: value.key, value: value.value } : void 0;
    case "uiLanguage":
      return value.value === "auto" || value.value === "en" || value.value === "zh-CN" ? { command: "updateSetting", key: value.key, value: value.value } : void 0;
    case "includeSelectionMode":
      return value.value === "off" || value.value === "selectionOnly" || value.value === "nearby" ? { command: "updateSetting", key: value.key, value: value.value } : void 0;
    case "autoStart":
    case "trace":
      return typeof value.value === "boolean" ? { command: "updateSetting", key: value.key, value: value.value } : void 0;
  }
}
function isSettingKey(value) {
  return value === "binaryPath" || value === "model" || value === "uiLanguage" || value === "autoStart" || value === "trace" || value === "includeSelectionMode";
}
function isCollaborationMode(value) {
  return value === "normal" || value === "plan" || value === "goal";
}
function isTokenMode(value) {
  return value === "economy" || value === "balanced" || value === "delivery";
}
function isToolApprovalMode(value) {
  return value === "ask" || value === "auto" || value === "yolo";
}
function isRecord4(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isValidIndex(value) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

// src/extension.ts
var execFileAsync = (0, import_node_util.promisify)(import_node_child_process2.execFile);
var viewId = "reasonix.chat";
function activate(context) {
  const output = vscode5.window.createOutputChannel("Reasonix");
  const preview = new DiffPreviewProvider();
  preview.register(context);
  const statusBar = vscode5.window.createStatusBarItem(vscode5.StatusBarAlignment.Left, 100);
  statusBar.command = "reasonix.openChat";
  const provider = new ReasonixChatProvider(context, output, preview, statusBar);
  statusBar.show();
  context.subscriptions.push(
    provider,
    output,
    statusBar,
    vscode5.window.registerWebviewViewProvider(viewId, provider, { webviewOptions: { retainContextWhenHidden: true } }),
    vscode5.commands.registerCommand("reasonix.openChat", async () => {
      await vscode5.commands.executeCommand("workbench.view.extension.reasonix");
      await vscode5.commands.executeCommand("reasonix.chat.focus");
    }),
    vscode5.commands.registerCommand("reasonix.newSession", () => provider.newSession()),
    vscode5.commands.registerCommand("reasonix.sendSelection", () => provider.sendSelection()),
    vscode5.commands.registerCommand("reasonix.addToChat", (arg) => {
      void provider.addToChat(arg instanceof vscode5.Uri ? arg : arg?.uri);
    }),
    vscode5.commands.registerCommand("reasonix.cancelTurn", () => provider.cancelTurn()),
    vscode5.commands.registerCommand("reasonix.pickModel", () => provider.pickModel()),
    vscode5.commands.registerCommand("reasonix.pickEffort", () => provider.pickEffort()),
    vscode5.commands.registerCommand("reasonix.pickUiLanguage", () => provider.pickUiLanguage()),
    vscode5.commands.registerCommand("reasonix.selectBinary", () => selectReasonixBinary()),
    vscode5.commands.registerCommand("reasonix.openSettings", () => provider.openSettings()),
    vscode5.commands.registerCommand("reasonix.showOutput", () => output.show()),
    vscode5.window.onDidChangeActiveTextEditor(() => provider.refreshActiveWorkspace()),
    vscode5.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("reasonix.uiLanguage") || event.affectsConfiguration("reasonix.includeSelectionMode") || event.affectsConfiguration("reasonix.model") || event.affectsConfiguration("reasonix.binaryPath") || event.affectsConfiguration("reasonix.autoStart") || event.affectsConfiguration("reasonix.trace")) {
        provider.refreshActiveWorkspace();
      }
    })
  );
  if (process.env.REASONIX_TEST_COMMANDS === "1") {
    context.subscriptions.push(
      vscode5.commands.registerCommand("reasonix.test.sendPrompt", async (text, toolApprovalMode) => {
        await provider.testSendPrompt(
          typeof text === "string" ? text : "",
          toolApprovalMode === "auto" || toolApprovalMode === "yolo" ? toolApprovalMode : "ask"
        );
      }),
      vscode5.commands.registerCommand("reasonix.test.webviewMessage", async (message) => {
        await provider.testWebviewMessage(message);
      }),
      vscode5.commands.registerCommand("reasonix.test.snapshot", () => provider.testSnapshot())
    );
  }
  provider.refreshActiveWorkspace();
}
function deactivate() {
}
var ReasonixChatProvider = class {
  constructor(context, output, preview, statusBar) {
    this.context = context;
    this.output = output;
    this.preview = preview;
    this.statusBar = statusBar;
  }
  context;
  output;
  preview;
  statusBar;
  view;
  clients = /* @__PURE__ */ new Map();
  terminals = /* @__PURE__ */ new Map();
  states = /* @__PURE__ */ new Map();
  pendingApprovals = /* @__PURE__ */ new Map();
  sending = /* @__PURE__ */ new Set();
  reconnectAttempts = /* @__PURE__ */ new Map();
  reconnectTimers = /* @__PURE__ */ new Map();
  snapshotSync = new SnapshotSync();
  snapshotTimer;
  snapshotWorkspaceKey;
  pendingInsert;
  nextInsertId = 1;
  dispose() {
    for (const client of this.clients.values()) {
      client.dispose();
    }
    this.clients.clear();
    for (const terminal of this.terminals.values()) {
      terminal.dispose();
    }
    this.terminals.clear();
    for (const timer of this.reconnectTimers.values()) {
      clearTimeout(timer);
    }
    this.reconnectTimers.clear();
    if (this.snapshotTimer) {
      clearTimeout(this.snapshotTimer);
      this.snapshotTimer = void 0;
    }
  }
  resolveWebviewView(webviewView) {
    this.view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode5.Uri.joinPath(this.context.extensionUri, "media")]
    };
    webviewView.webview.html = this.html(webviewView.webview);
    webviewView.webview.onDidReceiveMessage((raw) => void this.handleWebviewMessage(raw), void 0, this.context.subscriptions);
    this.snapshotSync.reset();
    this.snapshotWorkspaceKey = void 0;
    webviewView.onDidDispose(() => {
      if (this.view === webviewView) {
        this.view = void 0;
        this.snapshotSync.reset();
        this.snapshotWorkspaceKey = void 0;
        if (this.snapshotTimer) {
          clearTimeout(this.snapshotTimer);
          this.snapshotTimer = void 0;
        }
      }
    }, void 0, this.context.subscriptions);
    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible) {
        this.snapshotSync.requireFullSnapshot();
        this.postSnapshot(void 0, true);
      } else {
        this.snapshotSync.requireFullSnapshot();
        if (this.snapshotTimer) {
          clearTimeout(this.snapshotTimer);
          this.snapshotTimer = void 0;
        }
      }
    }, void 0, this.context.subscriptions);
    this.postSnapshot(void 0, true);
    if (vscode5.workspace.getConfiguration("reasonix").get("autoStart", false)) {
      void this.ensureClient();
    }
  }
  refreshActiveWorkspace() {
    this.postSnapshot();
  }
  async newSession() {
    const folder = this.currentWorkspaceFolder();
    if (!folder) {
      void vscode5.window.showErrorMessage("Open a workspace folder before starting Reasonix.");
      return;
    }
    const key = workspaceKey(folder);
    const state = this.stateFor(folder);
    if (state.running) {
      void vscode5.window.showWarningMessage("Reasonix is running. Cancel the current turn before starting a new session.");
      return;
    }
    this.clearPendingApprovals(key);
    this.clearReconnectTimer(key);
    this.reconnectAttempts.delete(key);
    const current = this.clients.get(key);
    if (current?.connected) {
      try {
        await current.closeSession();
      } catch (err) {
        this.appendOutput(`Reasonix session close failed: ${errorMessage2(err)}`, folder);
      }
    }
    current?.dispose();
    this.clients.delete(key);
    this.disposeTerminalBridge(key);
    state.items = [];
    state.running = false;
    state.disconnected = true;
    state.status = "New session";
    state.sessionId = void 0;
    state.sessionTitle = void 0;
    state.usage = void 0;
    state.sessionModels = void 0;
    state.modes = void 0;
    state.configOptions = void 0;
    state.executionMode = void 0;
    state.workMode = void 0;
    state.toolApprovalMode = void 0;
    state.availableCommands = void 0;
    await this.context.workspaceState.update(this.sessionStorageKey(folder), void 0);
    this.postSnapshot(0);
    await this.ensureClient(folder);
  }
  async sendSelection() {
    await vscode5.commands.executeCommand("workbench.view.extension.reasonix");
    const ctx = buildEditorContextBlock("nearby");
    if (!ctx) {
      void vscode5.window.showInformationMessage("No editor context is available.");
      return;
    }
    await this.sendPrompt("Use the current VS Code editor context.", "nearby");
  }
  /**
   * Adds a file or directory (optionally with the current editor selection) to
   * the Reasonix composer as a workspace-relative @ mention, inserted at the
   * caret. Files outside the workspace are attached by content instead.
   */
  async addToChat(uri) {
    const resolved = uri ?? vscode5.window.activeTextEditor?.document.uri;
    if (!resolved || !isFileResourceUri(resolved)) {
      void vscode5.window.showInformationMessage("Add to Reasonix Chat works with workspace files and folders.");
      return;
    }
    let stat2;
    try {
      stat2 = await vscode5.workspace.fs.stat(resolved);
    } catch {
      void vscode5.window.showInformationMessage("Add to Reasonix Chat could not access the selected resource.");
      return;
    }
    const folder = vscode5.workspace.getWorkspaceFolder(resolved) ?? this.currentWorkspaceFolder();
    const relative8 = folder ? path8.relative(folder.uri.fsPath, resolved.fsPath).replace(/\\/g, "/") : void 0;
    const insideWorkspace = relative8 !== void 0 && (relative8 === "" || !relative8.startsWith("..") && !path8.isAbsolute(relative8));
    await vscode5.commands.executeCommand("workbench.view.extension.reasonix");
    if (stat2.type === vscode5.FileType.Directory) {
      if (!insideWorkspace) {
        void vscode5.window.showInformationMessage("Directories can only be referenced inside the workspace.");
        return;
      }
      this.queueInsert(`@${mentionTokenForPath(relative8, true)} `);
      return;
    }
    const editor = vscode5.window.activeTextEditor;
    const selection = editor && !editor.selection.isEmpty && editor.document.uri.fsPath === resolved.fsPath ? {
      text: editor.document.getText(editor.selection),
      startLine: editor.selection.start.line + 1,
      endLine: editor.selection.end.line + 1,
      languageId: editor.document.languageId
    } : void 0;
    if (!insideWorkspace) {
      const attachment = {
        kind: "file",
        name: path8.basename(resolved.fsPath),
        uri: resolved.fsPath,
        mimeType: mimeFromFileName(resolved.fsPath)
      };
      if (this.view) {
        void this.view.webview.postMessage({ type: "attachmentsPicked", attachments: [attachment] });
      } else {
        void vscode5.window.showInformationMessage("Open the Reasonix chat view first to attach this file.");
      }
      return;
    }
    const mention = `@${mentionTokenForPath(relative8, false)}`;
    if (!selection) {
      this.queueInsert(`${mention} `);
      return;
    }
    const header = `Selected lines ${selection.startLine}-${selection.endLine} from ${relative8}:`;
    const fence = "```";
    this.queueInsert(`${mention}
${header}
${fence}${selection.languageId}
${selection.text}
${fence}
`);
  }
  /**
   * Handles file/folder URIs dropped onto the webview. Directories and text
   * files become @ mentions; images are attached by content.
   */
  async handleFileDrop(uris) {
    const folder = this.currentWorkspaceFolder();
    const mentions = [];
    const attachments = [];
    for (const raw of uris) {
      let uri;
      try {
        uri = vscode5.Uri.parse(raw, true);
      } catch {
        continue;
      }
      if (!isFileResourceUri(uri)) {
        continue;
      }
      let stat2;
      try {
        stat2 = await vscode5.workspace.fs.stat(uri);
      } catch {
        continue;
      }
      const relative8 = folder ? path8.relative(folder.uri.fsPath, uri.fsPath).replace(/\\/g, "/") : void 0;
      const insideWorkspace = relative8 !== void 0 && (relative8 === "" || !relative8.startsWith("..") && !path8.isAbsolute(relative8));
      if (stat2.type === vscode5.FileType.Directory) {
        if (insideWorkspace) {
          mentions.push(`@${mentionTokenForPath(relative8, true)}`);
        }
        continue;
      }
      if (isImageMime(mimeFromFileName(uri.fsPath))) {
        attachments.push({ kind: "image", name: path8.basename(uri.fsPath), uri: uri.fsPath, mimeType: mimeFromFileName(uri.fsPath) });
        continue;
      }
      if (insideWorkspace) {
        mentions.push(`@${mentionTokenForPath(relative8, false)}`);
      } else {
        attachments.push({ kind: "file", name: path8.basename(uri.fsPath), uri: uri.fsPath, mimeType: mimeFromFileName(uri.fsPath) });
      }
    }
    if (attachments.length > 0 && this.view) {
      void this.view.webview.postMessage({ type: "attachmentsPicked", attachments });
    }
    if (mentions.length > 0) {
      this.queueInsert(`${mentions.join(" ")} `);
    }
  }
  /**
   * Inserts text into the composer at the caret. The webview acknowledges with
   * an insertApplied message; if the webview is not ready yet the insert is
   * retried whenever a webview message arrives (e.g. the initial snapshot).
   */
  queueInsert(text) {
    this.pendingInsert = { id: this.nextInsertId, text };
    this.nextInsertId += 1;
    this.flushPendingInsert();
  }
  flushPendingInsert() {
    if (!this.pendingInsert || !this.view) {
      return;
    }
    void this.view.webview.postMessage({ type: "insertAtCursor", id: this.pendingInsert.id, text: this.pendingInsert.text });
  }
  cancelTurn() {
    const folder = this.currentWorkspaceFolder();
    if (!folder) {
      return;
    }
    const key = workspaceKey(folder);
    const state = this.stateFor(folder);
    this.clients.get(key)?.cancel();
    const transcriptStart = this.clearPendingApprovals(key);
    state.status = "Cancelling";
    this.postSnapshot(transcriptStart);
  }
  async pickModel() {
    const folder = this.currentWorkspaceFolder();
    if (!folder) {
      void vscode5.window.showErrorMessage("Open a workspace folder before switching model.");
      this.postSnapshot();
      return;
    }
    const state = this.stateFor(folder);
    if (state.running) {
      void vscode5.window.showWarningMessage("Reasonix is running. Cancel the current turn before switching model.");
      this.postSnapshot();
      return;
    }
    const client = await this.ensureClient(folder);
    if (!client) {
      return;
    }
    const modelOption = configOptionByCategory(state.configOptions, "model");
    const nativeModels = modelOption?.options ?? state.sessionModels?.availableModels.map((model) => ({
      value: model.modelId,
      name: model.name,
      description: model.description
    })) ?? [];
    if (nativeModels.length > 0) {
      const currentValue = modelOption?.currentValue ?? state.sessionModels?.currentModelId;
      const picked = await vscode5.window.showQuickPick(nativeModels.map((model) => ({
        label: model.name,
        description: model.value === currentValue ? "current" : model.value,
        detail: model.description,
        value: model.value
      })), { title: "Reasonix model" });
      if (!picked || picked.value === currentValue) {
        return;
      }
      await this.setModel(picked.value);
      return;
    }
    let models;
    try {
      models = await client.listModels();
    } catch (err) {
      state.status = "Model list unavailable";
      this.appendOutput(`Reasonix model list unavailable: ${errorMessage2(err)}`, folder);
      this.postSnapshot();
      void vscode5.window.showInformationMessage("This Reasonix backend did not advertise a model selector.", "Open Settings").then((action) => {
        if (action === "Open Settings") {
          void vscode5.commands.executeCommand("workbench.action.openSettings", "reasonix.model");
        }
      });
      return;
    }
    state.models = models.models;
    const legacy = await vscode5.window.showQuickPick(models.models.map((model) => ({ label: model.ref, model })), { title: "Reasonix model" });
    if (legacy) {
      await vscode5.workspace.getConfiguration("reasonix").update("model", legacy.model.ref, vscode5.ConfigurationTarget.Workspace);
      state.status = `Model: ${legacy.model.ref} (next session)`;
      this.postSnapshot();
    }
  }
  async pickEffort() {
    const folder = this.currentWorkspaceFolder();
    if (!folder) {
      void vscode5.window.showErrorMessage("Open a workspace folder before switching effort.");
      return;
    }
    const state = this.stateFor(folder);
    if (state.running) {
      void vscode5.window.showWarningMessage("Reasonix is running. Cancel the current turn before switching effort.");
      return;
    }
    const client = await this.ensureClient(folder);
    if (!client) {
      return;
    }
    const effortOption = configOptionByCategory(state.configOptions, "thought_level") ?? state.configOptions?.find((option) => option.id.toLowerCase().includes("effort"));
    if (effortOption && effortOption.options.length > 0) {
      const picked = await vscode5.window.showQuickPick(effortOption.options.map((option) => ({
        label: option.name,
        description: option.value === effortOption.currentValue ? "current" : option.value,
        detail: option.description,
        value: option.value
      })), { title: "Reasonix reasoning effort" });
      if (!picked || picked.value === effortOption.currentValue) {
        return;
      }
      await this.setEffort(effortOption.id, picked.value);
      return;
    }
    void vscode5.window.showInformationMessage("The current Reasonix session did not advertise configurable reasoning effort.");
  }
  async setModel(value) {
    const folder = this.currentWorkspaceFolder();
    if (!folder) {
      void vscode5.window.showErrorMessage("Open a workspace folder before switching model.");
      this.postSnapshot();
      return;
    }
    const state = this.stateFor(folder);
    if (state.running) {
      void vscode5.window.showWarningMessage("Reasonix is running. Cancel the current turn before switching model.");
      this.postSnapshot();
      return;
    }
    const option = this.modelOptions(state).find((candidate) => candidate.value === value);
    if (!option) {
      this.appendOutput(`Ignored unavailable model selection: ${JSON.stringify(value)}`, folder);
      this.postSnapshot();
      return;
    }
    if (option.selected) {
      this.postSnapshot();
      return;
    }
    const client = await this.ensureClient(folder);
    if (!client) {
      this.postSnapshot();
      return;
    }
    try {
      await client.setModel(value);
      this.syncSessionState(state, client.sessionState);
      state.status = `Model: ${option.label}`;
      await vscode5.workspace.getConfiguration("reasonix").update("model", value, vscode5.ConfigurationTarget.Workspace);
    } catch (err) {
      this.appendOutput(`Reasonix model update failed: ${errorMessage2(err)}`, folder);
      void vscode5.window.showErrorMessage(`Reasonix could not switch models: ${errorMessage2(err)}`);
    } finally {
      this.postSnapshot();
    }
  }
  async setEffort(optionId, value) {
    const folder = this.currentWorkspaceFolder();
    if (!folder) {
      void vscode5.window.showErrorMessage("Open a workspace folder before switching effort.");
      this.postSnapshot();
      return;
    }
    const state = this.stateFor(folder);
    if (state.running) {
      void vscode5.window.showWarningMessage("Reasonix is running. Cancel the current turn before switching effort.");
      this.postSnapshot();
      return;
    }
    const effortOption = this.effortOption(state);
    const selection = effortOption?.id === optionId ? effortOption.options.find((candidate) => candidate.value === value) : void 0;
    if (!effortOption || !selection) {
      this.appendOutput(`Ignored unavailable effort selection: ${JSON.stringify({ optionId, value })}`, folder);
      this.postSnapshot();
      return;
    }
    if (effortOption.currentValue === value) {
      this.postSnapshot();
      return;
    }
    const client = await this.ensureClient(folder);
    if (!client) {
      this.postSnapshot();
      return;
    }
    try {
      await client.setConfigOption(effortOption.id, value);
      this.syncSessionState(state, client.sessionState);
      state.status = `Effort: ${selection.name}`;
    } catch (err) {
      this.appendOutput(`Reasonix effort update failed: ${errorMessage2(err)}`, folder);
      void vscode5.window.showWarningMessage(`Reasonix could not update reasoning effort: ${errorMessage2(err)}`);
    } finally {
      this.postSnapshot();
    }
  }
  async setExecutionMode(value) {
    const folder = this.currentWorkspaceFolder();
    if (!folder) {
      this.postSnapshot();
      return;
    }
    const state = this.stateFor(folder);
    if (state.running) {
      void vscode5.window.showWarningMessage("Reasonix is running. Cancel the current turn before switching execution method.");
      this.postSnapshot();
      return;
    }
    if (this.executionMode(state) === value) {
      this.postSnapshot();
      return;
    }
    const client = await this.ensureClient(folder);
    if (!client) {
      this.postSnapshot();
      return;
    }
    const modeId = this.sessionModeId(state, value);
    try {
      if (modeId) {
        await client.setMode(modeId);
        this.syncSessionState(state, client.sessionState);
      }
      state.executionMode = value;
      state.status = `Execution: ${value}`;
    } catch (err) {
      this.appendOutput(`Reasonix execution method update failed: ${errorMessage2(err)}`, folder);
      void vscode5.window.showWarningMessage(`Reasonix could not switch execution method: ${errorMessage2(err)}`);
    } finally {
      this.postSnapshot();
    }
  }
  async setWorkMode(optionId, value) {
    const folder = this.currentWorkspaceFolder();
    if (!folder) {
      this.postSnapshot();
      return;
    }
    const state = this.stateFor(folder);
    if (state.running) {
      void vscode5.window.showWarningMessage("Reasonix is running. Cancel the current turn before switching work mode.");
      this.postSnapshot();
      return;
    }
    const option = this.workModeOption(state);
    if (!option) {
      if (optionId === "legacy_work_mode" && value !== "delivery") {
        state.workMode = value;
      }
      this.postSnapshot();
      return;
    }
    const nativeValue = value === "balanced" && !option.options.some((candidate) => candidate.value === "balanced") && option.options.some((candidate) => candidate.value === "full") ? "full" : value;
    if (option.id !== optionId || !option.options.some((candidate) => candidate.value === nativeValue)) {
      this.appendOutput(`Ignored unavailable work mode selection: ${JSON.stringify({ optionId, value })}`, folder);
      this.postSnapshot();
      return;
    }
    if (option.currentValue === nativeValue) {
      this.postSnapshot();
      return;
    }
    const client = await this.ensureClient(folder);
    if (!client) {
      this.postSnapshot();
      return;
    }
    try {
      await client.setConfigOption(option.id, nativeValue);
      this.syncSessionState(state, client.sessionState);
      state.workMode = value;
      state.status = `Work mode: ${value}`;
    } catch (err) {
      this.appendOutput(`Reasonix work mode update failed: ${errorMessage2(err)}`, folder);
      void vscode5.window.showWarningMessage(`Reasonix could not switch work mode: ${errorMessage2(err)}`);
    } finally {
      this.postSnapshot();
    }
  }
  async setToolApprovalMode(optionId, value) {
    const folder = this.currentWorkspaceFolder();
    if (!folder) {
      this.postSnapshot();
      return;
    }
    const state = this.stateFor(folder);
    if (state.running) {
      void vscode5.window.showWarningMessage("Reasonix is running. Cancel the current turn before switching tool approvals.");
      this.postSnapshot();
      return;
    }
    const option = this.toolApprovalOption(state);
    if (!option) {
      if (optionId === "legacy_tool_approval") {
        state.toolApprovalMode = value;
      }
      this.postSnapshot();
      return;
    }
    if (option.id !== optionId || !option.options.some((candidate) => candidate.value === value)) {
      this.appendOutput(`Ignored unavailable tool approval selection: ${JSON.stringify({ optionId, value })}`, folder);
      this.postSnapshot();
      return;
    }
    if (option.currentValue === value) {
      this.postSnapshot();
      return;
    }
    const client = await this.ensureClient(folder);
    if (!client) {
      this.postSnapshot();
      return;
    }
    try {
      await client.setConfigOption(option.id, value);
      this.syncSessionState(state, client.sessionState);
      state.toolApprovalMode = value;
      state.status = `Tool approvals: ${value}`;
    } catch (err) {
      this.appendOutput(`Reasonix tool approval update failed: ${errorMessage2(err)}`, folder);
      void vscode5.window.showWarningMessage(`Reasonix could not switch tool approvals: ${errorMessage2(err)}`);
    } finally {
      this.postSnapshot();
    }
  }
  async pickUiLanguage() {
    const current = configuredUiLanguage();
    const picked = await vscode5.window.showQuickPick(
      [
        { label: "Auto", description: "Follow VS Code", value: "auto" },
        { label: "English", description: "Reasonix UI", value: "en" },
        { label: "\u7B80\u4F53\u4E2D\u6587", description: "Reasonix \u754C\u9762", value: "zh-CN" }
      ],
      {
        title: "Reasonix UI Language",
        placeHolder: current
      }
    );
    if (!picked) {
      return;
    }
    await vscode5.workspace.getConfiguration("reasonix").update("uiLanguage", picked.value, vscode5.ConfigurationTarget.Global);
    this.postSnapshot();
  }
  async openSettings() {
    await vscode5.commands.executeCommand("workbench.view.extension.reasonix");
    await vscode5.commands.executeCommand("reasonix.chat.focus");
    this.postSnapshot();
    void this.view?.webview.postMessage({ type: "openSettings" });
  }
  async testSendPrompt(text, toolApprovalMode) {
    const expanded = expandSlashCommand(text);
    await this.sendPrompt(expanded.prompt, false, toolApprovalMode, "normal", "balanced", text);
  }
  async testWebviewMessage(message) {
    await this.handleWebviewMessage(message);
  }
  testSnapshot() {
    const folder = this.currentWorkspaceFolder();
    return folder ? structuredClone(this.stateFor(folder)) : void 0;
  }
  async handleWebviewMessage(raw) {
    this.flushPendingInsert();
    const message = parseWebviewMessage(raw);
    if (!message) {
      this.appendOutput(`Ignored invalid webview message: ${JSON.stringify(raw)}`);
      return;
    }
    switch (message.command) {
      case "fileDrop":
        await this.handleFileDrop(message.uris);
        return;
      case "insertApplied":
        if (this.pendingInsert?.id === message.id) {
          this.pendingInsert = void 0;
        }
        return;
      case "sendPrompt":
        const activeFolder = this.currentWorkspaceFolder();
        const nativeCommand = activeFolder ? matchesAvailableCommand(message.text, this.stateFor(activeFolder).availableCommands) : false;
        const expanded = nativeCommand ? { prompt: message.text } : expandSlashCommand(message.text);
        await this.sendPrompt(
          expanded.prompt,
          true,
          message.toolApprovalMode,
          message.collaborationMode,
          message.tokenMode,
          message.text,
          message.attachments
        );
        return;
      case "cancel":
        this.cancelTurn();
        return;
      case "connect":
        await this.ensureClient();
        return;
      case "newSession":
        await this.newSession();
        return;
      case "pickAttachment":
        await this.pickAttachments();
        return;
      case "setContextMode":
        await this.setContextMode(message.mode);
        return;
      case "pickModel":
        await this.pickModel();
        return;
      case "pickEffort":
        await this.pickEffort();
        return;
      case "setModel":
        await this.setModel(message.value);
        return;
      case "setEffort":
        await this.setEffort(message.optionId, message.value);
        return;
      case "setExecutionMode":
        await this.setExecutionMode(message.value);
        return;
      case "setWorkMode":
        await this.setWorkMode(message.optionId, message.value);
        return;
      case "setToolApprovalMode":
        await this.setToolApprovalMode(message.optionId, message.value);
        return;
      case "pickUiLanguage":
        await this.pickUiLanguage();
        return;
      case "selectBinary":
        await selectReasonixBinary();
        this.postSnapshot();
        return;
      case "openNativeSettings":
        await vscode5.commands.executeCommand("workbench.action.openSettings", "reasonix");
        return;
      case "updateSetting":
        await this.updateSetting(message.key, message.value);
        return;
      case "showOutput":
        this.output.show();
        return;
      case "loadSession":
        await this.loadSession(message.sessionId);
        return;
      case "deleteSession":
        await this.deleteSession(message.sessionId);
        return;
      case "quickPrompt":
        await this.runQuickPrompt(message.action);
        return;
      case "copyText":
        await vscode5.env.clipboard.writeText(message.text);
        return;
      case "openExternal":
        await this.openExternal(message.href);
        return;
      case "insertMessage":
        await this.insertMessage(message.index);
        return;
      case "retryMessage":
        await this.retryMessage(message.index);
        return;
      case "continueMessage":
        await this.continueMessage(message.index);
        return;
      case "openToolPreview":
        await this.openToolPreview(message.index);
        return;
      case "openToolLocation":
        await this.openToolLocation(message.index, message.locationIndex);
        return;
      case "approvalDecision":
        this.resolveApproval(message.id, message.optionId);
        return;
      case "resourceSuggestions":
        await this.postResourceSuggestions(message.requestId, message.query);
        return;
      case "stateSnapshot":
        this.snapshotSync.requireFullSnapshot();
        this.postSnapshot(void 0, true);
        return;
      default:
        assertNever(message);
    }
  }
  async setContextMode(mode) {
    await vscode5.workspace.getConfiguration("reasonix").update("includeSelectionMode", mode, vscode5.ConfigurationTarget.Workspace);
    this.postSnapshot();
  }
  async updateSetting(key, value) {
    const config = vscode5.workspace.getConfiguration("reasonix");
    switch (key) {
      case "binaryPath":
        if (typeof value === "string") {
          await config.update("binaryPath", value.trim(), vscode5.ConfigurationTarget.Global);
        }
        break;
      case "model":
        if (typeof value === "string") {
          await config.update("model", value.trim(), vscode5.ConfigurationTarget.Workspace);
        }
        break;
      case "uiLanguage":
        if (value === "auto" || value === "en" || value === "zh-CN") {
          await config.update("uiLanguage", value, vscode5.ConfigurationTarget.Global);
        }
        break;
      case "autoStart":
        if (typeof value === "boolean") {
          await config.update("autoStart", value, vscode5.ConfigurationTarget.Workspace);
        }
        break;
      case "trace":
        if (typeof value === "boolean") {
          await config.update("trace", value, vscode5.ConfigurationTarget.Workspace);
        }
        break;
      case "includeSelectionMode":
        if (value === "off" || value === "selectionOnly" || value === "nearby") {
          await config.update("includeSelectionMode", value, vscode5.ConfigurationTarget.Workspace);
        }
        break;
      default:
        assertNever(key);
    }
    this.postSnapshot();
  }
  async loadSession(sessionId) {
    const folder = this.currentWorkspaceFolder();
    if (!folder) {
      void vscode5.window.showErrorMessage("Open a workspace folder before loading a Reasonix session.");
      return;
    }
    const state = this.stateFor(folder);
    if (state.running) {
      void vscode5.window.showWarningMessage("Reasonix is running. Cancel the current turn before switching sessions.");
      return;
    }
    if (state.sessionId === sessionId && this.clients.get(workspaceKey(folder))?.connected) {
      return;
    }
    const key = workspaceKey(folder);
    const entry = this.sessionHistory(folder).find((candidate) => candidate.id === sessionId);
    this.clearPendingApprovals(key);
    this.clients.get(key)?.dispose();
    this.clients.delete(key);
    this.disposeTerminalBridge(key);
    state.items = [];
    state.running = false;
    state.disconnected = true;
    state.status = "Loading session";
    state.sessionId = sessionId;
    state.sessionTitle = entry?.title;
    state.usage = void 0;
    state.sessionModels = void 0;
    state.modes = void 0;
    state.configOptions = void 0;
    state.executionMode = void 0;
    state.workMode = void 0;
    state.toolApprovalMode = void 0;
    state.availableCommands = void 0;
    await this.context.workspaceState.update(this.sessionStorageKey(folder), sessionId);
    this.postSnapshot(0);
    await this.ensureClient(folder);
  }
  async deleteSession(sessionId) {
    const folder = this.currentWorkspaceFolder();
    if (!folder) {
      return;
    }
    const state = this.stateFor(folder);
    if (state.running) {
      void vscode5.window.showWarningMessage("Cancel the current Reasonix turn before deleting a session.");
      return;
    }
    const entry = (state.sessions ?? this.sessionHistory(folder)).find((session) => session.id === sessionId);
    const action = await vscode5.window.showWarningMessage(
      `Delete Reasonix session "${entry?.title ?? sessionId}"?`,
      { modal: true },
      "Delete"
    );
    if (action !== "Delete") {
      return;
    }
    const client = await this.ensureClient(folder);
    if (!client) {
      return;
    }
    try {
      if (state.sessionId === sessionId) {
        await client.closeSession(sessionId);
      }
      await client.deleteSession(sessionId);
      state.sessions = (state.sessions ?? []).filter((session) => session.id !== sessionId);
      const history = this.sessionHistory(folder).filter((session) => session.id !== sessionId);
      await this.context.workspaceState.update(this.sessionHistoryKey(folder), history);
      let transcriptReset = false;
      if (state.sessionId === sessionId) {
        client.dispose();
        this.clients.delete(workspaceKey(folder));
        await this.context.workspaceState.update(this.sessionStorageKey(folder), void 0);
        state.items = [];
        transcriptReset = true;
        state.sessionId = void 0;
        state.sessionTitle = void 0;
        state.status = "Session deleted";
      }
      this.postSnapshot(transcriptReset ? 0 : void 0);
    } catch (err) {
      void vscode5.window.showErrorMessage(`Could not delete Reasonix session: ${errorMessage2(err)}`);
    }
  }
  async runQuickPrompt(action) {
    switch (action) {
      case "explainFile":
        await this.sendPrompt("Explain the current file. Focus on purpose, important flows, and risky areas.", true);
        return;
      case "fixSelection":
        await this.sendPrompt("Fix the selected code. Keep the change focused, preserve existing behavior, and explain what changed.", true);
        return;
      case "runTests":
        await this.sendPrompt("Run the relevant tests for this workspace. If failures appear, diagnose and fix them.", false);
        return;
      case "searchRepo":
        await this.sendPrompt("Search the repository for the relevant implementation, summarize what you find, and point to the key files.", false);
        return;
      default:
        assertNever(action);
    }
  }
  async openExternal(href) {
    try {
      const uri = vscode5.Uri.parse(href);
      if (uri.scheme !== "http" && uri.scheme !== "https" && uri.scheme !== "mailto") {
        return;
      }
      await vscode5.env.openExternal(uri);
    } catch {
    }
  }
  async postResourceSuggestions(requestId, query) {
    const folder = this.currentWorkspaceFolder();
    const items = folder ? await suggestWorkspaceResources(query, folder.uri.fsPath) : [];
    void this.view?.webview.postMessage({ type: "resourceSuggestions", requestId, query, items });
  }
  async pickAttachments() {
    const picked = await vscode5.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: true,
      openLabel: "Attach",
      title: "Attach files or images"
    });
    if (!picked || picked.length === 0) {
      return;
    }
    const folder = this.currentWorkspaceFolder();
    const state = folder ? this.stateFor(folder) : void 0;
    const supportsImage = state?.agentCapabilities?.promptCapabilities?.image === true;
    const attachments = [];
    let skippedImage = false;
    for (const uri of picked.slice(0, MAX_ATTACHMENTS)) {
      const name = path8.basename(uri.fsPath);
      const mimeType = mimeFromFileName(name);
      const kind = isImageMime(mimeType) ? "image" : "file";
      if (kind === "image" && !supportsImage) {
        skippedImage = true;
        continue;
      }
      attachments.push({ kind, name, uri: uri.toString(), mimeType });
    }
    if (skippedImage) {
      const text = "The connected Reasonix does not support image prompts; image files were skipped.";
      if (state) {
        this.postSnapshot(appendNotice(state.items, text));
      } else {
        void vscode5.window.showWarningMessage(text);
      }
    }
    if (attachments.length > 0) {
      void this.view?.webview.postMessage({ type: "attachmentsPicked", attachments });
    }
  }
  async insertMessage(index) {
    const text = this.messageTextAt(index);
    if (!text) {
      return;
    }
    const editor = vscode5.window.activeTextEditor;
    if (!editor) {
      void vscode5.window.showInformationMessage("Open an editor before inserting a Reasonix message.");
      return;
    }
    await editor.edit((edit) => edit.insert(editor.selection.active, text));
    await vscode5.window.showTextDocument(editor.document);
  }
  async retryMessage(index) {
    const prompt = this.retryPromptAt(index);
    if (prompt) {
      await this.sendPrompt(prompt, true);
    }
  }
  async continueMessage(_index) {
    await this.sendPrompt("Continue from your last response.", false);
  }
  async openToolPreview(index) {
    const folder = this.currentWorkspaceFolder();
    const preview = this.previewAt(index);
    if (!preview) {
      void vscode5.window.showInformationMessage("No diff preview is available for this item.");
      return;
    }
    await this.preview.previewChange(preview, folder);
  }
  async openToolLocation(index, locationIndex) {
    const folder = this.currentWorkspaceFolder();
    if (!folder) {
      return;
    }
    const item = this.stateFor(folder).items[index];
    const location = item?.type === "tool" ? item.locations?.[locationIndex] : void 0;
    if (!location) {
      return;
    }
    const root = path8.resolve(folder.uri.fsPath);
    const target = path8.resolve(root, location.path);
    const relative8 = path8.relative(root, target);
    if (relative8.startsWith("..") || path8.isAbsolute(relative8)) {
      void vscode5.window.showWarningMessage("Reasonix tool locations outside the workspace cannot be opened.");
      return;
    }
    try {
      const document = await vscode5.workspace.openTextDocument(vscode5.Uri.file(target));
      const editor = await vscode5.window.showTextDocument(document);
      if (location.line !== void 0) {
        const line = Math.max(0, Math.min(document.lineCount - 1, location.line - 1));
        const position = new vscode5.Position(line, 0);
        editor.selection = new vscode5.Selection(position, position);
        editor.revealRange(new vscode5.Range(position, position), vscode5.TextEditorRevealType.InCenterIfOutsideViewport);
      }
    } catch (err) {
      void vscode5.window.showErrorMessage(`Could not open Reasonix tool location: ${errorMessage2(err)}`);
    }
  }
  messageTextAt(index) {
    const folder = this.currentWorkspaceFolder();
    if (!folder) {
      return void 0;
    }
    const item = this.stateFor(folder).items[index];
    if (item?.type === "message") {
      return item.text;
    }
    if (item?.type === "tool") {
      return item.content ?? (item.rawInput === void 0 ? void 0 : JSON.stringify(item.rawInput, null, 2));
    }
    if (item?.type === "approval") {
      return item.rawInput === void 0 ? void 0 : JSON.stringify(item.rawInput, null, 2);
    }
    return void 0;
  }
  retryPromptAt(index) {
    const folder = this.currentWorkspaceFolder();
    if (!folder) {
      return void 0;
    }
    const items = this.stateFor(folder).items;
    const direct = items[index];
    if (direct?.type === "message" && direct.role === "user") {
      return direct.text;
    }
    for (let i = Math.min(index, items.length - 1); i >= 0; i -= 1) {
      const item = items[i];
      if (item?.type === "message" && item.role === "user") {
        return item.text;
      }
    }
    return void 0;
  }
  previewAt(index) {
    const folder = this.currentWorkspaceFolder();
    if (!folder) {
      return void 0;
    }
    const item = this.stateFor(folder).items[index];
    return item?.type === "tool" || item?.type === "approval" ? item.preview : void 0;
  }
  async sendPrompt(text, appendContext, toolApprovalMode, collaborationMode, workMode, displayText = text, attachments = []) {
    const folder = this.currentWorkspaceFolder();
    if (!folder) {
      void vscode5.window.showErrorMessage("Open a workspace folder before starting Reasonix.");
      return;
    }
    const state = this.stateFor(folder);
    const key = workspaceKey(folder);
    const trimmed = text.trim();
    if (trimmed === "" && attachments.length === 0 || state.running || this.sending.has(key)) {
      return;
    }
    this.sending.add(key);
    try {
      const client = await this.ensureClient(folder);
      if (!client) {
        return;
      }
      const desiredExecution = collaborationMode ?? this.executionMode(state);
      const desiredWorkMode = workMode ?? this.workMode(state);
      const desiredApproval = toolApprovalMode ?? this.toolApprovalMode(state);
      await this.applyComposerAxes(client, state, desiredExecution, desiredWorkMode, desiredApproval, folder);
      const providerPrompt = promptWithLegacyComposerModes(
        trimmed,
        desiredExecution,
        desiredWorkMode,
        this.sessionModeId(state, "goal") !== void 0,
        this.workModeOption(state) !== void 0
      );
      const withMentions = await buildPromptBlocks(providerPrompt, folder.uri.fsPath);
      let blocks = withMentions.blocks;
      if (attachments.length > 0) {
        try {
          const readFile2 = async (uri) => vscode5.workspace.fs.readFile(vscode5.Uri.parse(uri));
          const attachmentBlocks = [];
          for (const attachment of attachments.slice(0, MAX_ATTACHMENTS)) {
            attachmentBlocks.push(await attachmentToBlock(attachment, readFile2));
          }
          blocks = [...blocks, ...attachmentBlocks];
        } catch (err) {
          const transcriptStart = appendNotice(state.items, `Attachment failed: ${errorMessage2(err)}`);
          this.appendOutput(`Attachment read failed: ${errorMessage2(err)}`, folder);
          this.postSnapshot(transcriptStart);
          return;
        }
      }
      blocks = appendContext ? this.withEditorContext(blocks, appendContext === true ? void 0 : appendContext) : blocks;
      if (withMentions.mentions.length > 0) {
        this.appendOutput(`Attached ${withMentions.mentions.length} @ resource mention(s): ${withMentions.mentions.map((mention) => mention.relativePath).join(", ")}`, folder);
      }
      const visiblePrompt = displayText.trim() || trimmed || attachments.map((attachment) => attachment.name).join(", ");
      const userMessageIndex = appendUserMessage(state.items, visiblePrompt);
      await this.updateCurrentSessionTitle(folder, visiblePrompt);
      state.running = true;
      state.status = "Sending";
      this.postSnapshot(userMessageIndex);
      try {
        const result = await client.sendPrompt(blocks);
        if (result.stopReason === "cancelled") {
          this.postSnapshot(appendNotice(state.items, "Turn cancelled."));
        } else if (result.stopReason === "error") {
          this.postSnapshot(appendNotice(state.items, "Turn ended with an error. Check the Reasonix output channel."));
        }
      } catch (err) {
        this.postSnapshot(appendNotice(state.items, `Reasonix error: ${errorMessage2(err)}`));
        this.appendOutput(`Reasonix prompt failed: ${errorMessage2(err)}`, folder);
      } finally {
        state.running = false;
        state.status = state.disconnected ? "Disconnected" : "Idle";
        if (!client.capabilities) {
          await this.refreshStatus(client, folder);
        }
        await this.refreshSessions(client, folder);
        if (!state.disconnected) {
          this.reconnectAttempts.delete(key);
        }
        this.postSnapshot();
      }
    } finally {
      this.sending.delete(key);
    }
  }
  withEditorContext(blocks, mode) {
    const info = buildEditorContextBlock(mode);
    return info ? [...blocks, info.block] : blocks;
  }
  async applyDefaultToolApproval(client, state, folder) {
    const option = this.toolApprovalOption(state);
    if (!option || option.currentValue === "auto" || !option.options.some((candidate) => candidate.value === "auto")) {
      return;
    }
    try {
      await client.setConfigOption(option.id, "auto");
      this.syncSessionState(state, client.sessionState);
      this.appendOutput(`New session defaults tool approval to auto (${option.id}).`, folder);
    } catch (err) {
      this.appendOutput(`Could not set default tool approval: ${errorMessage2(err)}`, folder);
    }
  }
  async applyComposerAxes(client, state, collaborationMode, workMode, toolApprovalMode, folder) {
    try {
      const modeId = this.sessionModeId(state, collaborationMode);
      if (modeId && state.modes?.currentModeId !== modeId) {
        await client.setMode(modeId);
        this.syncSessionState(state, client.sessionState);
      }
      state.executionMode = collaborationMode;
      const workOption = this.workModeOption(state);
      if (workOption) {
        const nativeWorkMode = workMode === "balanced" && !workOption.options.some((candidate) => candidate.value === "balanced") && workOption.options.some((candidate) => candidate.value === "full") ? "full" : workMode;
        if (workOption.currentValue !== nativeWorkMode && workOption.options.some((candidate) => candidate.value === nativeWorkMode)) {
          await client.setConfigOption(workOption.id, nativeWorkMode);
          this.syncSessionState(state, client.sessionState);
        }
      } else {
        state.workMode = workMode === "delivery" ? "balanced" : workMode;
      }
      const approvalOption = this.toolApprovalOption(state);
      if (approvalOption) {
        if (approvalOption.currentValue !== toolApprovalMode && approvalOption.options.some((candidate) => candidate.value === toolApprovalMode)) {
          await client.setConfigOption(approvalOption.id, toolApprovalMode);
          this.syncSessionState(state, client.sessionState);
        }
      } else {
        state.toolApprovalMode = toolApprovalMode;
        const legacyModeId = collaborationMode === "plan" ? "plan" : toolApprovalMode === "yolo" ? "auto" : "default";
        if (state.modes?.availableModes.some((mode) => mode.id === legacyModeId) && state.modes.currentModeId !== legacyModeId) {
          await client.setMode(legacyModeId);
          this.syncSessionState(state, client.sessionState);
          state.executionMode = collaborationMode;
        }
      }
    } catch (err) {
      this.appendOutput(`Reasonix composer mode update failed: ${errorMessage2(err)}`, folder);
      throw new Error(`Could not apply Reasonix composer mode: ${errorMessage2(err)}`);
    }
  }
  starting = /* @__PURE__ */ new Map();
  ensureClient(folder = this.currentWorkspaceFolder()) {
    if (!folder) {
      return Promise.resolve(void 0);
    }
    const key = workspaceKey(folder);
    const existing = this.clients.get(key);
    if (existing?.connected) {
      return Promise.resolve(existing);
    }
    const inFlight = this.starting.get(key);
    if (inFlight) {
      return inFlight;
    }
    const p = this.startClient(folder).finally(() => this.starting.delete(key));
    this.starting.set(key, p);
    return p;
  }
  async startClient(folder) {
    const key = workspaceKey(folder);
    const binaryPath = await resolveReasonixBinary();
    if (!binaryPath) {
      return void 0;
    }
    const state = this.stateFor(folder);
    const config = vscode5.workspace.getConfiguration("reasonix");
    const model = config.get("model", "");
    const trace = config.get("trace", false);
    const previousSessionId = this.context.workspaceState.get(this.sessionStorageKey(folder));
    const bridgeLog = (message) => this.appendOutput(message, folder);
    const fileSystem = vscode5.workspace.isTrusted ? new WorkspaceFileBridge(folder, bridgeLog) : void 0;
    const terminal = vscode5.workspace.isTrusted ? new WorkspaceTerminalBridge(folder, bridgeLog) : void 0;
    if (terminal) {
      this.disposeTerminalBridge(key);
      this.terminals.set(key, terminal);
    }
    state.disconnected = false;
    state.status = "Starting";
    this.postSnapshot();
    const client = new AcpClient({
      binaryPath,
      model,
      cwd: folder.uri.fsPath,
      previousSessionId,
      resumeSession: state.items.length > 0,
      output: this.output,
      trace,
      fileSystem,
      terminal,
      onUpdate: (params) => this.handleSessionUpdate(folder, params),
      onPermissionRequest: (params) => this.handlePermissionRequest(folder, params),
      onDisconnect: (reason) => {
        this.appendOutput(`Reasonix ACP disconnected: ${reason}`, folder);
        if (this.clients.get(key) !== client) {
          return;
        }
        const transcriptStart = this.clearPendingApprovals(key);
        this.clients.delete(key);
        this.disposeTerminalBridge(key);
        state.disconnected = true;
        state.running = false;
        state.status = "Disconnected";
        this.postSnapshot(transcriptStart);
        this.scheduleReconnect(folder);
      },
      onSessionId: (sessionId) => {
        state.sessionId = sessionId;
        void this.context.workspaceState.update(this.sessionStorageKey(folder), sessionId);
        void this.rememberSession(folder, sessionId, state.sessionTitle ?? "New session");
      },
      onSessionState: (sessionState) => {
        this.syncSessionState(state, sessionState);
        this.postSnapshot();
      },
      onReasonixStatus: (status, event) => this.handleReasonixStatus(folder, status, event)
    });
    this.clients.set(key, client);
    try {
      const started = await client.start();
      state.disconnected = false;
      state.status = "Idle";
      state.agentCapabilities = client.capabilities;
      state.authMethods = [...client.authMethods];
      this.clearReconnectTimer(key);
      if (started.isNewSession) {
        await this.applyDefaultToolApproval(client, state, folder);
      }
      await this.refreshSessions(client, folder);
      if (!client.capabilities) {
        await this.refreshStatus(client, folder);
      }
      this.postSnapshot();
      return client;
    } catch (err) {
      client.dispose();
      this.clients.delete(key);
      this.disposeTerminalBridge(key);
      state.disconnected = true;
      state.status = "Start failed";
      const transcriptStart = appendNotice(state.items, `Could not start Reasonix: ${errorMessage2(err)}`);
      this.appendOutput(`Reasonix start failed: ${errorMessage2(err)}`, folder);
      this.postSnapshot(transcriptStart);
      return void 0;
    }
  }
  handleSessionUpdate(folder, params) {
    const state = this.stateFor(folder);
    if (state.sessionId && params.sessionId !== state.sessionId) {
      this.appendOutput(`Ignored update for inactive session ${params.sessionId}`, folder);
      return;
    }
    const transcriptStart = applySessionUpdate(state.items, params.update);
    switch (params.update.sessionUpdate) {
      case "agent_thought_chunk":
        state.status = "Thinking";
        break;
      case "agent_message_chunk":
        state.status = "Responding";
        break;
      case "tool_call":
        state.status = params.update.title ? `Using ${params.update.title}` : "Using tool";
        break;
      case "tool_call_update":
        state.status = params.update.status === "failed" ? "Tool failed" : "Working";
        break;
      case "usage":
        state.status = "Updating usage";
        break;
      case "user_message_chunk":
        state.status = "Sending";
        break;
      case "available_commands_update":
        state.availableCommands = params.update.availableCommands;
        break;
      case "config_option_update":
        state.configOptions = params.update.configOptions;
        state.workMode = this.workMode(state);
        state.toolApprovalMode = this.toolApprovalMode(state);
        break;
      case "plan":
        state.status = "Planning";
        break;
      case "current_mode_update":
        if (state.modes) {
          state.modes = { ...state.modes, currentModeId: params.update.currentModeId };
        }
        state.executionMode = params.update.currentModeId === "plan" || params.update.currentModeId === "goal" ? params.update.currentModeId : "normal";
        state.status = `Mode: ${params.update.currentModeId}`;
        break;
      default:
        break;
    }
    if (params.update.sessionUpdate === "usage") {
      state.usage = params.update.usage;
      this.updateStatusBar(folder);
    }
    this.postSnapshot(transcriptStart);
  }
  handleReasonixStatus(folder, status, event) {
    if (event !== void 0 && event !== "usage") {
      return;
    }
    const state = this.stateFor(folder);
    if (state.sessionId && status.sessionId !== state.sessionId) {
      this.appendOutput(`Ignored status for inactive session ${status.sessionId}`, folder);
      return;
    }
    const usage = usageDataFromReasonixStatus(status);
    const turnHasUsage = usage.totalTokens > 0 || usage.cacheHitTokens > 0 || usage.cacheMissTokens > 0 || usage.cost !== void 0;
    const cumulative = status.usage.cumulative;
    const sessionHasUsage = cumulative.promptTokens > 0 || cumulative.completionTokens > 0 || cumulative.cacheHitTokens > 0 || cumulative.cacheMissTokens > 0 || cumulative.estimatedCost !== void 0 && cumulative.estimatedCost !== null;
    if (!turnHasUsage && !sessionHasUsage) {
      return;
    }
    if (turnHasUsage) {
      applySessionUpdate(state.items, { sessionUpdate: "usage", usage });
    }
    state.usage = usage;
    this.updateStatusBar(folder);
    this.postSnapshot();
  }
  async handlePermissionRequest(folder, params) {
    const state = this.stateFor(folder);
    const stateKey = workspaceKey(folder);
    const approvalId = params.toolCall.toolCallId;
    const approvalMode = this.toolApprovalMode(state);
    const autoResult = this.toolApprovalOption(state) ? void 0 : this.autoPermissionResult(params, approvalMode);
    if (autoResult) {
      this.postSnapshot(appendNotice(state.items, `${permissionModeNotice(approvalMode)}: ${params.toolCall.title ?? "tool"}`));
      return autoResult;
    }
    const approvalIndex = appendApproval(state.items, params);
    state.status = isQuestionRequest(params) ? "Waiting for answer" : "Waiting for approval";
    this.postSnapshot(approvalIndex);
    if (!isQuestionRequest(params)) {
      try {
        await this.preview.previewPermission(params, folder);
      } catch (err) {
        this.appendOutput(`Reasonix diff preview failed: ${errorMessage2(err)}`, folder);
      }
    }
    let resolveDecision;
    const decision = new Promise((resolve6) => {
      resolveDecision = resolve6;
    });
    this.pendingApprovals.set(approvalId, { stateKey, resolve: resolveDecision, options: params.options });
    if (this.view) {
      this.view.show();
    } else {
      try {
        await vscode5.commands.executeCommand("reasonix.openChat");
      } catch (err) {
        this.appendOutput(`Could not reveal Reasonix approval: ${errorMessage2(err)}`, folder);
      }
    }
    if (!this.pendingApprovals.has(approvalId)) {
      return decision;
    }
    if (this.view) {
      this.postSnapshot(approvalIndex);
      return decision;
    }
    this.pendingApprovals.delete(approvalId);
    const result = await this.fallbackPermission(params);
    this.postSnapshot(resolveApproval(state.items, approvalId, result.outcome.outcome === "selected"));
    resolveDecision(result);
    return result;
  }
  autoPermissionResult(params, mode) {
    if (mode === "ask" || isQuestionRequest(params)) {
      return void 0;
    }
    const preferredKind = mode === "auto" ? "allow_always" : "allow_once";
    const fallbackKind = mode === "auto" ? "allow_once" : "allow_always";
    const option = params.options.find((candidate) => candidate.kind === preferredKind) ?? params.options.find((candidate) => candidate.kind === fallbackKind);
    return option ? { outcome: { outcome: "selected", optionId: option.optionId } } : void 0;
  }
  async fallbackPermission(params) {
    if (isQuestionRequest(params)) {
      const picked2 = await vscode5.window.showQuickPick(
        params.options.filter((option2) => !option2.kind.startsWith("reject") && !option2.optionId.endsWith(":cancel")).map((option2) => ({ label: option2.name, optionId: option2.optionId })),
        { title: params.toolCall.title ?? "Reasonix question", placeHolder: "Choose an answer" }
      );
      return picked2 ? { outcome: { outcome: "selected", optionId: picked2.optionId } } : { outcome: { outcome: "cancelled" } };
    }
    const choices = [
      { title: "Allow Once", kind: "allow_once" },
      { title: "Allow Session", kind: "allow_always" },
      { title: "Always Allow", kind: "allow_persistent" },
      { title: "Reject", kind: "cancelled" }
    ];
    const picked = await vscode5.window.showWarningMessage(
      permissionNotification(params),
      ...choices.map((choice2) => choice2.title)
    );
    const choice = choices.find((candidate) => candidate.title === picked);
    if (!choice || choice.kind === "cancelled") {
      return { outcome: { outcome: "cancelled" } };
    }
    const option = params.options.find((candidate) => candidate.kind === choice.kind) ?? params.options.find((candidate) => candidate.optionId === choice.kind);
    return option ? { outcome: { outcome: "selected", optionId: option.optionId } } : { outcome: { outcome: "cancelled" } };
  }
  resolveApproval(id, optionId) {
    const pending = this.pendingApprovals.get(id);
    if (!pending) {
      return;
    }
    this.pendingApprovals.delete(id);
    const state = this.states.get(pending.stateKey);
    let result;
    if (optionId === "cancelled") {
      result = { outcome: { outcome: "cancelled" } };
    } else {
      const option = pending.options.find((candidate) => candidate.optionId === optionId);
      result = option ? { outcome: { outcome: "selected", optionId: option.optionId } } : { outcome: { outcome: "cancelled" } };
    }
    const transcriptStart = resolveApproval(state?.items ?? [], id, result.outcome.outcome === "selected");
    pending.resolve(result);
    this.postSnapshot(transcriptStart);
  }
  clearPendingApprovals(stateKey) {
    let transcriptStart;
    for (const [id, pending] of this.pendingApprovals) {
      if (pending.stateKey === stateKey) {
        this.pendingApprovals.delete(id);
        const changed = resolveApproval(this.states.get(stateKey)?.items ?? [], id, false);
        if (changed !== void 0) {
          transcriptStart = transcriptStart === void 0 ? changed : Math.min(transcriptStart, changed);
        }
        pending.resolve({ outcome: { outcome: "cancelled" } });
      }
    }
    return transcriptStart;
  }
  syncSessionState(state, sessionState) {
    state.sessionModels = sessionState.models ?? state.sessionModels;
    state.modes = sessionState.modes ?? state.modes;
    state.configOptions = sessionState.configOptions ?? state.configOptions;
    state.executionMode = this.executionMode(state);
    state.workMode = this.workMode(state);
    state.toolApprovalMode = this.toolApprovalMode(state);
  }
  async refreshSessions(client, folder) {
    if (!client.capabilities?.sessionCapabilities?.list) {
      return;
    }
    try {
      const sessions = await client.listSessions();
      this.stateFor(folder).sessions = sessions.map((session) => ({
        id: session.sessionId,
        title: session.title?.trim() || "Untitled session",
        updatedAt: session.updatedAt ? Date.parse(session.updatedAt) || 0 : 0
      })).sort((a, b) => b.updatedAt - a.updatedAt);
    } catch (err) {
      this.appendOutput(`Reasonix session list failed: ${errorMessage2(err)}`, folder);
    }
  }
  scheduleReconnect(folder) {
    const key = workspaceKey(folder);
    const state = this.stateFor(folder);
    if (!state.sessionId || this.reconnectTimers.has(key)) {
      return;
    }
    const attempt = (this.reconnectAttempts.get(key) ?? 0) + 1;
    if (attempt > 3) {
      state.status = "Reconnect failed";
      this.postSnapshot(appendNotice(state.items, "Reasonix disconnected repeatedly. Send another prompt to retry, or check the output channel."));
      return;
    }
    this.reconnectAttempts.set(key, attempt);
    const delay = 1e3 * 2 ** (attempt - 1);
    state.status = `Reconnecting (${attempt}/3)`;
    this.postSnapshot();
    const timer = setTimeout(() => {
      this.reconnectTimers.delete(key);
      if (!this.clients.has(key)) {
        void this.ensureClient(folder);
      }
    }, delay);
    this.reconnectTimers.set(key, timer);
  }
  clearReconnectTimer(key) {
    const timer = this.reconnectTimers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.reconnectTimers.delete(key);
    }
  }
  disposeTerminalBridge(key) {
    this.terminals.get(key)?.dispose();
    this.terminals.delete(key);
  }
  async refreshStatus(client, folder) {
    try {
      const status = await client.status();
      const state = this.stateFor(folder);
      state.usage = status.lastUsage ?? state.usage;
      state.mcp = {
        connected: status.connectedMcp ?? [],
        configured: status.configuredMcp ?? [],
        disconnected: status.disconnectedMcp ?? []
      };
      this.updateStatusBar(folder);
    } catch {
    }
  }
  postSnapshot(transcriptStart, immediate = false) {
    this.snapshotSync.markTranscriptChanged(transcriptStart);
    if (!this.view?.visible) {
      return;
    }
    if (immediate) {
      if (this.snapshotTimer) {
        clearTimeout(this.snapshotTimer);
        this.snapshotTimer = void 0;
      }
      this.flushSnapshot();
      return;
    }
    if (!this.snapshotTimer) {
      this.snapshotTimer = setTimeout(() => {
        this.snapshotTimer = void 0;
        this.flushSnapshot();
      }, 16);
    }
  }
  flushSnapshot() {
    const view = this.view;
    if (!view?.visible) {
      return;
    }
    const folder = this.currentWorkspaceFolder();
    const state = folder ? this.stateFor(folder) : emptyState();
    const activeWorkspaceKey = folder ? workspaceKey(folder) : "";
    if (activeWorkspaceKey !== this.snapshotWorkspaceKey) {
      this.snapshotSync.markTranscriptChanged(0);
    }
    const contextMode = configuredSelectionMode();
    const snapshot = {
      ...state,
      workspace: folder?.name ?? "No workspace",
      contextMode,
      modelLabel: this.modelLabel(state),
      effortLabel: this.effortLabel(state),
      effortSupported: this.effortSupported(state),
      modelOptions: this.modelOptions(state),
      effortOptions: this.effortOptions(state),
      effortOptionId: this.effortOption(state)?.id,
      executionMode: this.executionMode(state),
      executionOptions: this.executionOptions(state),
      workMode: this.workMode(state),
      workModeOptions: this.workModeOptions(state),
      workModeOptionId: this.workModeOption(state)?.id ?? "legacy_work_mode",
      toolApprovalMode: this.toolApprovalMode(state),
      toolApprovalOptions: this.toolApprovalOptions(state),
      toolApprovalOptionId: this.toolApprovalOption(state)?.id ?? "legacy_tool_approval",
      cacheLabel: state.usage ? cacheBrief(state.usage) : void 0,
      locale: effectiveUiLocale(),
      uiLanguage: configuredUiLanguage(),
      settings: currentSettings(),
      sessions: folder ? state.sessions ?? this.sessionHistory(folder) : []
    };
    const { items, ...viewState } = snapshot;
    this.updateStatusBar(folder);
    this.snapshotWorkspaceKey = activeWorkspaceKey;
    void view.webview.postMessage(this.snapshotSync.next(viewState, items)).then((delivered) => {
      if (!delivered) {
        this.snapshotSync.requireFullSnapshot();
      }
    });
  }
  modelLabel(state) {
    const modelOption = configOptionByCategory(state.configOptions, "model");
    if (modelOption) {
      return modelOption.options.find((option) => option.value === modelOption.currentValue)?.name ?? modelOption.currentValue;
    }
    if (state.sessionModels) {
      return state.sessionModels.availableModels.find((model) => model.modelId === state.sessionModels?.currentModelId)?.name ?? state.sessionModels.currentModelId;
    }
    const configured = vscode5.workspace.getConfiguration("reasonix").get("model", "").trim();
    const current = this.currentModel(state);
    if (configured) {
      return configured;
    }
    if (current) {
      return current.ref;
    }
    return "Default model";
  }
  modelOptions(state) {
    const modelOption = configOptionByCategory(state.configOptions, "model");
    if (modelOption) {
      return modelOption.options.map((option) => ({
        value: option.value,
        label: option.name,
        description: option.description,
        selected: option.value === modelOption.currentValue
      }));
    }
    if (state.sessionModels) {
      return state.sessionModels.availableModels.map((model) => ({
        value: model.modelId,
        label: model.name,
        description: model.description,
        selected: model.modelId === state.sessionModels?.currentModelId
      }));
    }
    return [];
  }
  effortOption(state) {
    return configOptionByCategory(state.configOptions, "thought_level") ?? state.configOptions?.find((candidate) => candidate.id.toLowerCase().includes("effort"));
  }
  effortOptions(state) {
    const option = this.effortOption(state);
    return option?.options.map((value) => ({
      value: value.value,
      label: value.name,
      description: value.description,
      selected: value.value === option.currentValue
    })) ?? [];
  }
  executionMode(state) {
    const current = state.modes?.currentModeId;
    if (current === "normal" || current === "plan" || current === "goal") {
      return current;
    }
    if (current === "default" || current === "auto") {
      return state.executionMode ?? "normal";
    }
    return state.executionMode ?? "normal";
  }
  executionOptions(state) {
    const current = this.executionMode(state);
    const advertised = state.modes?.availableModes ?? [];
    const fallback = [
      { id: "normal", name: "Normal", description: "Work directly and pause when user input is required" },
      { id: "plan", name: "Plan", description: "Research and propose a plan before making changes" },
      { id: "goal", name: "Goal", description: "Keep advancing the next prompt as a goal until complete or blocked" }
    ];
    return fallback.map((mode) => {
      const native = advertised.find((candidate) => candidate.id === mode.id) ?? (mode.id === "normal" ? advertised.find((candidate) => candidate.id === "default") : void 0);
      return {
        value: mode.id,
        label: native?.name ?? mode.name,
        description: native?.description ?? mode.description,
        selected: mode.id === current
      };
    });
  }
  sessionModeId(state, mode) {
    const ids = new Set(state.modes?.availableModes.map((candidate) => candidate.id) ?? []);
    if (ids.has(mode)) {
      return mode;
    }
    if (mode === "normal" && ids.has("default")) {
      return "default";
    }
    return mode === "plan" && ids.has("plan") ? "plan" : void 0;
  }
  workModeOption(state) {
    return configOptionByCategory(state.configOptions, "work_mode") ?? configOptionByIds(state.configOptions, ["work_mode", "profile", "runtime_profile", "token_mode"]);
  }
  workMode(state) {
    const value = this.workModeOption(state)?.currentValue;
    if (value === "economy" || value === "balanced" || value === "delivery") {
      return value;
    }
    if (value === "full") {
      return "balanced";
    }
    return state.workMode ?? "balanced";
  }
  workModeOptions(state) {
    const option = this.workModeOption(state);
    const current = this.workMode(state);
    if (option) {
      return option.options.flatMap((candidate) => {
        const value = candidate.value === "full" ? "balanced" : candidate.value;
        if (value !== "economy" && value !== "balanced" && value !== "delivery") {
          return [];
        }
        return [{
          value,
          label: candidate.name,
          description: candidate.description,
          selected: value === current
        }];
      });
    }
    return [
      { value: "economy", label: "Economy", selected: current === "economy" },
      { value: "balanced", label: "Balanced", selected: current === "balanced" }
    ];
  }
  toolApprovalOption(state) {
    return configOptionByCategory(state.configOptions, "tool_approval") ?? configOptionByIds(state.configOptions, ["tool_approval", "approval", "approval_mode", "tool_approval_mode"]);
  }
  toolApprovalMode(state) {
    const value = this.toolApprovalOption(state)?.currentValue;
    if (value === "ask" || value === "auto" || value === "yolo") {
      return value;
    }
    if (state.modes?.currentModeId === "auto") {
      return "yolo";
    }
    return state.toolApprovalMode ?? "ask";
  }
  toolApprovalOptions(state) {
    const option = this.toolApprovalOption(state);
    const current = this.toolApprovalMode(state);
    const advertised = option?.options ?? [
      { value: "ask", name: "Ask" },
      { value: "auto", name: "Auto" },
      { value: "yolo", name: "Yolo" }
    ];
    return advertised.flatMap((candidate) => {
      if (candidate.value !== "ask" && candidate.value !== "auto" && candidate.value !== "yolo") {
        return [];
      }
      return [{
        value: candidate.value,
        label: candidate.name,
        description: candidate.description,
        selected: candidate.value === current
      }];
    });
  }
  effortLabel(state) {
    const option = this.effortOption(state);
    if (option) {
      return option.options.find((value) => value.value === option.currentValue)?.name ?? option.currentValue;
    }
    return this.currentModel(state)?.effort ?? "auto";
  }
  effortSupported(state) {
    const option = this.effortOption(state);
    if (option) {
      return option.options.length > 0;
    }
    const current = this.currentModel(state);
    return Boolean(current?.effortSupported && (current.effortLevels?.length ?? 0) > 0);
  }
  currentModel(state) {
    return this.currentModelFromList(state.models);
  }
  currentModelFromList(models) {
    const configured = vscode5.workspace.getConfiguration("reasonix").get("model", "").trim();
    return models?.find((model) => model.ref === configured) ?? models?.find((model) => model.current);
  }
  html(webview) {
    const nonce = getNonce();
    const scriptUri = webview.asWebviewUri(vscode5.Uri.joinPath(this.context.extensionUri, "media", "webview.js"));
    const styleUri = webview.asWebviewUri(vscode5.Uri.joinPath(this.context.extensionUri, "media", "styles.css"));
    const markUri = webview.asWebviewUri(vscode5.Uri.joinPath(this.context.extensionUri, "media", "mark.svg"));
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
  <link rel="stylesheet" href="${styleUri}">
  <title>Reasonix</title>
</head>
<body data-reasonix-mark-src="${markUri}">
  <div class="shell">
    <aside class="session-rail" aria-labelledby="sessionRailTitle">
      <div class="session-rail__brand">
        <img src="${markUri}" alt="" aria-hidden="true">
        <span>Reasonix</span>
      </div>
      <button id="railNewSession" class="rail-new-session" type="button">
        <span aria-hidden="true">+</span>
        <span id="railNewSessionLabel">New</span>
      </button>
      <div class="session-rail__heading" id="sessionRailTitle">Sessions</div>
      <div id="sessionRailList" class="session-rail__list"></div>
      <div class="session-rail__footer">
        <div class="rail-runtime">
          <span id="railStatusDot" class="status-dot"></span>
          <span id="railStatus">Idle</span>
        </div>
        <div id="railModel" class="rail-model">Model</div>
      </div>
    </aside>
    <section class="workbench">
      <header class="topbar">
      <div class="brand-stack">
        <div class="brand-title">REASONIX</div>
        <div class="brand-meta">
          <span id="statusDot" class="status-dot"></span>
          <span id="status" class="status">Idle</span>
          <span id="workspaceName" class="workspace-name"></span>
          <span id="toolbarMeta" class="toolbar-meta"></span>
        </div>
      </div>
      <div id="chatToolbarActions" class="top-actions">
        <button id="newSession" class="icon-button" title="New session" aria-label="New session" type="button">+</button>
        <button id="sessionMenu" class="icon-button" title="Recent sessions" aria-label="Recent sessions" type="button">Sessions</button>
        <button id="settingsButton" class="icon-button" title="Open settings" aria-label="Open settings" type="button">Settings</button>
      </div>
      <div id="settingsToolbarActions" class="top-actions settings-toolbar-actions" hidden>
        <span id="settingsModeTitle" class="settings-mode-title">Settings</span>
        <button id="settingsBackButton" class="primary-button" title="Done" aria-label="Done" type="button">Done</button>
      </div>
      <div id="sessionPopover" class="popover session-popover" hidden></div>
      </header>
      <main class="content">
        <div id="transcript" class="transcript"></div>
        <div id="settingsView" class="settings-view" hidden></div>
      </main>
      <form id="composer" class="composer">
      <div id="connectionNotice" class="connection-notice" role="status" aria-live="polite" hidden>
        <span class="connection-notice__indicator" aria-hidden="true"></span>
        <span id="connectionNoticeText" class="connection-notice__text">Reasonix is not connected</span>
        <div class="connection-notice__actions">
          <button id="connectionConnect" class="connection-notice__action connection-notice__action--primary" type="button">Connect</button>
          <button id="connectionSettings" class="connection-notice__action" type="button" hidden>Settings</button>
        </div>
      </div>
      <div id="attachmentTray" class="attachment-tray" aria-live="polite" hidden></div>
      <div class="input-wrap">
        <textarea id="prompt" rows="2" placeholder="Type your task here..."></textarea>
        <div id="composerHint" class="composer-hint">Type @ for context, / for slash command...</div>
        <div id="suggestionMenu" class="suggestion-menu" role="listbox" hidden></div>
        <button id="send" class="send-button" type="submit" aria-label="Send">\u2191</button>
      </div>
      <div class="composer-footer">
        <div class="context-control">
          <button id="contextButton" class="composer-control context-button" title="Add context" aria-label="Add context" aria-haspopup="menu" aria-expanded="false" aria-controls="contextMenu" type="button">+</button>
          <div id="contextMenu" class="popover context-menu" role="menu" hidden></div>
        </div>
        <div class="collaboration-control">
          <button id="collaborationButton" class="composer-select collaboration-button" title="Collaboration modes" aria-label="Collaboration modes" aria-haspopup="menu" aria-expanded="false" aria-controls="collaborationMenu" type="button">
            <span id="collaborationModeLabel" class="composer-select__label">Normal</span>
            <span class="composer-select__chevron" aria-hidden="true">\u2304</span>
          </button>
          <div id="modeChipTray" class="mode-chip-tray" aria-live="polite" hidden></div>
          <div id="collaborationMenu" class="popover collaboration-menu" role="menu" hidden></div>
        </div>
        <div class="work-mode-control">
          <button id="workModeButton" class="composer-select work-mode-button" title="Work mode" aria-label="Work mode" aria-haspopup="menu" aria-expanded="false" aria-controls="workModeMenu" type="button">
            <span id="workModeLabel" class="composer-select__label">Balanced</span>
            <span class="composer-select__chevron" aria-hidden="true">\u2304</span>
          </button>
          <div id="workModeMenu" class="popover collaboration-menu work-mode-menu" role="menu" hidden></div>
        </div>
        <div class="controls-control">
          <button id="approvalSummaryButton" class="composer-select approval-summary" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="controlsMenu">
            <span id="approvalSummaryLabel" class="composer-select__label">Ask</span>
            <span class="composer-select__chevron" aria-hidden="true">\u2304</span>
          </button>
          <div id="controlsMenu" class="popover controls-menu" hidden>
            <div class="controls-section">
              <div id="controlsApprovalLabel" class="controls-label">Tool approvals</div>
              <div id="approvalModebar" class="approval-menu" data-mode="ask" role="menu" aria-label="Tool approval mode">
                <button id="approvalAsk" class="approval-menu__item" type="button" role="menuitemradio" data-tool-approval-mode="ask">
                  <span class="approval-menu__check" aria-hidden="true">\u2713</span>
                  <span class="approval-menu__copy">
                    <span class="approval-menu__label" data-approval-mode-label></span>
                    <span class="approval-menu__detail" data-approval-mode-detail></span>
                  </span>
                </button>
                <button id="approvalAuto" class="approval-menu__item" type="button" role="menuitemradio" data-tool-approval-mode="auto">
                  <span class="approval-menu__check" aria-hidden="true">\u2713</span>
                  <span class="approval-menu__copy">
                    <span class="approval-menu__label" data-approval-mode-label></span>
                    <span class="approval-menu__detail" data-approval-mode-detail></span>
                  </span>
                </button>
                <button id="approvalYolo" class="approval-menu__item" type="button" role="menuitemradio" data-tool-approval-mode="yolo">
                  <span class="approval-menu__check" aria-hidden="true">\u2713</span>
                  <span class="approval-menu__copy">
                    <span class="approval-menu__label" data-approval-mode-label></span>
                    <span class="approval-menu__detail" data-approval-mode-detail></span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="runtime-control">
          <div class="runtime-option-control">
            <button id="runtimeModelButton" class="composer-select runtime-select runtime-model-button" title="Model" aria-label="Model" aria-haspopup="menu" aria-expanded="false" aria-controls="runtimeModelMenu" type="button">
              <span id="runtimeModelLabel" class="composer-select__label">Model</span>
              <span class="composer-select__chevron" aria-hidden="true">\u2304</span>
            </button>
            <div id="runtimeModelMenu" class="popover runtime-option-menu" hidden></div>
          </div>
          <div class="runtime-option-control">
            <button id="runtimeEffortButton" class="composer-select runtime-select runtime-effort-button" title="Reasoning effort" aria-label="Reasoning effort" aria-haspopup="menu" aria-expanded="false" aria-controls="runtimeEffortMenu" type="button">
              <span id="runtimeEffortLabel" class="composer-select__label">auto</span>
              <span class="composer-select__chevron" aria-hidden="true">\u2304</span>
            </button>
            <div id="runtimeEffortMenu" class="popover runtime-option-menu" hidden></div>
          </div>
        </div>
      </div>
      </form>
    </section>
  </div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }
  currentWorkspaceFolder() {
    const editor = vscode5.window.activeTextEditor;
    if (editor) {
      const folder = vscode5.workspace.getWorkspaceFolder(editor.document.uri);
      if (folder) {
        return folder;
      }
    }
    return vscode5.workspace.workspaceFolders?.[0];
  }
  stateFor(folder) {
    const key = workspaceKey(folder);
    let state = this.states.get(key);
    if (!state) {
      state = emptyState();
      this.states.set(key, state);
    }
    return state;
  }
  sessionStorageKey(folder) {
    return `reasonix.session.${workspaceKey(folder)}`;
  }
  sessionHistoryKey(folder) {
    return `reasonix.sessionHistory.${workspaceKey(folder)}`;
  }
  sessionHistory(folder) {
    const raw = this.context.workspaceState.get(this.sessionHistoryKey(folder));
    if (!Array.isArray(raw)) {
      return [];
    }
    return raw.filter(isSessionSummary).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 12);
  }
  async rememberSession(folder, sessionId, title) {
    const normalizedTitle = title.trim() || "New session";
    const now = Date.now();
    const history = this.sessionHistory(folder).filter((entry) => entry.id !== sessionId);
    history.unshift({ id: sessionId, title: normalizedTitle, updatedAt: now });
    await this.context.workspaceState.update(this.sessionHistoryKey(folder), history.slice(0, 12));
  }
  async updateCurrentSessionTitle(folder, prompt) {
    const state = this.stateFor(folder);
    const sessionId = state.sessionId ?? this.clients.get(workspaceKey(folder))?.id;
    if (!sessionId) {
      return;
    }
    const title = state.sessionTitle && state.sessionTitle !== "New session" ? state.sessionTitle : titleFromPrompt(prompt);
    state.sessionId = sessionId;
    state.sessionTitle = title;
    await this.rememberSession(folder, sessionId, title);
  }
  updateStatusBar(folder) {
    if (!folder) {
      this.statusBar.text = "$(sparkle) Reasonix";
      this.statusBar.tooltip = "Open a workspace folder to use Reasonix.";
      return;
    }
    const state = this.stateFor(folder);
    const visibleStatus = state.disconnected ? "Disconnected" : state.status;
    const usage = state.usage;
    const denom = usage ? usage.sessionCacheHitTokens + usage.sessionCacheMissTokens : 0;
    const hitRate = usage && denom > 0 ? Math.round(usage.sessionCacheHitTokens / denom * 100) : void 0;
    this.statusBar.text = hitRate === void 0 ? `$(sparkle) Reasonix: ${visibleStatus}` : `$(sparkle) Reasonix cache ${hitRate}%`;
    const tooltip = [`Reasonix ${folder.name}`, visibleStatus];
    if (usage) {
      tooltip.push(`Tokens: ${usage.totalTokens}`);
    }
    if (hitRate !== void 0) {
      tooltip.push(`Session cache: ${hitRate}%`);
    }
    this.statusBar.tooltip = tooltip.join("\n");
  }
  appendOutput(value, folder) {
    this.output.appendLine(redactLocalPaths(value, folder?.uri.fsPath));
  }
};
async function resolveReasonixBinary() {
  const configured = vscode5.workspace.getConfiguration("reasonix").get("binaryPath", "").trim();
  if (configured !== "") {
    return await normalizeReasonixPath(configured);
  }
  const command = process.platform === "win32" ? "where" : "which";
  try {
    const { stdout } = await execFileAsync(command, ["reasonix"]);
    const resolved = selectReasonixPath(stdout);
    if (resolved) {
      return await normalizeReasonixPath(resolved);
    }
  } catch {
  }
  const action = await vscode5.window.showErrorMessage(
    "Reasonix CLI was not found on PATH. Select an installed binary or follow the Reasonix installation guide.",
    "Select Binary",
    "Installation Guide",
    "Open Settings"
  );
  if (action === "Select Binary") {
    return await selectReasonixBinary();
  }
  if (action === "Installation Guide") {
    await vscode5.env.openExternal(vscode5.Uri.parse("https://github.com/esengine/DeepSeek-Reasonix#installation"));
  } else if (action === "Open Settings") {
    await vscode5.commands.executeCommand("workbench.action.openSettings", "reasonix.binaryPath");
  }
  return void 0;
}
async function selectReasonixBinary() {
  const picked = await vscode5.window.showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    openLabel: "Use Reasonix CLI",
    title: "Select the Reasonix executable"
  });
  const selected = picked?.[0]?.fsPath;
  if (!selected) {
    return void 0;
  }
  await vscode5.workspace.getConfiguration("reasonix").update("binaryPath", selected, vscode5.ConfigurationTarget.Global);
  return await normalizeReasonixPath(selected);
}
function workspaceKey(folder) {
  return folder.uri.toString();
}
function isFileResourceUri(uri) {
  return uri.scheme === "file" || uri.scheme === "vscode-remote";
}
function mentionTokenForPath(relativePath, isDirectory) {
  if (relativePath === "") {
    return "./";
  }
  const encoded = relativePath.split("/").map(encodeURIComponent).join("/");
  const token = relativePath.includes("/") || relativePath.includes(".") ? encoded : `./${encoded}`;
  return isDirectory ? `${token}/` : token;
}
function emptyState() {
  return { items: [], running: false, disconnected: true, status: "Disconnected", mcp: { connected: [], configured: [], disconnected: [] } };
}
function currentSettings() {
  const config = vscode5.workspace.getConfiguration("reasonix");
  const includeSelectionMode = configuredSelectionMode();
  return {
    binaryPath: config.get("binaryPath", ""),
    model: config.get("model", ""),
    uiLanguage: configuredUiLanguage(),
    autoStart: config.get("autoStart", false),
    trace: config.get("trace", false),
    includeSelectionMode
  };
}
function configuredUiLanguage() {
  const value = vscode5.workspace.getConfiguration("reasonix").get("uiLanguage", "auto");
  return value === "en" || value === "zh-CN" || value === "auto" ? value : "auto";
}
function effectiveUiLocale() {
  const language = configuredUiLanguage();
  return language === "auto" ? vscode5.env.language : language;
}
function cacheBrief(usage) {
  const total = usage.sessionCacheHitTokens + usage.sessionCacheMissTokens;
  if (total <= 0) {
    return void 0;
  }
  return `cache ${Math.round(usage.sessionCacheHitTokens / total * 100)}%`;
}
function configOptionByCategory(options, category) {
  return options?.find((option) => option.category === category);
}
function configOptionByIds(options, ids) {
  const accepted = new Set(ids);
  return options?.find((option) => accepted.has(option.id));
}
function matchesAvailableCommand(prompt, commands4) {
  const match = /^\s*\/([A-Za-z0-9_-]+)/.exec(prompt);
  return match !== null && commands4?.some((command) => command.name.toLowerCase() === match[1]?.toLowerCase()) === true;
}
function titleFromPrompt(prompt) {
  const compact = prompt.replace(/\s+/g, " ").trim();
  if (compact === "") {
    return "New session";
  }
  return compact.length > 58 ? `${compact.slice(0, 55)}...` : compact;
}
function promptWithLegacyComposerModes(prompt, collaborationMode, tokenMode, supportsGoalMode, supportsWorkMode) {
  const prefixes = [];
  if (collaborationMode === "goal" && !supportsGoalMode) {
    prefixes.push("Goal mode: treat this as a concrete goal. Keep working toward completion, stop when blocked, and call out the next required user decision clearly.");
  }
  if (tokenMode === "economy" && !supportsWorkMode) {
    prefixes.push("Token economy mode: keep the initial approach lean, avoid loading broad context unless needed, and prefer focused reads/searches before expanding scope.");
  }
  return prefixes.length === 0 ? prompt : [...prefixes, "", prompt].join("\n");
}
function permissionModeNotice(mode) {
  switch (mode) {
    case "ask":
      return "Approval requested";
    case "auto":
      return "Auto-approved";
    case "yolo":
      return "Yolo auto-approved";
  }
}
function isSessionSummary(value) {
  if (!isRecord5(value)) {
    return false;
  }
  return typeof value.id === "string" && typeof value.title === "string" && typeof value.updatedAt === "number";
}
function permissionNotification(params) {
  const lines = [`Reasonix wants to run ${params.toolCall.title ?? "a tool"}.`];
  if (params.toolCall.preview) {
    lines.push(`${params.toolCall.preview.path} (+${params.toolCall.preview.added} -${params.toolCall.preview.removed})`);
  }
  return lines.join(" ");
}
function getNonce() {
  return (0, import_node_crypto.randomBytes)(24).toString("base64url").slice(0, 32);
}
function errorMessage2(err) {
  return err instanceof Error ? err.message : String(err);
}
function isRecord5(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function assertNever(value) {
  throw new Error(`Unhandled message: ${JSON.stringify(value)}`);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
