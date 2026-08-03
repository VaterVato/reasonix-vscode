export type TranscriptSplice<T> = {
  start: number;
  deleteCount: number;
  items: T[];
};

export type SnapshotMessage<S, T> = {
  type: "stateSnapshot";
  revision: number;
  state: S & { items: T[] };
};

export type PatchMessage<S, T> = {
  type: "statePatch";
  revision: number;
  state: S;
  transcript?: TranscriptSplice<T>;
};

export type SyncMessage<S, T> = SnapshotMessage<S, T> | PatchMessage<S, T>;

export class SnapshotSync<T> {
  private revision = 0;
  private sentTranscriptLength = 0;
  private dirtyTranscriptStart: number | undefined;
  private fullSnapshotRequired = true;

  reset(): void {
    this.revision = 0;
    this.sentTranscriptLength = 0;
    this.dirtyTranscriptStart = undefined;
    this.fullSnapshotRequired = true;
  }

  requireFullSnapshot(): void {
    this.fullSnapshotRequired = true;
  }

  markTranscriptChanged(start: number | undefined): void {
    if (start === undefined || !Number.isInteger(start) || start < 0) {
      return;
    }
    this.dirtyTranscriptStart = this.dirtyTranscriptStart === undefined
      ? start
      : Math.min(this.dirtyTranscriptStart, start);
  }

  next<S extends object>(state: S, items: T[]): SyncMessage<S, T> {
    this.revision += 1;
    if (this.fullSnapshotRequired) {
      this.fullSnapshotRequired = false;
      this.dirtyTranscriptStart = undefined;
      this.sentTranscriptLength = items.length;
      return {
        type: "stateSnapshot",
        revision: this.revision,
        state: { ...state, items: items.slice() },
      };
    }

    let start = this.dirtyTranscriptStart;
    if (start === undefined && items.length !== this.sentTranscriptLength) {
      start = Math.min(items.length, this.sentTranscriptLength);
    }
    const message: PatchMessage<S, T> = {
      type: "statePatch",
      revision: this.revision,
      state,
    };
    if (start !== undefined) {
      const safeStart = Math.min(start, items.length, this.sentTranscriptLength);
      message.transcript = {
        start: safeStart,
        deleteCount: this.sentTranscriptLength - safeStart,
        items: items.slice(safeStart),
      };
    }
    this.dirtyTranscriptStart = undefined;
    this.sentTranscriptLength = items.length;
    return message;
  }
}

export function applyTranscriptSplice<T>(items: T[], splice: TranscriptSplice<T>): boolean {
  if (
    !Number.isInteger(splice.start)
    || !Number.isInteger(splice.deleteCount)
    || splice.start < 0
    || splice.deleteCount < 0
    || splice.start > items.length
    || splice.start + splice.deleteCount > items.length
  ) {
    return false;
  }
  items.splice(splice.start, splice.deleteCount, ...splice.items);
  return true;
}

export function transcriptWindowStart(length: number, windowSize: number): number {
  if (!Number.isInteger(length) || !Number.isInteger(windowSize) || length <= 0 || windowSize <= 0) {
    return 0;
  }
  return Math.max(0, length - windowSize);
}
