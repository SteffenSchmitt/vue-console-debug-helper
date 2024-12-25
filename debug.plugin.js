const CONFIG = {
    regex: {
        stackTrace: /(?:file|http|https|\/)([^\/]+\.vue|[^\/]+\.js)/,
        jsLineNumber: /.*:(\d+):(\d+)$/,
        vueLineNumber: /.*:(\d+):\d+\)/,
        url: /http[s]?:\/\/[^\s]+/,
    },
    defaults: {
        unknownFile: "Unknown file",
        unknownLineNumber: "0000",
        prefixes: {
            js: "JS",
            vue: "VUE",
            file: "FILE",
        },
    },
    styles: {
        file: {
            js: 'color: lightblue; font-weight: bold;',
            vue: 'color: green; font-weight: bold;',
        },
        prefix: {
            js: 'color: lightblue; font-weight: bold;',
            vue: 'color: green; font-weight: bold;',
        },
        common: {
            line: 'color: lightblue;',
            message: 'color: white;',
        },
    },
    indent: {
        short: '\t\t',
        long: '\t\t\t',
    },
    labels: {
        url: "[URL]",
        type: "[TYPE]",
        content: "[CONTENT]",
        debug: "[DEBUG]",
        objectOrArray: "[OBJECT OR ARRAY]",
    },
    suppressedConsoleMethods: ["log", "warn", "error", "info", "debug"],    // Liste der unterdrückten Console-Methoden
    environmentModes: ["development"],                                      // Beispiel: Nur im "development"-Modus wird die Konsole aktiv
};

let asciiSmileDisplayed = false;

function displayAsciiSmile() {
    if (!asciiSmileDisplayed) {
        console.log(`
      _.-'''''-._
    .'  _     _  '.
   /   (_)   (_)   \\
  |  ,           ,  |
  |  \\'.       .'\\  |
   \\  '.\`'""'"'.'/  /
    '.  \\       /  .'
      '-.......-'
      ;) Simply don't!
    `);
        asciiSmileDisplayed = true;
    }
}

function redirectConsoleMethods() {
    const originalMethods = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.info,
        debug: console.debug,
    };

    const silentMethod = (...args) => {
        if (!asciiSmileDisplayed) {
            displayAsciiSmile();
        }
        // Umleitung auf debug
        debug(args, true);
    };

    Object.keys(originalMethods).forEach((method) => {
        if (CONFIG.suppressedConsoleMethods.includes(method)) {
            console[method] = silentMethod;
        }
    });
}

function suppressConsoleMethods() {
    /// Mode check
    if (!CONFIG.environmentModes.includes(import.meta.env.MODE)) {
        redirectConsoleMethods();
    }
}

function parseStackTrace(callerLine) {
    const match = callerLine.match(CONFIG.regex.stackTrace);
    return match ? match[1] : CONFIG.defaults.unknownFile;
}

function extractLineInfo(callerLine) {
    const { jsLineNumber, vueLineNumber } = CONFIG.regex;
    const jsMatch = callerLine.match(jsLineNumber);
    const vueMatch = callerLine.match(vueLineNumber);

    if (jsMatch) {
        return { prefix: CONFIG.defaults.prefixes.js, lineNumber: jsMatch[1] };
    } else if (vueMatch) {
        return { prefix: CONFIG.defaults.prefixes.vue, lineNumber: vueMatch[1] };
    } else {
        return { prefix: CONFIG.defaults.prefixes.file, lineNumber: CONFIG.defaults.unknownLineNumber };
    }
}

function extractUrl(callerLine) {
    const match = callerLine.match(CONFIG.regex.url);
    return match ? match[0] : null;
}

function isStringable(value) {
    return (
        value !== null &&
        value !== undefined &&
        (typeof value === "string" || typeof value.toString === "function") &&
        !Array.isArray(value)
    );
}

function getStylesByPrefix(prefix) {
    return prefix === CONFIG.defaults.prefixes.vue
        ? { file: CONFIG.styles.file.vue, prefix: CONFIG.styles.prefix.vue }
        : { file: CONFIG.styles.file.js, prefix: CONFIG.styles.prefix.js };
}

export function debug(message, verbose = true) {
    // Überprüfe, ob der aktuelle Modus im environmentModes Array enthalten ist
    if (!CONFIG.environmentModes.includes(import.meta.env.MODE)) {
        displayAsciiSmile();
        return;
    }

    const stack = new Error().stack;
    const callerLine = stack.split("\n")[2];
    const fileName = parseStackTrace(callerLine);
    const { prefix, lineNumber } = extractLineInfo(callerLine);
    const url = extractUrl(callerLine);

    const styles = getStylesByPrefix(prefix);
    const isMessageStringable = isStringable(message);

    const { labels, indent } = CONFIG;

    const title = isMessageStringable
        ? `${labels.debug} [${prefix}] [${fileName}:${lineNumber}]${indent.short}${message}`
        : `${labels.debug} [${prefix}] [${fileName}:${lineNumber}]${indent.short}${labels.objectOrArray}`;

    console.groupCollapsed(title);

    if (url) {
        console.log(`%c${labels.url}${indent.long}%c${url}`, CONFIG.styles.common.message, styles.prefix);
    }

    const messageType = Array.isArray(message) ? "Array" : typeof message;
    console.log(`%c${labels.type}${indent.long}%c${messageType}`, CONFIG.styles.common.message, styles.prefix);

    if (isMessageStringable) {
        console.log(`%c${labels.content}${indent.short}%c${message}`, CONFIG.styles.common.message, styles.prefix);
    } else {
        console.log(`%c${labels.content}${indent.short}%c${labels.objectOrArray}`, CONFIG.styles.common.message, styles.prefix);
        console.dir(message); // Ausgabe komplexer Objekte
    }

    console.groupEnd();
}

if (!CONFIG.environmentModes.includes(import.meta.env.MODE)) {
    displayAsciiSmile();
    suppressConsoleMethods();
}

export default {
    install(app) {
        app.config.globalProperties.$debug = debug;
    },
};
