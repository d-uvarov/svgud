# svgud
Replaces a special tag in your vuejs template with your svg
 
## Installation
```bash
$ npm install svgud
```

**webpack.config.js**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {  // after vue-loader!
        test: /\.vue$/,
        loader: 'svgud',
        options: {
            path:  "./svg-folder"
        }
      }
    ]
  }
}
```

## Usage

```
svg-folder/
├── my.svg
├── stars.svg
└── child-folder
    ├──my2.svg
    └──some.svg
webpack.config.js
```

**Vuejs component**
```html
<template>
    <div>
        <svgud name="my" />
        <ul>
            <li><svgud name="star" /></li>
            <li><svgud name="child-folder/some" /></li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "myComponent"
    }
</script>
```
