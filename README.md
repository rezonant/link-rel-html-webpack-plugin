Link Rel HTML Webpack Plugin
==============================

[![Build Status](https://travis-ci.org/rezonant/link-rel-html-webpack-plugin.svg?branch=master)](https://travis-ci.org/rezonant/link-rel-html-webpack-plugin) 
[![codecov](https://codecov.io/gh/rezonant/link-rel-html-webpack-plugin/branch/master/graph/badge.svg)](https://codecov.io/gh/rezonant/link-rel-html-webpack-plugin)

This is an extension plugin for the [webpack](http://webpack.github.io) plugin [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin).

It allows you to modify the `rel` and `title` attribute on <link> elements injected by HTML Webpack Plugin. This can be used to specify some stylesheets as 
alternate stylesheets for accessibility or theming purposes. This is based on the 
[Link Media Webpack Plugin](https://github.com/probablyup/link-media-html-webpack-plugin) written by [Evan Scott](https://github.com/probablyup) which lets 
you modify the `media` attribute in a similar fashion.

Installation
------------

You must be running webpack on node 4.x or higher

Install the plugin with `npm`:

```shell
$ npm install --save-dev link-rel-html-webpack-plugin
```

Basic Usage
-----------

Load the plugin

```js
const { LinkRelHtmlWebpackPlugin } = require('link-rel-html-webpack-plugin');
```

When using Node 4.x or 5.x you don't have deconstruction assignment, instead use: 

```js
const LinkRelHtmlWebpackPlugin = require('link-rel-html-webpack-plugin').LinkRelHtmlWebpackPlugin;
```

and add it to your webpack config as follows:

```js
plugins: [
    // ...
    new HtmlWebpackPlugin(),
    new LinkRelHtmlWebpackPlugin({
        files: [
            { file: /theme-default/, title: 'Default Theme' },
            { file: /theme-dark/, rel: 'alternate stylesheet', title:  => 'Dark Theme' }
        ]
    }),
    // ...
]
```

You'll need to use this in conjunction with [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin) to 
create CSS stylesheets instead of JS modules for CSS resources.
