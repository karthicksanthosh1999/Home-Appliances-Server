module.exports = {
  apps: [
    {
      name: "Demo_CRM_Back",
      script: "./dist/server.js",
      instances: "1",
      exec_mode: "cluster",
      max_memory_restart: "300M",
      node_args: "--max_old_space_size=16000", // Set max old space size to 16GB
      // Logging
      log: "./log/combined.outerr0.log",
      output: "./log/pm2/out.log",
      error: "./log/pm2/error.log",
      log_date_format: "YYYY-MM-DD HH:mm Z", // Timestamp for logs
      // log_type: "json",                    // Log the data as json
      env_development: {
        NODE_ENV: "development",
        PORT: 4050,
        watch: true,
        watch_delay: 3000,
        ignore_watch: [
          "./node_modules",
          "./views",
          "./public",
          "./.DS_Store",
          "./package.json",
          "./yarn.lock",
          "./samples",
          "./src",
          ".git",
          "node_modules",
          "log",
          "log/",
          ".node-gyp",
          ".node-gyp/",
          ".pm2",
          ".pm2/",
          "public",
          "public/",
          "xml_file/*",
          ".git",
        ],
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 4050,
        exec_mode: "cluster_mode",
      },
    },
    // {
    //   name: 'worker',
    //   script: 'worker.js'
    // }
  ],
  logrotate: {
    enabled: true,
    max_size: "10M", // Rotate when log file size exceeds 10MB
    retain: 5, // Keep only 5 log files (old logs will be deleted)
    filePath: "log/pm2", // Directory path for log files
    compress: true, // Compress rotated logs to save space
    workerInterval: 60, // Check every 60 seconds for log rotation
    rotateInterval: "0 0   *", // Rotate daily at midnight
    rotateModule: true, // Enable log rotation for all PM2 apps
    dateFormat: "YYYY-MM-DD_HH-mm-ss", // Date format for log filenames
  },
};
