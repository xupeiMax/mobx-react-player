import React, { Component } from 'react'
import './musiclistitem.css'
import Pubsub from 'pubsub-js'

class MusicListItem extends Component{
    constructor(props) {
        super(props);
        this.state = {
        };    
    }
    playMusic(musicitem){
        Pubsub.publish('PLAY_MUSIC',musicitem)
    }
    deleteMusic(musicitem,e){
        e.stopPropagation();
        Pubsub.publish('DELETE_MUSIC', musicitem)        
    }
    render(){
        let musicitem = this.props.musicitem;
        return (
            <li onClick={this.playMusic.bind(this,musicitem)} className={`component-musiclistitem row ${this.props.focus ? 'focus':''}`}>
                <p><strong>{musicitem.title}</strong> - {musicitem.artist}</p>
                <p onClick={this.deleteMusic.bind(this,musicitem)} className="-col-auto delete"></p>
            </li>
        );
    }
}

export default MusicListItem;