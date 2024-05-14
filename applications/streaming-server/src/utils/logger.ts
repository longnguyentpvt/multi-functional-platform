interface LogEntry {
  timestamp: Date;
  level: "debug" | "info" | "warn" | "error";
  message: string;
  metadata?: unknown;
}

class Logger {
  private logEntries: LogEntry[];

  constructor() {
    this.logEntries = [];
  }

  private log(level: "debug" | "info" | "warn" | "error", message: string, metadata?: unknown): void {
    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      metadata
    };

    this.logEntries.push(logEntry);
    this.printLogEntry(logEntry);
  }

  debug(message: string, metadata?: unknown): void {
    this.log("debug", message, metadata);
  }

  info(message: string, metadata?: unknown): void {
    this.log("info", message, metadata);
  }

  warn(message: string, metadata?: unknown): void {
    this.log("warn", message, metadata);
  }

  error(message: string, metadata?: unknown): void {
    this.log("error", message, metadata);
  }

  private printLogEntry(logEntry: LogEntry): void {
    const {
      timestamp, level, message, metadata
    } = logEntry;
    const formattedTimestamp = timestamp.toISOString();
    const metadataString = metadata ? JSON.stringify(metadata) : "";

    console.log(`[${ formattedTimestamp }] [${ level.toUpperCase() }] ${ message } ${ metadataString }`);
  }
}

export default new Logger();
