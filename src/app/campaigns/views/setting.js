import Template from './../templates/setting.html'

export default class SettingView extends Marionette.View {
    constructor(options) {
        var props = $.extend({
            className: 'row mb-0'
        }, options)
        super(props)
        this.bindings = {
            '[name="val"]': {
                observe: 'val',
                onGet: (val) => {
                    if(this.model.get('type') == 'bool'){
                        if (val == 'true') return true
                        else if (val == 'false') return false
                    }
                    else if(this.model.get('type') == 'number') {
                        return val;
                    }
                    else if(this.model.get('type') == 'date') {
                        return moment(val).format('hh:mm A');
                    }
                },
                onSet: (val) => {
                    if(this.model.get('type') == 'bool'){
                        if (val) return 'true'
                        else if (!val) return 'false'
                    }
                    else if(this.model.get('type') == 'number') {
                        return val;
                    }
                    else if(this.model.get('type') == 'date') {
                        var dt = moment();
                        var tm = moment(val,'hh:mm A')
                        dt.hour(tm.get('hour'));
                        dt.minute(tm.get('minute'));
                        return dt.utc().format();
                    }
                }
            }
        }
    }
    parseName(name) {
        switch (name) {
            case 'USE_MOTION_SENSOR':
                return 'Use motion sensor:';
            case 'CONTINUOS_MOVE':
                return 'Continuos move:';
            default:
                var str = name.replace('USE_','').replace('_', ' ').toLowerCase();
                str = str.charAt(0).toUpperCase() + str.slice(1) + ':';
                return str;
        }
    }
    getTemplate() {
        var html = ``;
        switch (this.model.get('type')) {
            case 'bool':
                return `<div class="form-group row mb-1">
                        <label class="form-group-label col-sm-4 mb-1" for="${this.model.get('name')}">
                            ${this.parseName(this.model.get('name'))}
                        </label>
                        <div class="col-sm-8" style="height:15px">
                            <input class="form-check-input ml-0" title="${this.model.get('comment')}" type="checkbox" name="val"  id="${this.model.get('name')}">
                        </div>
                    </div>`
            case 'number':
                return `<div class="form-group row mb-1">
                            <label class="form-group-label col-sm-4" for="${this.model.get('name')}">
                                ${this.parseName(this.model.get('name'))}
                            </label>
                            <div class="col-sm-8">
                                <input class="form-control form-control-sm" title="${this.model.get('comment')}" type="number" name="val"  id="${this.model.get('name')}">
                            </div>
                        </div>`
            case 'date':
                return `<div class="form-group row mb-1">
                            <label for="${this.model.get('name')}" class="col-sm-4 col-form-label">${this.parseName(this.model.get('name'))}</label>
                            <div class="input-group date col-sm-8 input-group-sm mb-1" id="${this.model.get('name')}-container" data-target-input="nearest">
                                <input type="text" name="val" id="${this.model.get('name')}"  class="form-control form-control-sm datetimepicker-input" data-target="#${this.model.get('name')}-container" />
                                <div class="input-group-append" data-target="#${this.model.get('name')}-container" data-format="LT"  data-toggle="datetimepicker">
                                    <div class="input-group-text">
                                        <i class="fa fa-clock-o"></i>
                                    </div>
                                </div>
                            </div>
                        </div>`
        }
    }
}