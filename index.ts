'use strict';

import * as assign from 'object-assign';

const inferMediaFromCSSFilename = (filename) => {
    const matches = filename.match(/\bmedia_([A-Z0-9=]*)/i);

    if (matches) {
        // Node 5.10+
        if (typeof Buffer.from === 'function') {
            return Buffer.from(matches[1], 'base64');
        }

        // older Node versions
        return new Buffer(matches[1], 'base64');
    }

    return false;
};

export interface Foo { }
export interface LinkRelHTMLWebpackPluginOptionFile {
    /**
     * The file to match. Can be a literal string or (more likely) a regular expression.
     */
    file : string | RegExp;

    /**
     * The `rel` attribute to use for <link>
     */
    rel? : string;

    /**
     * The `title` attribute to use for <link>
     */
    title? : string;
}

/**
 * Options for the LinkRelHTMLWebpack plugin.
 */
export interface LinkRelHTMLWebpackPluginOptions {
    files : LinkRelHTMLWebpackPluginOptionFile[];
}

/**
 * Allows you to modify the `rel` and `title` attribute on <link> elements injected by HTML Webpack Plugin. 
 * This can be used to specify some stylesheets as alternate stylesheets for accessibility or theming 
 * purposes. 
 */
export class LinkRelHTMLWebpackPlugin {
    constructor(
        private options : LinkRelHTMLWebpackPluginOptions
    ) {
    }

    private isStylesheetLink(def) {
        return def.tagName === 'link' && def.attributes.rel === 'stylesheet';
    }

    private selectFileOptions(href) {
        return this.options.files.filter(x => {
            if (typeof x.file === 'string')
                return x.file === href;
            else if (x.file instanceof RegExp) 
                return x.file.test(href);

            return false;
        })[0];
    }

    private modifyRelAttribute(definition) {
        if (!this.isStylesheetLink(definition) || !definition.attributes.href)
            return definition;

        let options = this.selectFileOptions(definition.attributes.href);
        if (!options)
            return definition;

        let attrs : any = {};

        if (options.rel)
            attrs.rel = options.rel;

        if (options.title)
            attrs.title = options.title;

        return assign({}, definition, {
            attributes: assign({}, definition.attributes, attrs),
        });
    }

    apply(compiler) {
        // Hook into the html-webpack-plugin processing
        compiler.plugin('compilation', (compilation) => {
            compilation.plugin('html-webpack-plugin-alter-asset-tags', (htmlPluginData, callback) => {
                callback(null, assign({}, htmlPluginData, {
                    body: htmlPluginData.body.map(x => this.modifyRelAttribute(x)),
                    head: htmlPluginData.head.map(x => this.modifyRelAttribute(x)),
                }));
            });
        });
    }
}

export default LinkRelHTMLWebpackPlugin;