/*! restc.js v1.0.0 MIT License By Yimi https://github.com/yimicat */
;(function() {
    'use strict';

    var RestC = function(){
        this.options = {};
        this.options.defaults = {
            baseUrl : null,
            async: true,
            dataType : "json",
            timeout : 0,
            contentType: "application/json;charset=UTF-8",
            headers: {
                accept: "application/json;charset=UTF-8"
            },
            beforeCall : function() {},//访问前调用
            afterCall : function() {},//访问后调用
            success  : null,
            error : null
        }
    };

    var _gsub = function(source, pattern, replacement) {
        var result = '', match;
        while (source.length > 0) {
            match = source.match(pattern);
            if (match) {
                result += source.slice(0, match.index);
                result += replacement(match).toString();
                source = source.slice(match.index + match[0].length);
            } else {
                result += source;
                source = '';
            }
        }
        return result;
    };

    var _createUrl = function(sourceUrl, params) {
        var pathParams = $.extend(true, {}, params);
        var usedPathParams = [];
        var result = !sourceUrl ? "" : _gsub(sourceUrl, /\{(.+?)\}/,
            function (match) {
                var key = match[1];
                var value = pathParams[key];
                if (value === undefined || value === null) {
                    $.error("Can't found '" + key + "' from params.");
                }
                usedPathParams.push(key);
                return encodeURIComponent(value);
            });
        return result;
    };

    var _send = function(method, option) {
        var _that = this;
        var _url = _createUrl(option.url, option.params);
        var _options = $.extend(true, {}, _that.options, option);

        _options.beforeCall.call(this);
        return $.ajax({
            url: _that.options.baseUrl + _url,
            data : _options.data,
            type : method,
            timeout : _that.options.timeout,
            dataType : 'json',
            success: function(data, textStatus, jqXHR){
                _options.success.call(this, data, textStatus, jqXHR);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                _options.error.call(this,jqXHR, textStatus, errorThrown);
            },
            complete : function (XMLHttpRequest) {
                _options.afterCall.call(this, XMLHttpRequest);
            }
        });
    };

    RestC.prototype.setOptions = function(options) {
        this.options = $.extend(true, this.options.defaults, options);
    };

    RestC.prototype.getOptions = function() {
        return this.options;
    };

    RestC.prototype.get = function(option) {
        return _send.call(this, "GET", option);
    };

    RestC.prototype.put = function(option) {
        return _send.call(this, "PUT", option);
    };

    RestC.prototype.del = function(option) {
        return _send.call(this, "DELETE", option);
    };

    RestC.prototype.post = function(option) {
        return _send.call(this, "POST", option);
    };

    RestC.prototype.patch = function(option) {
        return _send.call(this, "PATCH", option);
    };

    return window.restc ? window.restc : window.restc = new RestC();
})();