window.rll = window.rll || {};
window.Models = window.Models || {};

(function(Models, _, undefined) {
'use strict';

Models.defineSimpleModel = function(modelName, attrDefaults) {
    attrDefaults = attrDefaults || {};

    var prototypeMethods = attrDefaults.prototype || {},
        modelMethods     = attrDefaults.model     || {},
        defaults         = attrDefaults.defaults  || {},
        initFunc         = attrDefaults.init,
        defaultsFunc     = _.isFunction(defaults) ? defaults : function() { return defaults; };
    delete attrDefaults.prototype;
    delete attrDefaults.model;
    delete attrDefaults.defaults;
    delete attrDefaults.init;

    var Model = function(modelData) {
        _.extend(this, { T: modelName }, modelData);
        _.defaults(this, defaultsFunc.call(this));
    };

    _.extend(Model, {
        create: function(modelData) {
            var model = new Model(modelData);
            initFunc.call(model);
            return model;
        }
    }, modelMethods);

    _.extend(Model.prototype, prototypeMethods);

    return Model;
};

})(window.Models, window._);