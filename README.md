# pfwr

[![CI Status](https://img.shields.io/github/workflow/status/nikku/pfwr/CI/main)](https://github.com/nikku/pfwr/actions?query=workflow%3ACI)

Turns your [Markdown file](https://github.com/nikku/pfwr/blob/main/README.md#example) into [a beautiful HTML slide deck](https://cdn.statically.io/gh/nikku/pfwr/v0.7.2/example/presentation.html). Batteries included.


## Introduction

[![Slide deck generated from Markdown via pfwr](https://raw.githubusercontent.com/nikku/pfwr/main/docs/screenshot.png)](https://cdn.statically.io/gh/nikku/pfwr/v0.7.2/example/presentation.html)


## Usage

Install the package globally via `npm`:

```sh
npm install -g pfwr
```

Then, transform your Markdown file with the `pfwr` tool:

```sh
pfwr presentation.md presentation.html
```


## Features

* Recognizes [CommonMark](https://commonmark.org/) and [GitHub flavored Markdown](https://github.github.com/gfm/)
* Creates a self-contained, printable HTML slide deck
* Embeds HTML, on purpose (cf. [security considerations](#security-considerations))
* Allows you to configure meta-data via front-matter
* Watch mode (rebuild on changes)


## Example

Write your presentation in a single Markdown file:

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
pfwr presentation.md presentation.html
```

Open [the slide deck](https://cdn.statically.io/gh/nikku/pfwr/v0.7.2/example/presentation.html) in your favorite browser.


## Security Considerations

[pfwr](https://github.com/nikku/pfwr) embeds arbitrary HTML contained in your Markdown file. Thus, it is not safe to use on untrusted input.


## License

MIT
