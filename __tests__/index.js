const fs = require('fs');
const path = require('path');
const MemoryFileSystem = require('memory-fs');
const webpack = require('webpack');
const ExtractPlugin = require('extract-text-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');
const LinkRelHTMLWebpackPlugin = require('../').LinkRelHTMLWebpackPlugin;

const FIXTURE_DIR = path.join(__dirname, 'fixtures');
const OUTPUT_DIR = path.join(__dirname, '../dist');

describe('LinkMediaHTMLPlugin', () => {
    it('adds rel/title attributes to link tags of CSS assets', (done) => {
        const mainThemeExtractor = new ExtractPlugin('theme-main.css');
        const darkThemeExtractor = new ExtractPlugin('theme-dark.css');

        const expected = fs.readFileSync(path.resolve(FIXTURE_DIR, 'expected.html')).toString().trim();
        const compiler = webpack({
            entry: path.join(FIXTURE_DIR, 'entry.js'),
            module: {
              loaders: [
                {
                    test: /theme-main\.css$/,
                    use: darkThemeExtractor.extract('css-loader'),
                }, {
                    test: /theme-dark\.css$/,
                    use: mainThemeExtractor.extract('css-loader'),
                },
              ],
            },
            output: {
                path: OUTPUT_DIR,
            },
            plugins: [
                mainThemeExtractor,
                darkThemeExtractor,
                new HTMLPlugin({
                    minify: {
                        collapseWhitespace: true,
                    },
                }),
                new LinkRelHTMLWebpackPlugin({
                    files: [
                        { file: /theme-main/, title: 'Main theme' },
                        { file: /theme-dark/, title: 'Dark theme', rel: 'alternate stylesheet' },
                    ]
                }),
            ],
        }, (err, result) => {
            expect(err).toBeFalsy();
            expect(JSON.stringify(result.compilation.errors)).toBe('[]');
            expect(result.compilation.assets['index.html'].source().trim()).toBe(expected);
            done();
        });

        compiler.outputFileSystem = new MemoryFileSystem();
    });
});
