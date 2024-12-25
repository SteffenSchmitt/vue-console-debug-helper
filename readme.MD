# Vue Debug Plugin

Ein einfaches, aber leistungsstarkes Debugging-Plugin für Vue 3-Anwendungen, das in Verbindung mit Vite verwendet werden kann. Es bietet erweiterte Funktionen zum Loggen von Informationen in der Konsole, inklusive detaillierter Dateiinformationen, Zeilenangaben und einer anpassbaren Ausgabe. Außerdem werden alle Konsolenmethoden wie `console.log`, `console.warn` und andere im Entwicklungsmodus umgeleitet, um die Debugging-Informationen zu bündeln.

## Installation

### 1. Plugin-Datei in das Projekt einfügen

Kopiere die `debug.plugin.js` Datei in das Verzeichnis `src/plugins/` oder ein anderes beliebiges Verzeichnis innerhalb deines Projekts.

### 2. Plugin in der App einbinden

In der Hauptdatei deiner Anwendung (z.B. `main.js` oder `main.ts`), importiere und installiere das Plugin:

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import DebugPlugin from './plugins/debug.plugin.js';  // Pfad anpassen

const app = createApp(App);

// Plugin installieren
app.use(DebugPlugin);

app.mount('#app');
```

### 3. Konfiguration anpassen (optional)

Das Plugin kommt mit einer Standardkonfiguration. Du kannst die `debug.plugin.js` Datei nach deinen Wünschen anpassen.

---

## Konfiguration

Die Konfiguration des Plugins befindet sich in der `debug.plugin.js` Datei und bietet mehrere Optionen, die du nach Bedarf ändern kannst.

### Konfigurationsparameter

| **Option**                   | **Beschreibung**                                                                                                                                                   | **Standardwert**                      |
|------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| `regex.stackTrace`            | RegEx zum Extrahieren des Dateinamens aus dem Stack-Trace.                                                                                                         | `/file|http|https|\/([^\/]+\.vue|[^\/]+\.js)/` |
| `regex.jsLineNumber`          | RegEx zum Extrahieren der Zeilennummer aus einer JavaScript-Datei.                                                                                               | `/.*:(\d+):(\d+)$/`                   |
| `regex.vueLineNumber`         | RegEx zum Extrahieren der Zeilennummer aus einer Vue-Datei.                                                                                                      | `/.*:(\d+):\d+\)/`                    |
| `regex.url`                   | RegEx zum Extrahieren einer URL aus der Ausgabe.                                                                                                                  | `/http[s]?:\/\/[^\s]+/`               |
| `defaults.unknownFile`        | Standard-Dateiname, wenn kein Dateiname ermittelt werden kann.                                                                                                   | `"Unknown file"`                      |
| `defaults.unknownLineNumber`  | Standard-Zeilennummer, wenn keine Zeilennummer ermittelt werden kann.                                                                                             | `"0000"`                              |
| `defaults.prefixes.js`        | Präfix für JavaScript-Dateien.                                                                                                                                     | `"JS"`                                |
| `defaults.prefixes.vue`       | Präfix für Vue-Dateien.                                                                                                                                             | `"VUE"`                               |
| `defaults.prefixes.file`      | Präfix für allgemeine Dateien.                                                                                                                                      | `"FILE"`                              |
| `styles.file.js`              | CSS-Stil für JavaScript-Dateien.                                                                                                                                     | `'color: lightblue; font-weight: bold;'` |
| `styles.file.vue`             | CSS-Stil für Vue-Dateien.                                                                                                                                           | `'color: green; font-weight: bold;'`  |
| `styles.prefix.js`            | CSS-Stil für das JavaScript-Präfix.                                                                                                                                 | `'color: lightblue; font-weight: bold;'` |
| `styles.prefix.vue`           | CSS-Stil für das Vue-Präfix.                                                                                                                                       | `'color: green; font-weight: bold;'`  |
| `styles.common.line`          | CSS-Stil für die Zeileninformation.                                                                                                                                 | `'color: lightblue;'`                 |
| `styles.common.message`       | CSS-Stil für die Nachrichtenanzeige.                                                                                                                                | `'color: white;'`                    |
| `indent.short`                | Kürzere Einrückung für die Ausgabe.                                                                                                                                  | `'\t\t'`                              |
| `indent.long`                 | Längere Einrückung für die Ausgabe.                                                                                                                                  | `'\t\t\t'`                            |
| `labels.url`                  | Label für URL in der Ausgabe.                                                                                                                                       | `"[URL]"`                             |
| `labels.type`                 | Label für den Typ der ausgegebenen Nachricht.                                                                                                                      | `"[TYPE]"`                            |
| `labels.content`              | Label für den Inhalt der Nachricht.                                                                                                                                 | `"[CONTENT]"`                         |
| `labels.debug`                | Label für den Debug-Header.                                                                                                                                         | `"[DEBUG]"`                           |
| `labels.objectOrArray`        | Label für Objekte oder Arrays.                                                                                                                                      | `"[OBJECT OR ARRAY]"`                 |
| `suppressedConsoleMethods`    | Liste der Konsolenmethoden, die unterdrückt und an `debug` weitergeleitet werden.                                                                                  | `["log", "warn", "error", "info", "debug"]` |
| `environmentModes`            | Liste der Umgebungen, in denen das Plugin aktiv ist.                                                                                                              | `["development"]`                     |

---

## Anwendung in Vue-Dateien

### Beispiel 1: Einfache Debug-Nachricht in einer Vue-Datei

In einer Vue-Komponente kannst du die `this.$debug`-Methode verwenden, um eine Nachricht zu protokollieren.

```vue
<template>
  <div>
    <button @click="logMessage">Debug Nachricht</button>
  </div>
