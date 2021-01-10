# pfwr

[![CI Status](https://img.shields.io/github/workflow/status/nikku/pfwr/CI/main)](https://github.com/nikku/pfwr/actions?query=workflow%3ACI)

Turns your [Markdown file](https://github.com/nikku/pfwr/blob/main/README.md#example) into [a beautiful HTML presentation](https://cdn.statically.io/gh/nikku/pfwr/v0.0.9/example/presentation.html). Batteries included.

[![Slide deck generated from Markdown via pfwr](https://raw.githubusercontent.com/nikku/pfwr/main/docs/screenshot.png)](https://cdn.statically.io/gh/nikku/pfwr/v0.0.9/example/presentation.html)


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

Open [the presentation](https://cdn.statically.io/gh/nikku/pfwr/v0.0.9/example/presentation.html) in your favorite browser.


## Security Considerations

:warning: `pfwr` is not safe to use on untrusted input since it allows you to embed arbitrary HTML within your slides.


## License

MIT
