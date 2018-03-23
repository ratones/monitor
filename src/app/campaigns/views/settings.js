import SettingView from './setting';
import Template from './../templates/settings.html';
import SettingsCollection from './../collections/settings';
import SettingsModel from './../models/settings';
import SettingModel from './../models/settings';
export default class SettingsView extends Marionette.CompositeView {
    constructor(options) {
        var props = $.extend({
            events: {
                'click #btnSave': 'save',
                'click #btnDefaults': 'loadDefaults'
            }
        }, options)
        super(props)
        this.template = Template;
        this.childView = SettingView;
        this.parentId = options.parent_id;
        this.version = options.version;
        this.isnew = false;
        this.collection = new SettingsCollection();
        this.getSettings()
        this.getSettingsList();
    }

    serializeData() {
        return { version: this.version };
    }

    getSettings() {
        var self = this;
        $.ajax({
            url: app.baseUrl + 'utils/settingsbyversion/' + self.version
        }).then((resp) => {
            if (resp.length == 0) {
                self.isnew = true;
            }
            self.collection.reset(resp);
        });
    }

    getSettingsList() {
        var self = this;
        $.get(app.baseUrl + 'utils/settingslist').then((response) => {
            $.each(response, (i, setting) => {
                self.$('#settingsList').append(`<a class="dropdown-item setting-item" href="#">${setting}</a>`)
            });
            self.$('.setting-item').on('click', self.loadFrom.bind(self, event));
        })
    }

    attachHtml(collectionView, itemView) {
        itemView.model.set('version', this.version);
        switch (itemView.model.get('group')) {
            case "General":
                collectionView.$('#General').append(itemView.$el);
                if (itemView.model.get('type') == 'date') {
                    $.fn.datetimepicker.Constructor.Default = $.extend({}, $.fn.datetimepicker.Constructor.Default, {
                        format: 'hh:mm A'
                    });
                    // itemView.model.set('val',moment(itemView.model.get('val')).format('hh:mm:ss'));
                    $(`#${itemView.model.get('name')}`).datetimepicker();
                }
                break;
            case "LED":
                collectionView.$('#LED').append(itemView.$el);
                break;
            case "Motor":
                collectionView.$('#Motor').append(itemView.$el);
                break;
            case "Movement":
                collectionView.$('#Movement').append(itemView.$el);
                break;
            case "Detection":
                collectionView.$('#Detection').append(itemView.$el);
                break;
        }

        itemView.stickit()
        // collectionView.$el.append(itemView.$el);
    }

    save(e) {
        e.preventDefault();
        var url = 'utils/updatesettings'
        if (this.isnew) {
            url = 'utils/insertsettings';
        }
        $.ajax({
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            url: app.baseUrl + url,
            data: JSON.stringify(this.collection.toJSON())
        }).then(() => {
            console.log('settings saved')
        })
        console.log(this.collection.toJSON())
    }

    loadDefaults() {
        var self = this;
        event.preventDefault()
        $.ajax({
            url: app.baseUrl + 'utils/settingsbyversion/default'
        }).then((resp) => {
            $.each(resp, (i, setting) => {
                if (self.isnew) {
                    var md = new SettingModel(setting);
                    md.unset('id');
                    self.collection.push(md);
                } else {
                    var mdl = self.collection.find((m) => { return m.get('name') == setting.name });
                    if (mdl) {
                        mdl.set('val', setting.val)
                    }
                }
            })
            // self.collection.reset(resp);
        });
    }

    loadFrom() {
        var self = this;
        event.preventDefault();
        var version = $(event.target).text();
        $.ajax({
            url: app.baseUrl + 'utils/settingsbyversion/' + version
        }).then((resp) => {
            $.each(resp, (i, setting) => {
                if (self.isnew) {
                    var md = new SettingModel(setting);
                    md.unset('id');
                    self.collection.push(md);
                } else {
                    var mdl = self.collection.find((m) => { return m.get('name') == setting.name });
                    if (mdl) {
                        mdl.set('val', setting.val)
                    }
                }
            })
        });
    }
}