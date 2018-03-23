

(function(root, factory) {

    // CommonJS compatibilty
    if (typeof exports !== 'undefined') {
        factory(Marionette, Backbone);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['marionette', 'backbone'], function(Marionette, Backbone) {
            // Use global variables if the locals are undefined.
            return factory(Marionette || root.Marionette, Backbone || root.Backbone);
        });
    } else {
        factory(root.Marionette, root.Backbone);
    }

})(this, function(Marionette, Backbone) {
    'use strict';
    // var Marionette;
    // if (module) {
    //     Marionette = MarionetteBundle.Marionette;
    //     Backbone = MarionetteBundle.Backbone;
    // } else {
    //     Marionette = MarionetteBundle;
    // }
    Marionette.ModalRegion = Marionette.Region.extend({
        constructor: function() {
            // this._attachView = null;
            Marionette.Region.prototype.constructor.apply(this, arguments);
            // this.ensureEl();
        },
        _attachView: function(view) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var shouldTriggerAttach = !view._isAttached && Marionette.isNodeAttached(this.el);
            var shouldReplaceEl = typeof options.replaceElement === 'undefined' ? !!_.result(this, 'replaceElement') : !!options.replaceElement;

            if (shouldTriggerAttach) {
                Marionette.triggerMethodOn(view, 'before:attach', view);
            }

            if (shouldReplaceEl) {
                // this._replaceEl(view);
            } else {
                this.attachHtml(view);
            }

            // if (shouldTriggerAttach) {
            //     view._isAttached = true;
            //     triggerMethodOn(view, 'attach', view);
            // }

            this.currentView = view;
        },
        attachHtml: function(view) {
            view._isAttached = true;
            var options = $.extend(view.winOptions,{
                onOpen: function(e) {
                    e.onComplete = function() {
                        view.$el = $('#' + win.name);
                        view._isAttached = true;
                        view.delegateEvents();
                        Marionette.triggerMethodOn(view, 'attach', view);
                        view.win = win;
                    };
                }
            });
            var win = w2winmanager.open(view.$el,options);
            win.onClose = this.onClose.bind(this);

        },
        onClose: function() {
            // w2winmanager.close();
            console.log('closed');
        }
    });
    /*==================================PanelView=================================*/
    Marionette.PanelView = Marionette.View.extend({
        // tagName: 'dialog',
        zindex: 0,
        initialize: function() {
            this.title = this.title || 'New Window';
            this.isModal = this.isModal || false;
            this.width = this.width || '400px';
            this.height = this.height || '300px';
            this.x = this.x || '100px';
            this.y = this.y || '100px';
        },
        showModal: function() {
            var self = this;
            this.win = w2winmanager.open(this.render().el, {
                name: self.options.name + self.cid,
                title: self.title,
                width: self.width,
                showMin: self.showMin,
                showMax: self.showMax,
                height: self.height,
                resizable: self.resizable,
                isModal: self.isModal,
                onOpen: function(event) {
                    event.onComplete = function() {
                        if (self.onAttach) {
                            // Marionette.triggerMethodOn(this, 'attach', true);
                            // Marionette.triggerDOMRefresh(this);
                            // Marionette.bindEvents(self);
                            self.onAttach.apply(self, arguments);
                        }
                    }
                },
                onClose: function(event) {
                    self.destroy();
                }
            });
            if (this.returnValue)
                return this.returnValue.apply(this, arguments);
        },
        returnObject: function() {
            if (this.returnValue)
                return this.returnValue.apply(this, arguments);
            else
                return false;
        },
        close: function() {
            this.$el.get(0).close();
            this.destroy();
        },
        stack: function() {
            this.$el.css({
                'z-index': this.zindex,
                width: this.width,
                height: this.height,
                top: this.x,
                left: this.y
            });
        }
    });
    /*==================================End PanelView=============================*/

    /**
     * Extend default router to prevent user navigation if unsaved changes
     */
    Marionette.DirtyRouter = Marionette.AppRouter.extend({
        navigate: function(fragment, options) {
            var answer = $.Deferred();
            answer.promise().then(function() {
                return Marionette.AppRouter.prototype.navigate(fragment, options);
            });
            if (window.dirty) {
                w2confirm('Exista inregistrari nesalvate! Sigur iesiti?').yes(function() {
                    window.dirty = false;
                    return answer.resolve();
                }).no(function() {
                    return answer.promise();
                });

            } else {
                answer.resolve();
            }
        }
    });

    Marionette.SlashRouter = Marionette.AppRouter.extend({
        navigate: function(fragment) {
            var options = Backbone.history.options,
                ret;

            if (fragment === '' || fragment === '/') {
                Backbone.history.stop();
                Backbone.history.start({
                    pushState: options.pushState,
                    root: '/'
                });

                arguments[0] = options.root;

                ret = Backbone.Router.prototype.navigate.apply(this, arguments);

                Backbone.history.stop();
                Backbone.history.start({
                    pushState: options.pushState,
                    root: options.root
                });

                return ret;
            }

            return Backbone.Router.prototype.navigate.apply(this, arguments);
        }
    });


    /**
     * Create a ItemView with 2 functions that will construct the UI based on view's model definition
     */

    Marionette.FormView = Marionette.View.extend({

        resetCombo: function() {
            var self = this;
            var fields = self.model.fields();
            for (var i in this.model.changed) {
                var field = _.find(fields, {
                    name: i
                });
                if (field && field.type === 'list') {
                    $(field.el).data('selected', field.selected);
                    $(field.el).w2field().refresh();
                }

            }
        },
        getTemplate: function() {
            if (!this.template) {
                var html = '';
                var fields;
                if (typeof this.model.fields === 'function')
                    fields = this.model.fields();
                else
                    fields = this.model.fields;
                for (var i in fields) {
                    var field = fields[i];
                    var input = field.isMemo ? '<textarea id="' + field.name + '"></textarea>' : '<input type="text" id="' + field.name + '" />';
                    html += '<div class="w2ui-field">' +
                        '<label>' + (field.displayName ? field.displayName : this.normalizeName(field.name)) + '</label>' +
                        '<div>' + input + '</div>' +
                        '</div>';
                }
                html += '<hr />' +
                    '<div style="text-align:left">' +
                    '<button class="toolbar-button" title="Salveaza modificarile" id="btnSave"><i class="w2ui-icon-save"></i></button>' +
                    '<button class="toolbar-button" title="Renunta la modificare" id="btnCancel"><i class="w2ui-icon-ban"></i></button>' +
                    '</div>';
                return html;
            } else {
                return this.template;
            }
        },
        bindings: {},
        constructor: function(options) {
            Marionette.View.prototype.constructor.call(this, options);
        },
        ensureElement: function(setupview) {
            var self = this;
            var checkInterval = setInterval(function() {
                if ($.contains(document.body, self.el)) {
                    clearInterval(checkInterval);
                    self.hasElement = true;
                    if (setupview) self.setupView();
                    if (typeof self.onViewRendered === 'function')
                        self.onViewRendered.apply(self, arguments);
                }
                return false;
            }, 10);
        },
        setupView: function() {
            if (!this.hasElement) {
                if (!this.ensureElement(true)) return;
            }
            var self = this;
            var fields;
            if (typeof this.model.fields === 'function')
                fields = this.model.fields();
            else
                fields = this.model.fields;
            for (var f in fields) {
                var field = fields[f];
                if (field.type === 'collection')
                    continue;
                if (field.selected) {
                    field.options.selected = field.selected;
                }

                if (field.options && typeof field.options.items === 'string') {
                    var prop = field.options.items;
                    field.options.items = self.model.get(prop);
                }
                $(field.el).w2field(field.type, field.options);
                if (field.type == 'list' && field.options && field.options.cascadeTo) {
                    self.listenTo(self.model, 'change:' + field.name, function(m) {
                        console.log(Object.keys(m.changed)[0]);
                        var f = _.findWhere(fields, {
                            name: Object.keys(m.changed)[0]
                        });
                        $(f.el).w2field().cascadeTo(f.options.cascadeTo);
                    });
                }

                self.bindings[field.el] = field.name;

            }
            $.extend(self.bindings, self.bindingOverrides);
            self.stickit();
        },
        resetView: function() {
            var fields = this.model.fields();
            for (var f in fields) {
                var field = fields[f];
                $(field.el).w2field().refresh();
            }
        },
        normalizeName: function(name) {
            name = name.replace('_', ' ');
            return name.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
    });


    /**
     * Creates an AppRouter with a particular prefix at the beginning of each route.
     * @class Marionette.SubAppRouter
     * @alias module:marionette.subapprouter
     * @classdesc A router that prepends a specified prefix (passed on instantiation) onto each specified `route` or
     * `appRoute`.  Directly extends from Marione
tte.AppRouter to enable controller objects linked to the `appRoutes`
     * hash. Useful for sub applications that live in sub-directories under root and want to handle all of their own
     * routing.
     */
    Marionette.SubAppRouter = Marionette.AppRouter.extend({

        /**
         * @constructs Marionette.SubAppRouter
         * @param {string} [prefix] - The prefix string to prepend to all routes, making them act as if relative. If
         * blank, then it just acts like a regular Backbone.Router.
         * @param {Object} [options] - The options object expected by Marionette.AppRouter.
         * @param {Object} [options.controller] - An object with function properties corresponding to the hash values
         * from `routes` and `appRoutes`.
         */
        constructor: function(prefix, options) {

            var controller,
                appRoutes,
                routes = {};

            // Prefix is optional, set to empty string if not passed
            this.prefix = prefix = prefix || '';

            // SubRoute instances may be instantiated using a prefix with or without a trailing slash.
            // If the prefix does *not* have a trailing slash, we need to insert a slash as a separator
            // between the prefix and the sub-route path for each route that we register with Backbone.
            this.separator =
                (prefix.slice(-1) === '/') ? '' : '/';

            // if you want to match "books" and "books/" without creating separate routes, set this
            // option to "true" and the sub-router will automatically create those routes for you.
            var createTrailingSlashRoutes = options && options.createTrailingSlashRoutes;

            if (this.appRoutes) {

                appRoutes = this.appRoutes;
                controller = this.controller;

                if (options && options.controller) {
                    controller = options.controller;
                }

                _.each(appRoutes, function(callback, path) {

                    if (path) {

                        // strip off any leading slashes in the sub-route path,
                        // since we already handle inserting them when needed.
                        if (path.substr(0) === '/') {
                            path = path.substr(1, path.length);
                        }

                        routes[prefix + this.separator + path] = callback;

                        if (createTrailingSlashRoutes) {
                            routes[prefix + this.separator + path + '/'] = callback;
                        }

                    } else {
                        // default routes (those with a path equal to the empty string)
                        // are simply registered using the prefix as the route path.
                        routes[prefix] = callback;

                        if (createTrailingSlashRoutes) {
                            routes[prefix + '/'] = callback;
                        }
                    }

                }, this);

                // Override the local sub-routes with the fully-qualified routes that we just set up.
                this.appRoutes = routes;

            }

            Marionette.AppRouter.prototype.constructor.call(this, options);
        }


    });
    /**
     * https://github.com/justspamjustin/BossView
     * BossView v 0.1.4
     */

    Marionette.BossView = Marionette.View.extend({

        template: function() {
            return '';
        },

        constructor: function() {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);
            this._initializeSubViews();
            this._afterInitializeSubViews();
            this.listenTo(this, 'render', this._onParentRendered);
        },

        getParentEl: function() {
            return this.$el;
        },

        _afterInitializeSubViews: function() {
            this._initializeChildViewEvents();
            this._initializeSubViewEventBubbling();
        },

        _initializeSubViews: function() {
            this.initializedSubViews = {};
            this._eachSubView(_.bind(this._initializeSubView, this));
        },

        _initializeSubView: function(subViewName, subViewFunction) {
            var subView = this._getInitializedSubView(subViewFunction);
            this._checkSubViewForRender(subView, subViewName);
            this[subViewName] = subView;
            this.initializedSubViews[subViewName] = subView;
        },

        initializeSubView: function(subViewName, subViewFunction) {
            this._initializeSubView(subViewName, subViewFunction);
            this._afterInitializeSubViews();
        },

        _getInitializedSubView: function(subViewFunction) {
            var subView;
            var isRenderableView = _.isFunction(subViewFunction.prototype.render);
            if (isRenderableView) {
                subView = this._initializeRenderableSubView(subViewFunction);
            } else {
                subView = subViewFunction.call(this);
            }
            return subView;
        },

        _initializeRenderableSubView: function(subViewFunction) {
            return new subViewFunction({
                model: this.model,
                collection: this.collection
            });
        },

        _checkSubViewForRender: function(subView, subViewName) {
            if (_.isUndefined(subView) || !_.isFunction(subView.render)) {
                throw new Error('The subview named ' + subViewName + ' does not have a render function.');
            }
        },

        _initializeChildViewEvents: function() {
            this._eachSubViewEvent(_.bind(function(subView, subViewEventName, subViewEventCallback) {
                subViewEventCallback = this._getSubViewEventCallbackFunction(subViewEventCallback, subViewEventName);
                if (subView === '*') {
                    this._listenToEventOnAllSubViews(subViewEventCallback, subViewEventName);
                } else {
                    if (subView) {
                        this.listenTo(subView, subViewEventName, subViewEventCallback);
                    }
                }
            }, this));
        },

        _getSubViewEventCallbackFunction: function(subViewEventCallback, subViewEventName) {
            if (_.isString(subViewEventCallback)) {
                this._checkForSubViewEventCallback(subViewEventCallback, subViewEventName);
                subViewEventCallback = this[subViewEventCallback];
            }
            return subViewEventCallback;
        },

        _listenToEventOnAllSubViews: function(subViewEventCallback, subViewEventName) {
            this._eachSubView(_.bind(function(subViewName) {
                var subViewInstance = this[subViewName];
                this.listenTo(subViewInstance, subViewEventName, subViewEventCallback);
            }, this));
        },

        _checkForSubViewEventCallback: function(subViewEventCallback, subViewEventName) {
            if (_.isUndefined(this[subViewEventCallback])) {
                throw new Error('This view has no function named ' + subViewEventCallback + ' to use as a callback for the event ' + subViewEventName);
            }
        },

        _initializeSubViewEventBubbling: function() {
            this._eachSubView(_.bind(function(subViewName) {
                var subView = this[subViewName];
                this.listenTo(subView, 'all', function() {
                    this.trigger(subViewName + ':' + arguments[0], arguments[1]);
                });
            }, this));
        },

        _onParentRendered: function() {
            this.trigger('subviews:before:render');
            this._renderSubViews();
            this.trigger('subviews:after:render');
        },

        _renderSubViews: function() {
            this._eachSubView(_.bind(this.renderSubView, this));
        },

        renderSubView: function(subViewName) {
            var mainSubViewContainer = this._getOption('mainSubViewContainer');
            var appendToEl = this.getParentEl();
            if (this._hasSubViewContainer(subViewName)) {
                appendToEl = this._getSubViewContainer(subViewName);
            } else if (mainSubViewContainer) {
                appendToEl = this.$(mainSubViewContainer);
            }
            this._renderSubView(subViewName, appendToEl);
        },

        _renderSubView: function(subViewName, appendToEl) {
            if (this._shouldRenderSubView(subViewName)) {
                this[subViewName].render().$el.appendTo(appendToEl);
                /**
                 * We need to call delegateEvents here because when Marionette renders a template
                 * it uses this.$el.html(templateHTML).  If this is the second render, then it will
                 * remove each of the subViews from the DOM, thus also unbinding each of their DOM
                 * events.  So this is necessary for any renders after the initial render.
                 */
                this[subViewName].delegateEvents();
                if (this[subViewName].viewShown) {
                    this[subViewName].viewShown.apply(this[subViewName], arguments);
                }

            }
        },

        _shouldRenderSubView: function(subViewName) {
            var renderConditionFunction = this._getSubViewRenderConditions()[subViewName];
            var hasRenderConditionFunction = _.isFunction(renderConditionFunction);
            return hasRenderConditionFunction ? renderConditionFunction.call(this) : true;
        },

        _eachSubView: function(callback) {
            if (this._getSubViews()) {
                for (var subViewName in this._getSubViews()) {
                    callback(subViewName, this._getSubViews()[subViewName]);
                }
            }
        },

        _eachSubViewEvent: function(callback) {
            var subViewEvents = this._getOption('subViewEvents');
            if (subViewEvents) {
                for (var subViewEventKey in subViewEvents) {
                    var split = this._splitSubViewEventKey(subViewEventKey);
                    var subView = split.subViewName === '*' ? '*' : this[split.subViewName];
                    callback(subView, split.subViewEventName, subViewEvents[subViewEventKey]);
                }
            }
        },

        _splitSubViewEventKey: function(subViewEventKey) {
            var subViewEventKeySplit = subViewEventKey.split(' ');
            return {
                subViewName: subViewEventKeySplit[0],
                subViewEventName: subViewEventKeySplit[1]
            }
        },

        _hasSubViewContainer: function(subViewName) {
            var subViewContainers = this._getOption('subViewContainers');
            return !_.isUndefined(subViewContainers) && !_.isUndefined(subViewContainers[subViewName]);
        },

        _getSubViewContainer: function(subViewName) {
            if (!this._hasSubViewContainer(subViewName)) {
                throw new Error('No subview container for subView: ' + subViewName);
            }
            return this.$(this._getOption('subViewContainers')[subViewName]);
        },

        remove: function() {
            Backbone.Marionette.ItemView.prototype.remove.apply(this, arguments);
            console.log('view removed');
            this._removeSubViews();
        },

        _removeSubViews: function() {
            _.each(this.initializedSubViews, function(subView) {
                subView.remove();
            });
        },

        _getSubViews: function() {
            var subViews = _.result(this, 'subViews');
            if (this.options.subViews) {
                subViews = _.result(this.options, 'subViews');
            }
            return subViews;
        },

        _getOption: function(optionName) {
            return this[optionName] || this.options[optionName];
        },

        _getSubViewRenderConditions: function() {
            return this._getOption('subViewRenderConditions') || {};
        }
    });


    //END BOSSVIEW


    var isClosable = function(p) {
        if (p && p.reset && typeof(p.reset) == 'function') {
            return true;
        }
        return false;
    };

    var isStopable = function(p) {
        if (p && p.stop && typeof(p.stop) == 'function') {
            return true;
        }
        return false;
    };

    _.extend(Backbone.Marionette.Application.prototype, {
        stop: function() {
            _.each(this._regionManager._regions, function(region) {
                region.reset();
            });
            if (this.onStop && typeof this.onStop === 'function') {
                this.onStop();
            }
        }
    });


    // object.watch
    if (!Object.prototype.watch) {
        Object.defineProperty(Object.prototype, "watch", {
            enumerable: false,
            configurable: true,
            writable: false,
            value: function(prop, handler) {
                var
                    oldval = this[prop],
                    newval = oldval,
                    getter = function() {
                        return newval;
                    },
                    setter = function(val) {
                        oldval = newval;
                        return newval = handler.call(this, prop, oldval, val);
                    };

                if (delete this[prop]) { // can't watch constants
                    Object.defineProperty(this, prop, {
                        get: getter,
                        set: setter,
                        enumerable: true,
                        configurable: true
                    });
                }
            }
        });
    }

    // object.unwatch
    if (!Object.prototype.unwatch) {
        Object.defineProperty(Object.prototype, "unwatch", {
            enumerable: false,
            configurable: true,
            writable: false,
            value: function(prop) {
                var val = this[prop];
                delete this[prop]; // remove accessors
                this[prop] = val;
            }
        });
    }
    return Marionette;
});
