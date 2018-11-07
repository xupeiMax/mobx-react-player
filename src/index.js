import React from 'react';
import ReactDOM from 'react-dom';
import { observable, action } from 'mobx';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { MUSIC_LIST } from './sources/musiclist'

class Store {
    @observable musiclist = MUSIC_LIST;
    @observable currentMusicItem = this.musiclist[0];
   

    @action.bound removeMusicItem(musicitem) {
        this.musiclist.remove(musicitem)
    }

    @action.bound toggleMusicItem(musicitem) {
        this.currentMusicItem = musicitem
    }

}
class Model {
    @observable cycleModel = 'cycle'
    @action.bound toggleCycleModel(model) {
        this.cycleModel = model
    }
}
const store = new Store()
const model = new Model()
ReactDOM.render(<App store={store} model={model} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
