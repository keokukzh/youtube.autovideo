#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const usage = `
youtube.autovideo — CLI

Usage:
  autovideo <command> [options]

Commands:
  init         Erzeugt Skelett/Ordner
  generate     Erzeugt Script & Assets (WIP)
  render       Rendert Video (WIP)
  upload       Lädt Video zu YouTube hoch (WIP)
  help         Zeigt diese Hilfe

Beispiele:
  autovideo help
`;

function logHelp() {
  console.log(usage.trim());
}

async function main() {
  const [, , cmd = "help", ...args] = process.argv;
  switch (cmd) {
    case "help":
    case "--help":
    case "-h":
      logHelp();
      break;
    case "init":
      // minimaler init: lege Ordner an
      const out = path.join(process.cwd(), "project");
      fs.mkdirSync(out, { recursive: true });
      console.log("✓ Ordner erstellt:", out);
      break;
    case "generate":
    case "render":
    case "upload":
      console.log("WIP:", cmd, "wird in kommenden PRs implementiert.");
      break;
    default:
      console.error("Unbekannter Befehl:", cmd);
      logHelp();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
