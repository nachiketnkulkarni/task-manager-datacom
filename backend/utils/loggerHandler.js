const logger = {
  info: (message, meta) => {
    console.log(`[INFO] ${message}`, meta || "");
  },
  error: (message, meta) => {
    console.error(`[ERROR] ${message}`, meta || "");
  },
};

export default logger;
