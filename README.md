# PostCSS Variants

[PostCSS] plugin for generating variants of functional CSS. Variant types are pluggable with included plugins to generate `responsive` and `hover` variants.

[PostCSS]: https://github.com/postcss/postcss

Here's an example using the built-in hover variant.

```css
@variants hover {
  .black { color: black; }
}
```

```css
.black { color: black; }
.hover-black:hover { color: black; }
```

Here's an example using the built-in responsive variant.

```css
@variants responsive {
  .black { color: black; }
}
```

```css
.black { color: black; }
@media (--breakpoint-sm) {
  .black-sm { color: black; }
}
@media (--breakpoint-md) {
  .black-md { color: black; }
}
@media (--breakpoint-lg) {
  .black-lg { color: black; }
}
@media (--breakpoint-xl) {
  .black-xl { color: black; }
}
```

They can be combined to generate both.

```css
@variants hover, responsive {
  .black { color: black; }
}
```

```css
.black { color: black; }
.hover-black:hover { color: black; }
@media (--breakpoint-sm) {
  .black-sm { color: black; }
}
@media (--breakpoint-md) {
  .black-md { color: black; }
}
@media (--breakpoint-lg) {
  .black-lg { color: black; }
}
@media (--breakpoint-xl) {
  .black-xl { color: black; }
}
```

They can also be nested to apply them combinatorially.

```css
@variants responsive {
  @variants hover {
    .black { color: black; }
  }
}
```

```css
.black { color: black; }
.hover-black:hover { color: black; }
@media (--breakpoint-sm) {
  .black-sm { color: black; }
  .hover-black-sm:hover { color: black; }
}
@media (--breakpoint-md) {
  .black-md { color: black; }
  .hover-black-md:hover { color: black; }
}
@media (--breakpoint-lg) {
  .black-lg { color: black; }
  .hover-black-lg:hover { color: black; }
}
@media (--breakpoint-xl) {
  .black-xl { color: black; }
  .hover-black-xl:hover { color: black; }
}
```

## Usage

Install package:

```sh
npm install --save-dev postcss-variants
```

Use postcss-variants as a plugin to PostCSS:

```js
postcss([
  require('postcss-variants')()
]).process(YOUR_CSS)
```

## Customize transform function

Use the transform param to customize the selector structure

```js
postcss([
  require('postcss-variants')({
    transform: (selector, suffix) => `${suffix}-${selector}`
  })
]).process(YOUR_CSS)
```