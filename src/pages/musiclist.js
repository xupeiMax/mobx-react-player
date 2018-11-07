import React, { Component } from 'react'
import './musiclist.css'
import MusicListItem from '../components/musiclistitem'
import { observer } from "mobx-react";

@observer
class MusicList extends Component{
    render(){
        let musiclist = this.props.musiclist;
        let listEle = null;
        listEle = musiclist.map((item) => {
            return (
                <MusicListItem key={item.id} focus={item === this.props.currentMusicItem} musicitem={item}>{item.title}</MusicListItem>
            );
        })
        return (
            <ul>
                { listEle }
            </ul>
        );
    }
}

export default MusicList;