/**import Dispatcher from './Dispatcher';
import { EventEmitter } from 'events';
import * as Constants from './Constants';

class TimerStore extends EventEmitter
{
    constructor()
    {
        super();
        Dispatcher.register(this.onAction.bind(this));
        this.state = {
            currentContact:null,
            nextContact:{
                aosTime: new Date(Date.now() + 120000),
                style:Constants.NEXT_STYLE,
                label:'Next Contact 1'
            }
        };
    }

    onAction(payload)
    {
        switch(payload.actionName){
            case Constants.SHIFT_CONTACTS:
                this.state = {
                    currentContact:{
                        countdown:180,
                        losTime:new Date(Date.now() + 180000),
                        style:Constants.CURRENT_STYLE},
                    nextContact:{
                        aosTime:new Date(Date.now() + 240000),
                        style:Constants.NEXT_STYLE,
                        label:'Next Contact 2'}
                };
                break;
            case Constants.NEXT_IN_WARNING:
                this.state.nextContact.style = Constants.NEXT_WARN_STYLE;
                break;
            case Constants.CURRENT_IN_WARNING:
                this.state.currentContact.style = Constants.CURRENT_WARN_STYLE;
                break;
            case Constants.CURRENT_DONE:
                this.state.currentContact.style = Constants.CURRENT_DONE_STYLE;
                break;
        }
        this.emit('change');
    }

    addChangeListener(callback)
    {
        this.on('change', callback);
    }

    getCurrentContact()
    {
        return this.state.currentContact;
    }

    getNextContact()
    {
        return this.state.nextContact;
    }
}


export default new TimerStore
*/