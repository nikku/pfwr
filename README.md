# pfwr

A tiny but batteries included utility to convert a [Markdown file](https://daringfireball.net/projects/markdown/) to a beautiful HTML presentation.


## Usage

```
npx pfwr presentation.md presentation.html
```

## Features

* Recognizes [CommonMark](https://commonmark.org/) and [GitHub flavored Markdown](https://github.github.com/gfm/)
* Creates a self-contained, printable HTML slide deck
* Embeds HTML, on purpose (cf. [security considerations](#security-considerations))
* Allows you to configure meta-data via front-matter


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

![](./assets/me.jpg)

---

:arrow_right: [Checkout on GitHub](https://github.com/nikku/pfwr)
```

Convert the file to an HTML file:

```sh
npx pfwr presentation.md presentation.html
```

Open [the presentation](https://cdn.statically.io/gh/nikku/pfwr/v0.0.3/example/presentation.html) in your favorite browser.


## Security Considerations

:warning: `pfwr` is not safe to use on untrusted input since it allows you to embed arbitrary HTML within your slides.


## License

MIT
