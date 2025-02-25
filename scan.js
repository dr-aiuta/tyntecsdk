const fs = require('fs');
const path = require('path');
const ignore = require('ignore');

// Use a command-line argument or default to the current working directory
const folderPath = process.argv[2] || process.cwd();

// Check for the '--tree' flag to determine the output mode
const useTreeMode = process.argv.includes('--tree');

// Load the .gitignore file if it exists in the root of the target folder
const gitignoreFile = path.join(folderPath, '.gitignore');
let ig = ignore();
if (fs.existsSync(gitignoreFile)) {
  const gitignoreContent = fs.readFileSync(gitignoreFile, 'utf8');
  ig = ig.add(gitignoreContent);
}

// Always ignore the .git folder, even if it isn't in .gitignore
ig.add('.git');

/**
 * Recursively scans the directory and logs files/folders that are not ignored,
 * printing each file/folder's relative path (list mode).
 * @param {string} currentDir - The directory to scan.
 * @param {string} baseDir - The base directory for relative paths.
 */
function scanDirList(currentDir, baseDir) {
  fs.readdir(currentDir, { withFileTypes: true }, (err, entries) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }
    entries.forEach(entry => {
      // Skip .git folder immediately
      if (entry.name === '.git') return;

      const fullPath = path.join(currentDir, entry.name);
      const relPath = path.relative(baseDir, fullPath);

      // Skip if the file/folder is ignored
      if (ig.ignores(relPath)) return;

      console.log(relPath);

      // If the entry is a directory, scan it recursively.
      if (entry.isDirectory()) {
        scanDirList(fullPath, baseDir);
      }
    });
  });
}

/**
 * Recursively scans the directory and prints a tree-like structure.
 * Uses synchronous file system methods for simplicity.
 *
 * @param {string} currentDir - The directory to scan.
 * @param {string} baseDir - The base directory for relative paths.
 * @param {string} prefix - The prefix string used for tree formatting.
 */
function scanDirTree(currentDir, baseDir, prefix = '') {
  let entries = fs.readdirSync(currentDir, { withFileTypes: true });

  // Filter out entries ignored by .gitignore or .git rules.
  entries = entries.filter(entry => {
    if (entry.name === '.git') return false;
    const fullPath = path.join(currentDir, entry.name);
    const relPath = path.relative(baseDir, fullPath);
    return !ig.ignores(relPath);
  });

  // Sort entries alphabetically for consistent output.
  entries.sort((a, b) => a.name.localeCompare(b.name));

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    const branch = isLast ? '└── ' : '├── ';
    console.log(prefix + branch + entry.name);

    // If the entry is a directory, update the prefix and recursively scan.
    if (entry.isDirectory()) {
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      const fullPath = path.join(currentDir, entry.name);
      scanDirTree(fullPath, baseDir, newPrefix);
    }
  });
}

// Start scanning with the appropriate mode
if (useTreeMode) {
  // Print the root folder name first
  console.log(path.basename(folderPath));
  scanDirTree(folderPath, folderPath);
} else {
  scanDirList(folderPath, folderPath);
}