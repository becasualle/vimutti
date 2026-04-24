/**
 * Mermaid flowchart uses ASCII single quote (U+0027) as string delimiter.
 * Replace with typographic apostrophe (U+2019) only inside ```mermaid ... ``` blocks.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const APOST = "\u2019" // right single quotation mark
const collect = (dir, out = []) => {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n)
    if (statSync(p).isDirectory()) collect(p, out)
    else if (n.endsWith(".mdx") || n.endsWith(".md")) out.push(p)
  }
  return out
}

const processText = (text) => {
  const parts = text.split("```mermaid")
  if (parts.length < 2) return { changed: false, text }
  const out = [parts[0]]
  let changed = false
  for (let i = 1; i < parts.length; i++) {
    const rest = parts[i]
    const endIdx = rest.indexOf("```")
    if (endIdx === -1) {
      out.push("```mermaid" + rest)
      continue
    }
    const body = rest.slice(0, endIdx)
    const after = rest.slice(endIdx)
    const newBody = body.replaceAll("'", APOST)
    if (newBody !== body) changed = true
    out.push("```mermaid" + newBody + after)
  }
  return { changed, text: out.join("") }
}

const roots = [join(process.cwd(), "content"), join(process.cwd(), "docs")]
let files = []
for (const r of roots) {
  try {
    collect(r, files)
  } catch {
    /* */
  }
}
let n = 0
for (const f of files) {
  const raw = readFileSync(f, "utf8")
  const { changed, text } = processText(raw)
  if (changed) {
    writeFileSync(f, text, "utf8")
    n += 1
  }
}
console.log(`Updated ${n} file(s) (ASCII apostrophe → U+2019 in mermaid blocks only)`)
