window.rll = window.rll || {};
window.Models = window.Models || {};

(function(Models, _, undefined) {
'use strict';

Models.defineSimpleModel = function(modelName, attrDefaults) {
    attrDefaults = attrDefaults || {};

    var prototypeMethods = attrDefaults.prototype || {},
        modelMethods     = attrDefaults.model     || {},
        defaults         = attrDefaults.defaults  || {},
        defaultsFunc     = _.isFunction(defaults) ? defaults : function() { return defaults; };
    delete attrDefaults.prototype;
    delete attrDefaults.model;
    delete attrDefaults.defaults;

    var Model = function(modelData) {
        _.extend(this, { T: modelName }, modelData);
        _.defaults(this, defaultsFunc.call(this));
    };

    _.extend(Model, {
        create: function(modelData) {
            return new Model(modelData);
        }
    }, modelMethods);

    _.extend(Model.prototype, prototypeMethods);

    return Model;
};

})(window.Models, window._);