</template>

<script>
export default {
  methods: {
    logMessage() {
      // Eine einfache Debug-Nachricht
      this.$debug('Dies ist eine Debug-Nachricht aus einer Vue-Komponente');
    }
  }
}
</script>
```

**Ergebnis in der Konsole:**
```
[DEBUG] [VUE] [MyComponent.vue:10]    Dies ist eine Debug-Nachricht aus einer Vue-Komponente
```

### Beispiel 2: Debugging eines Objekts in einer Vue-Datei

Das Plugin unterstützt auch die Ausgabe komplexer Objekte.

```vue
<template>
  <div>
    <button @click="logObject">Logge ein Objekt</button>
  </div>
</template>

<script>
export default {
  methods: {
    logObject() {
      const user = { name: 'Max', age: 30 };
      this.$debug(user);
    }
  }
}
</script>
```

**Ergebnis in der Konsole:**
```
[DEBUG] [VUE] [MyComponent.vue:10]    [OBJECT OR ARRAY]
[CONTENT]    { name: 'Max', age: 30 }
```

---

## Anwendung in JavaScript-Dateien

### Beispiel 1: Einfache Debug-Nachricht in einer JavaScript-Datei

In einer normalen JavaScript-Datei kannst du ebenfalls die `debug`-Methode verwenden.

```javascript
// In einer normalen JavaScript-Datei
import { debug } from './plugins/debug.plugin.js';

debug('Dies ist eine Debug-Nachricht aus einer JavaScript-Datei');
```

**Ergebnis in der Konsole:**
```
[DEBUG] [JS] [main.js:5]    Dies ist eine Debug-Nachricht aus einer JavaScript-Datei
```

### Beispiel 2: Debugging eines Arrays in einer JavaScript-Datei

Auch hier kannst du Arrays und Objekte ausgeben lassen.

```javascript
// In einer normalen JavaScript-Datei
import { debug } from './plugins/debug.plugin.js';

