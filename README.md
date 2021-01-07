# pfwr

A tiny but many batteries included utility to convert markdown to a beautiful HTML presentation.


## Usage

```
npx pfwr presentation.md presentation.html
```


## Example

Write your presentation in a single markdown file:

```markdown
---
title: What is pfwr
author: nikku
---

# *pfwr*

### What the heck is this

---

### *Disclaimer* I built this tool :wink:

Normal text may be added.

---

* bullet points
* are supported, too

---

![](./me.png)
```

Convert the file to an HTML file:

```sh
npx pfwr presentation.md presentation.html
```

Open the presentation in your favorite browser.


## License

MIT