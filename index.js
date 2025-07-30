const fs = require('fs');
const path = require('path');

/**
 * List of files and folders to exclude from output.
 */
const skipList = new Set([
    'index.js',
    '.idea',
    '.vscode',
    '.git',
    'node_modules',
    '.next',
    'lib',
    'libs',
    '.DS_Store'
]);

/**
 * Display usage/help information.
 */
function showHelpHandler() {
    console.log(`
Usage: node index.js [path] [options]

Options:
  -F, --with-files     Show folders and files
  -D, --folders-only   Show folders only (default)
  -h, --help           Show this help message

Examples:
  node index.js ./project         Show help by default if no flags given
  node index.js ./project -F      Folders and files
  node index.js ./project -D      Folders only
  `);
}

/**
 * Recursively prints the sorted directory structure.
 *
 * @param {string} dirPath - Directory path
 * @param {number} level - Current nesting level
 * @param {boolean} includeFiles - Whether to display files
 */
function printStructure(dirPath, level = 0, includeFiles = false) {
    let entries;
    try {
        entries = fs.readdirSync(dirPath, { withFileTypes: true });
    } catch (err) {
        console.error(`Failed to read directory: ${dirPath}`, err.message);
        return;
    }

    // Filter and sort entries
    const filtered = entries.filter(entry => !skipList.has(entry.name));

    const dirs = filtered
        .filter(entry => entry.isDirectory())
        .sort((a, b) => a.name.localeCompare(b.name));

    const files = includeFiles
        ? filtered
            .filter(entry => entry.isFile())
            .sort((a, b) => a.name.localeCompare(b.name))
        : [];

    // Output directories
    for (const dir of dirs) {
        console.log('  '.repeat(level) + dir.name);
        const fullPath = path.join(dirPath, dir.name);
        printStructure(fullPath, level + 1, includeFiles);
    }

    // Output files
    for (const file of files) {
        console.log('  '.repeat(level) + '- ' + file.name);
    }
}

/**
 * Parses command-line arguments.
 *
 * @returns {{ path: string, includeFiles: boolean, showHelp: boolean }}
 */
function parseArgs() {
    const args = process.argv.slice(2);
    let targetPath = '.';
    let includeFiles = false;
    let helpRequested = args.length === 0;

    for (const arg of args) {
        if (arg === '--help' || arg === '-h') {
            helpRequested = true;
        } else if (arg === '--with-files' || arg === '-F') {
            includeFiles = true;
            helpRequested = false;
        } else if (arg === '--folders-only' || arg === '-D') {
            includeFiles = false;
            helpRequested = false;
        } else if (!arg.startsWith('-')) {
            targetPath = arg;
        }
    }

    return { path: targetPath, includeFiles, showHelp: helpRequested };
}

// Entry point
(() => {
    const { path: inputPath, includeFiles, showHelp } = parseArgs();

    if (showHelp) {
        showHelpHandler();
        return;
    }

    if (fs.existsSync(inputPath)) {
        printStructure(inputPath, 0, includeFiles);
    } else {
        console.error(`Path does not exist: ${inputPath}`);
    }
})();
