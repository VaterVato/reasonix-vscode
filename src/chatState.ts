import type { ChangePreview, PermissionRequestParams, PlanEntry, SessionUpdate, ToolCallLocation, UsageData } from "./acpTypes";

export type ChatItem =
  | {
      type: "message";
      role: "user" | "assistant" | "thought" | "notice";
      text: string;
    }
  | {
      type: "tool";
      id: string;
      title: string;
      kind: string;
      status: string;
      rawInput?: unknown;
      preview?: ChangePreview;
      content?: string;
      locations?: ToolCallLocation[];
    }
  | {
      type: "usage";
      usage: UsageData;
    }
  | {
      type: "approval";
      id: string;
      title: string;
      kind: string;
      rawInput?: unknown;
      preview?: ChangePreview;
      options: Array<{ optionId: string; name: string; kind: string }>;
      status: "pending" | "selected" | "cancelled";
    }
  | {
      type: "question";
      id: string;
      title: string;
      detail?: string;
      options: Array<{ optionId: string; name: string }>;
      status: "pending" | "selected" | "cancelled";
    }
  | {
      type: "plan";
      entries: PlanEntry[];
    };

export function appendUserMessage(items: ChatItem[], text: string): number {
  return items.push({ type: "message", role: "user", text }) - 1;
}

export function appendNotice(items: ChatItem[], text: string): number {
  return items.push({ type: "message", role: "notice", text }) - 1;
}

export function appendApproval(items: ChatItem[], params: PermissionRequestParams): number {
  if (isQuestionRequest(params)) {
    const detail = params.toolCall.content?.map((part) => contentText(part.content)).filter(Boolean).join("\n");
    return items.push({
      type: "question",
      id: params.toolCall.toolCallId,
      title: params.toolCall.title ?? "Question",
      ...(detail ? { detail } : {}),
      options: params.options
        .filter((option) => !option.optionId.endsWith(":cancel") && !option.kind.startsWith("reject"))
        .map((option) => ({ optionId: option.optionId, name: option.name })),
      status: "pending",
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
    status: "pending",
  }) - 1;
}

export function resolveApproval(items: ChatItem[], id: string, selected: boolean): number | undefined {
  const index = items.findIndex((candidate) =>
    (candidate.type === "approval" || candidate.type === "question") && candidate.id === id);
  const item = items[index];
  if (item?.type === "approval" || item?.type === "question") {
    items[index] = { ...item, status: selected ? "selected" : "cancelled" };
    return index;
  }
  return undefined;
}

export function applySessionUpdate(items: ChatItem[], update: SessionUpdate): number | undefined {
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
          ...(update.preview !== undefined ? { preview: update.preview } : {}),
          ...(update.locations !== undefined ? { locations: update.locations } : {}),
        };
        return index;
      }
      const toolItem: Extract<ChatItem, { type: "tool" }> = {
        type: "tool",
        id: update.toolCallId,
        title: update.title ?? update.toolCallId,
        kind: update.kind ?? "other",
        status: update.status ?? "pending",
        rawInput: update.rawInput,
        ...(update.locations ? { locations: update.locations } : {}),
      };
      if (update.preview !== undefined) {
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
        content: text,
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

function appendChunk(items: ChatItem[], role: "user" | "assistant" | "thought", text: string): number | undefined {
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

export function isQuestionRequest(params: PermissionRequestParams): boolean {
  return params.toolCall.toolCallId.startsWith("ask-")
    || (isRecord(params.toolCall.rawInput) && typeof params.toolCall.rawInput.question === "string");
}

function contentText(content: import("./acpTypes").ContentBlock): string {
  if (content.type === "text") {
    return content.text;
  }
  return content.type === "image" ? "[image]" : content.resource.text ?? "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
