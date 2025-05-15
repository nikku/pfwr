---
title: pfwr - Generate HTML Slide Decks from Markdown Files
description: This slide deck introduces pfwr - a little command line utility that generates beautiful, self-contained HTML slide decks from Markdown files.
author: nikku
authorTwitter: '@nrehwaldt'
type: article
tags:
  - pfwr
  - static side generator
  - markdown to html
origin: https://github.com/nikku/pfwr
image: https://cdn.statically.io/gh/nikku/pfwr/main/docs/screenshot.png
---

# *pfwr*

### Turns Your Markdown :memo: into a :sparkles: HTML Slide Deck.

---

### *Disclaimer* I built this tool :wink:

[`@nikku`](https://github.com/nikku) on GitHub

---

## Write Markdown

```markdown

## First Slide

---

## Second Slide

```

Separate slides by `---`.

---

## Generate HTML Slide Deck

On your command-line, use the `pfwr` utility:

```sh
$ pfwr presentation.md presentation.html
```

Install the utility via `npm install -g pfwr`.

---

## Add Lists

* bullet points
* are supported, too

---

## Or numbered

1. one
2. two

---

# Write

## Many

### Different

#### Headings

---

![](./assets/me.jpg)

Add cool image.

---

## Or With Heading

![](./assets/me.jpg)

---

![Or a fullsize image](https://www.space.news/wp-content/uploads/sites/38/2015/12/Big-Death-Star.jpg)

---

Add `code`, **bold**, ~~strikethrough~~, or _highlight_.

---

Link slides [by number](#3) or [name](#add-some-code).

---

## Add Tables

| This | Is | Table |
| :--- | :---: | ---: |
| :one: || :two: :three: |
| Long | Cell Content | *Can be fitted, too?* |

<small>With a caption</small>

---

## Add Some Code

```javascript
function hello() {
  window.alert('How yo doing?');
}

if (isFirstTime(visit)) {
  hello();
} else {
  welcomeBack();
}
```

<small>With a caption</small>

---

## Or a Longer Snippet

```javascript
function hello() {
  window.alert('How yo doing?');
}

function isFirstTime(visit) {
  return exists(visit);
}

if (isFirstTime(visit)) {
  hello();
} else {
  welcomeBack();
}
```

---

<!--config
theme=funky
-->

## Customize your Background

Some `code`, good right? _Yea!_

---

<!--config
theme=funky
-->

## Add Some Code

```javascript
function hello() {
  window.alert('How yo doing?');
}

if (isFirstTime(visit)) {
  hello();
} else {
  welcomeBack();
}
```

<small>With a caption</small>

---

<!--config
theme=funky
-->

## Add Tables

| This | Is | Table |
| :--- | :---: | ---: |
| :one: || :two: :three: |
| Long | Cell Content | *Can be fitted, too?* |

---

<!--config
theme=eco
-->

## Or go green?

Some `code`, good right? _Yea!_

---

<!--config
theme=eco
name=add-some-code
-->

## Add Some Code

```javascript
function hello() {
  window.alert('How yo doing?');
}

if (isFirstTime(visit)) {
  hello();
} else {
  welcomeBack();
}
```

<small>With a caption</small>

---

<!--config
theme=eco
-->

## Add Tables

| This | Is | Table |
| :--- | :---: | ---: |
| :one: || :two: :three: |
| Long | Cell Content | *Can be fitted, too?* |

<small>[With a link](#3)</small>

---

<!--config
align=right
-->

# How is it

## Not :arrow_left: aligned?

---

And finally, :printer: your slides to PDF.

**Use your browser's :printer: function**.

It actually *works*.

---

:arrow_right: [GitHub](https://github.com/nikku/pfwr)

:memo: [Presentation Source](https://github.com/nikku/pfwr/blob/main/example/presentation.md)