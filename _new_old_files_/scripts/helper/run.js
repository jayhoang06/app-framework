/**
 * Runs non-interactive child process with callback
 * @param {(string|string[])} command - The command to run.
 * @param {function} [callback] - The callback function. Will be called with
 *                                two arguments {error/null} error and
 *                                {string/null} data.
 */

// Import modules
const cp = require('child_process');

// Create function
const run = (command, callback) => {
  // Check arguments
  if (typeof command !== 'string' && !Array.isArray(command)) {
    throw new Error('First argument should be a string or an array');
  }
  if (typeof callback !== 'function' && typeof callback !== 'undefined') {
    throw new Error('Second argument should be a function or undefined');
  }

  // Return if command is empty
  if (command.length === 0) {
    if (typeof callback === 'function') callback(null, undefined);
    return;
  }

  // Exec child process
  const exec = cp.exec(typeof command === 'string' ? command : command.join(' '));

  // Remember data
  const allData = [];
  exec.stdout.on('data', data => allData.push(data));
  exec.stderr.on('data', data => allData.push(data));

  // Callback on close
  exec.on('close', (code) => {
    const error = code > 0 ? new Error(`Process failed with exit code ${code}`) : null;
    const data = allData.join('\n').replace(/^(\n| )(.+)/, '$2').replace(/(.+)(\n| )$/, '$1');
    callback(error, data);
  });
};

// Export function
module.exports = run;