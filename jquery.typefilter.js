/**
 * TypeFilter
 *
 * Copyright (c) 2013 David Hanson
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Highlighting code based on library by:
 * Johann Burkard
 * <http://johannburkard.de>
 * <mailto:jb@eaio.com>
 * <http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html>
 * MIT license.
 */

/**
 * Filter DOM elements as typing, and highlight matching contents
 *
 * Construct your DOM with a parent node (default class .typefilter-row), that has searchable keywords (default data-keywords attr)
 * For example:
 *  <div class="typefilter-row" data-keywords="foo bar">
 *      My Foo is too Bar
 *  </div>
 *
 * Next, create a text box somewhere and bind it to TypeFilter, like:
 *  $("input.typefilter").typefilter()
 *
 * Now, as you type, the text inside your div will be highlighted if it matches
 * If a div of class typefilter-row (or your custom class) does not match, it is hidden.
 * Emptying the text box resets everything.
 *
 * You can pass an options hash (see below) to customize, if you need.
 *
 * Last note:
 *  You should add a CSS class for "highlight".  I suggest:
 *   .highlight { background-color: yellow; }
 *
 */
$.fn.typefilter = function(options)
{

    if (typeof(options.rowSelector) === 'undefined') {
        options.rowSelector = '.typefilter-row'
    }

    if (typeof(options.minChars) === 'undefined') {
        options.minChars = 3
    }

    if (typeof(options.rowKeywordAttribute) === 'undefined') {
        options.rowKeywordAttribute = 'data-keywords'
    }

    var innerHighlight = function(node, pat) {
        var skip = 0;
        pat = pat.toUpperCase()

        if (node.nodeType == 3) {
            var pos = node.data.toUpperCase().indexOf(pat);
            if (pos >= 0) {
                var spannode = document.createElement('span');
                spannode.className = 'highlight';
                var middlebit = node.splitText(pos);
                var endbit = middlebit.splitText(pat.length);
                var middleclone = middlebit.cloneNode(true);
                spannode.appendChild(middleclone);
                middlebit.parentNode.replaceChild(spannode, middlebit);
                skip = 1;
            }
        }
        else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
            for (var i = 0; i < node.childNodes.length; ++i) {
                i += innerHighlight(node.childNodes[i], pat);
            }
        }
        return skip;
    };

    var removeHighlight = function(context) {
        return context.find("span.highlight").each(function() {
            with (this.parentNode) {
                $(this.parentNode).find("span").replaceWith(function() { return this.innerHTML; })
                //replaceChild(this.firstChild, this);
                normalize();
            }
        }).end();
    };

    var _this = this;

    $(this).keyup(function(e) {
        var term = $(_this).val()
        if (term.length >= options.minChars) {
            var matcher = new RegExp(term.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "i" );
            $(options.rowSelector).each(function(index) {
                var keywords = $(this).attr(options.rowKeywordAttribute)
                if (matcher.test(keywords)) {
                    removeHighlight($(this))
                    innerHighlight(this,term)
                    $(this).show();
                } else {
                    $(this).hide();
                }
            })
        } else if (term.length == 0) {
            removeHighlight($(options.rowSelector))
            $(options.rowSelector).show();
        }
    })

    return options;
};



/*

highlight v4

Highlights arbitrary terms.

<http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html>

MIT license.

Johann Burkard
<http://johannburkard.de>
<mailto:jb@eaio.com>

*/

