export type MarkdownBlock =
  | { kind: "code"; language: string; text: string }
  | { kind: "unorderedList"; items: string[] }
  | { kind: "orderedList"; items: string[] }
  | { kind: "heading"; level: 1 | 2 | 3; text: string }
  | { kind: "paragraph"; text: string };

type Fence = {
  marker: "`" | "~";
  length: number;
  language: string;
};

export function parseMarkdownBlocks(text: string): MarkdownBlock[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";
    if (line.trim() === "") {
      index += 1;
      continue;
    }

    const fence = openingFence(line);
    if (fence) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !isClosingFence(lines[index] ?? "", fence)) {
        code.push(lines[index] ?? "");
        index += 1;
      }
      if (index < lines.length) {
        index += 1;
      }
      blocks.push({ kind: "code", language: fence.language, text: code.join("\n") });
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*[-*]\s+/.test(lines[index] ?? "")) {
        items.push((lines[index] ?? "").replace(/^\s*[-*]\s+/, ""));
        index += 1;
      }
      blocks.push({ kind: "unorderedList", items });
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index] ?? "")) {
        items.push((lines[index] ?? "").replace(/^\s*\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push({ kind: "orderedList", items });
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      blocks.push({
        kind: "heading",
        level: heading[1]?.length as 1 | 2 | 3,
        text: heading[2] ?? "",
      });
      index += 1;
      continue;
    }

    const paragraph: string[] = [];
    do {
      paragraph.push(lines[index] ?? "");
      index += 1;
    } while (index < lines.length && !startsBlock(lines[index] ?? ""));
    blocks.push({ kind: "paragraph", text: paragraph.join("\n") });
  }

  return blocks;
}

function startsBlock(line: string): boolean {
  return line.trim() === ""
    || openingFence(line) !== undefined
    || /^\s*[-*]\s+/.test(line)
    || /^\s*\d+\.\s+/.test(line)
    || /^(#{1,3})\s+/.test(line);
}

function openingFence(line: string): Fence | undefined {
  const match = line.match(/^\s{0,3}(`{3,}|~{3,})(.*)$/);
  if (!match) {
    return undefined;
  }
  const run = match[1] ?? "";
  const info = (match[2] ?? "").trim();
  return {
    marker: run[0] as "`" | "~",
    length: run.length,
    language: info.split(/\s+/, 1)[0] ?? "",
  };
}

function isClosingFence(line: string, fence: Fence): boolean {
  const match = line.match(/^\s{0,3}(`{3,}|~{3,})\s*$/);
  const run = match?.[1] ?? "";
  return run.startsWith(fence.marker) && run.length >= fence.length;
}
