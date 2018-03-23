(function(root, factory) {

    // CommonJS compatibilty
    if (typeof exports !== 'undefined') {
        factory(Backbone);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['backbone'], function(Backbone) {
            // Use global variables if the locals are undefined.
            return factory(Backbone || root.Backbone);
        });
    } else {
        factory(root.Backbone);
    }

})(this, function(Backbone) {
    'use strict';
    Number.prototype.pad = function(size) {
      var s = String(this);
      while (s.length < (size || 2)) {s = "0" + s;}
      return s;
    };
    if(!window.isDirty) window.isDirty=new Object();
    _.groupByMulti = function(obj, values, context) {
        if (!values.length)
            return obj;
        var byFirst = _.groupBy(obj, values[0], context),
            rest = values.slice(1);
        for (var prop in byFirst) {
            byFirst[prop] = _.groupByMulti(byFirst[prop], rest, context);
        }
        return byFirst;
    };

    _.findDeep = function(items, attrs) {

        function match(value) {
            for (var key in attrs) {
                if (!_.isUndefined(value)) {
                    if (attrs[key] !== value[key]) {
                        return false;
                    }
                }
            }

            return true;
        }

        function traverse(value) {
            var result;

            $.each(value, function(i, val) {
                if (match(val)) {
                    result = val;
                    return false;
                }

                if (_.isObject(val) || _.isArray(val)) {
                    result = traverse(val);
                }

                if (result) {
                    return false;
                }
            });

            return result;
        }

        return traverse(items);

    }

    Backbone.Collection.prototype.save = function(options) {
        return Backbone.sync('create', this, options);
    };

    var originalFn = Backbone.history.loadUrl;

    Backbone.history.loadUrl = function() {
        var me = this;
        // I introduced an application state variable, but it can be solved in multiple ways
        // if (window.dirty) {
        //     var previousFragment = Backbone.history.fragment;
        //     window.location.hash = '#' + previousFragment;
        //     w2confirm('Exista inregistrari nesalvate! Sigur iesiti?').yes(function() {
        //         window.dirty = false;
        //         return originalFn.apply(me, arguments);
        //     }).no(function() {
        //         return false;
        //     });
        // } else {
        //     return originalFn.apply(this, arguments);
        // }

        var answer = $.Deferred();
        answer.promise().then(function() {
            return originalFn.apply(me, arguments);
        });
        if (window.isDirty.dirty) {
            var nextFragment = window.location.hash;
            var previousFragment = Backbone.history.fragment;
            window.location.hash = '#/' + previousFragment;
            w2confirm('Exista inregistrari nesalvate! Sigur iesiti?').yes(function() {
                window.isDirty.dirty = false;
                window.location.hash = nextFragment;
                return answer.resolve();
            }).no(function() {
                return answer.promise();
            });

        } else {
            answer.resolve();
        }
    };

    Backbone.SModel = Backbone.Model.extend({
        constructor: function() {
            this.listenTo(this, 'change', function() {
                if (this.attributes.EntityState === 3) {
                    this.attributes.EntityState = 1;
                }
            });
            this.listenTo(this, 'save', function() {
                this.attributes.EntityState = 1;
            });
            Backbone.Model.apply(this, arguments);
            this.attributes['recid'] = this.cid;
        }
    });

    Backbone.SCollection = Backbone.Collection.extend({
        constructor: function() {
            this.listenTo(this, 'remove', function(model) {
                model.set('EntityState', 2);
            });
            Backbone.Collection.apply(this, arguments);
        }
    });
    Backbone.SGridCollection = Backbone.SCollection.extend({
        gridRowProperty: undefined,
        constructor: function() {
            var me = this;
            this.listenTo(this, 'remove', function(model) {
                if (this.getGridRowProperty())
                    w2ui[me.getGridName()].remove(model.get(me.getGridRowProperty()).get('cid'));
                else
                    w2ui[me.getGridName()].remove(model.get('cid'));
            });
            this.listenTo(this, 'add', function(model) {
                if (this.getGridRowProperty()) {
                    model.get(this.getGridRowProperty()).set('recid', model.cid);
                    w2ui[me.getGridName()].add(model.get(this.getGridRowProperty()).toJSON());
                } else {
                    model.set('recid', model.cid);
                    w2ui[me.getGridName()].add(model.toJSON());
                }
            });
            this.listenTo(this, 'change', function(model) {
                //SET GRID RECORD BASED ON MODEL CHANGES
                if (this.getGridRowProperty())
                    w2ui[me.getGridName()].set(model.get(this.getGridRowProperty()).cid, model.get(this.getGridRowProperty()).toJSON());
                else
                    w2ui[me.getGridName()].set(model.cid, model.toJSON());
            });
            Backbone.Collection.apply(this, arguments);
        },
        setGridRowProperty: function(name) {
            this.gridRowProperty = name;
        },
        getGridRowProperty: function() {
            return this.gridRowProperty;
        },
        getGridName: function() {
            return this.gridName;
        },
        setGridName: function(name) {
            this.gridName = name;
        }
    });
    return Backbone;
});