const numbers = [1, 2, 3, 4, 5];
debug(numbers);
```

**Ergebnis in der Konsole:**
```
[DEBUG] [JS] [main.js:5]    [OBJECT OR ARRAY]
[CONTENT]    [1, 2, 3, 4, 5]
```

### Beispiel 3: Debugging von boolean-Werten

Auch primitive Typen wie Booleans können problemlos ausgegeben werden.

```javascript
// In einer normalen JavaScript-Datei
import { debug } from './plugins/debug.plugin.js';

const isActive = true;
debug(isActive);
```

**Ergebnis in der Konsole:**
```
[DEBUG] [JS] [main.js:5]    [TYPE]
[CONTENT]    boolean
```

---

## Umleitung der Konsolenmethoden

Das Plugin leitet die üblichen Konsolenmethoden (`console.log`, `console.warn`, `console.error`, `console.info`, `console.debug`) im Entwicklungsmodus automatisch an die `debug`-Funktion weiter. Das bedeutet, dass alle `console.log`-Ausgaben, die im Code aufgerufen werden, ebenfalls durch das Plugin verarbeitet werden und in der Debug-Konsole angezeigt werden.

### Beispiel 1: Umleitung von `console.log`

```javascript
console.log('Dies wird von der debug-Funktion behandelt');
```

**Ergebnis in der Konsole:**
```
[DEBUG] [JS] [main.js:5]    Dies wird von der debug-Funktion behandelt
```

### Beispiel 2: Umleitung von `console.error`

```javascript
console.error('Fehler werden ebenfalls durch die debug-Funktion behandelt');
```

**Ergebnis in der Konsole:**
```
[DEBUG] [JS] [main.js:6]    Fehler werden ebenfalls durch die debug-Funktion behandelt
```

---

## Gruppen in der Konsolenausgabe

Das Plugin verwendet `console.groupCollapsed` und `console.groupEnd`, um die Debugging-Informationen in Gruppen zu organisieren. So bleiben die Konsolenausgaben übersichtlich und du kannst Details bei Bedarf erweitern.

**Beispiel einer Konsolengruppe:**

```javascript
this.$debug('Dies ist eine Nachricht in einer Gruppe');
```

In der Konsole wird eine gruppierte Ausgabe angezeigt:

```
[DEBUG] [VUE] [MyComponent.vue:10]    Dies ist eine Nachricht in einer Gruppe
```

Du kannst die Gruppe durch Klicken auf den kleinen Pfeil neben der Gruppe öffnen und weitere Details anzeigen lassen.

---

## Anpassung der Konfiguration

Du kannst die Konfiguration direkt in der `debug.plugin.js` Datei ändern:

- **Farben und Schriftstile**: Passe die Farben und Schriftstile an, indem du die `CONFIG.styles`-Objekte bearbeitest.
- **Reguläre Ausdrücke**: Ändere die RegEx-Ausdrücke, um den Stack-Trace und die Dateiinformationen anders zu parsen.
- **Umgebungsmodi**: Stelle sicher, dass das Plugin nur in den gewünschten Umgebungen aktiv ist, indem du die `CONFIG.environmentModes` anpasst.

---

## Probleme beheben

- **Fehler bei der Verwendung im Produktionsmodus**: Stelle sicher, dass das Plugin nur im Entwicklungsmodus aktiv ist, indem du die Umgebungsvariable überprüfst.
- **ASCII-Smiley**: Wenn das Plugin zum ersten Mal verwendet wird, erscheint ein ASCII-Smiley in der Konsole, der anzeigt, dass das Debugging aktiviert ist. Dieser wird nur einmal angezeigt.

---

Das ist eine umfassende Anleitung zur Installation, Verwendung und Anpassung des Vue Debug Plugins, einschließlich der Umleitung von `console.log` und der Verwendung von Konsolengruppen. Du kannst diesen Text direkt in deine `README.md`-Datei einfügen und deinen Entwicklern zur Verfügung stellen.
