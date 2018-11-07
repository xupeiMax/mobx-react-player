import React, { Component } from 'react';
import './App.css';
import $ from 'jquery'
import jplayer from 'jplayer'
import Pubsub from 'pubsub-js'
import PropTypes from "prop-types";
import { observer, PropTypes as ObservablePropTypes } from "mobx-react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Header from './components/header'
import Play from './pages/play'
import MusicList from './pages/musiclist'
@observer
class App extends Component {
  static propTypes = {
    store: PropTypes.shape({
      musiclist: ObservablePropTypes.observableArrayOf(ObservablePropTypes.observableObject).isRequired,
      currentMusicItem: ObservablePropTypes.observableObject.isRequired
    }).isRequired
  }

  componentDidMount() {
    const store = this.props.store
    const model = this.props.model
    $('#player').jPlayer({
      supplied: 'mp3',
      wmode: 'window'
    });

    this.playMusic(store.currentMusicItem);
    $('#player').bind($.jPlayer.event.ended, (e) => {
      switch (model.cycleModel) {
        case 'cycle':
          this.autoPlayNext('cycle');
          break;
        case 'once':
          this.autoPlayNext('once');
          break;
        case 'random':
          this.autoPlayNext('random');
          break;
        default: 
          break;
      }
    })

    Pubsub.subscribe('PLAY_MUSIC', (msg, musicitem) => {
      this.playMusic(musicitem);
    })

    Pubsub.subscribe('PLAY_PREV', (msg) => {
      this.playNext("prev");
    })

    Pubsub.subscribe('PLAY_NEXT', (msg) => {
      this.playNext("next");
    })

    Pubsub.subscribe('DELETE_MUSIC', (msg, musicitem) => {
      this.props.store.removeMusicItem(musicitem)
    })

    Pubsub.subscribe('PLAY_REPEAT', (msg, model) => {
      this.props.model.toggleCycleModel(model)
    })
  }

  componentWillUnmount() {
    $('#player').unbind($.jPlayer.event.ended);
    Pubsub.unsubscribe('DELETE_MUSIC');
    Pubsub.unsubscribe('PLAY_MUSIC');
    Pubsub.unsubscribe('PLAY_PREV');
    Pubsub.unsubscribe('PLAY_NEXT');
    Pubsub.unsubscribe('PLAY_REPEAT');
  }

  playMusic(musicitem) {
    $('#player').jPlayer('setMedia', {
      mp3: musicitem.file
    }).jPlayer('play')
    this.props.store.toggleMusicItem(musicitem)
  }

  playNext(type = "next") {
    const store = this.props.store
    let index = this.getMusicIndex(store.currentMusicItem);
    let newIndex = null;
    let musicListLength = store.musiclist.length;
    let model = this.props.model.cycleModel;
    if (type === "next") {
      switch (model) {
        case 'random':
          do {
            newIndex = Math.floor(Math.random() * musicListLength);
          } while (newIndex === index)
          break;
        default:
          newIndex = (index + 1) % musicListLength;
      }
    } else {
      switch (model) {
        case 'random':
          do {
            newIndex = Math.floor(Math.random() * musicListLength);
          } while (newIndex === index)
          break;
        default:
          newIndex = (index - 1 + musicListLength) % musicListLength;
      }
    }
    if (!store.musiclist[newIndex]) return;
    this.playMusic(store.musiclist[newIndex]);
    this.props.store.toggleMusicItem(store.musiclist[newIndex])
  }
  autoPlayNext(model) {
    const store = this.props.store
    let index = this.getMusicIndex(store.currentMusicItem);
    let newIndex = null;
    let musicListLength = store.musiclist.length;
    switch (model) {
      case 'once':
        newIndex = index;
        break;
      case 'random':
        do {
          newIndex = Math.floor(Math.random() * musicListLength);
        } while (newIndex === index)
        break;
      default:
        newIndex = (index + 1) % musicListLength;
        break;
    }

    if (!store.musiclist[newIndex]) return;
    this.playMusic(store.musiclist[newIndex]);
    this.props.store.toggleMusicItem(store.musiclist[newIndex])
  }
  getMusicIndex(musicitem) {
    return this.props.store.musiclist.indexOf(musicitem);
  }
  render() {
    const store = this.props.store
    const currentMusicItem = store.currentMusicItem
    const musiclist = store.musiclist
    const cycleModel = this.props.model
    const Home = () => (
      <Play
        cycleModel={cycleModel}
        currentMusicItem={currentMusicItem}
      />
    );

    const List = () => (
      <MusicList
        currentMusicItem={currentMusicItem}
        musiclist={musiclist}
      />
    );
    return (
      <Router>
        <section>
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/list" component={List} />
          </Switch>
        </section>
      </Router>
    );
  }
}

export default App;
