import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator} from 'react-native'
import { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { activateKeepAwakeAsync } from 'expo-keep-awake';
import {
    Collapse,
    CollapseHeader,
    CollapseBody,
} from 'accordion-collapse-react-native';

import useTrackOnlineHistory from '../../hooks/trackOnlineHistory';
import GlobalStyle from '../../config/global.style';

const History = ({navigation}) => {
    const [trackList, setTrackList] = useState([])
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([])
    const [trackOnlineHistory, trackOfflineHistory, getOnlineHistory] = useTrackOnlineHistory()

    useEffect(() => {
        activateKeepAwakeAsync();

        setLoading(true)
        SecureStore.getItemAsync('track_list').then(async (result) => {
            if(result !== null && result !== undefined && result !== '') {
                let _array = JSON.parse(result);
                setTrackList(_array)

                let _t = {};
                for(let i = 0 ; i < _array.length ; i++) {
                    let history = await getOnlineHistory(_array[i]);
                    _t[_array[i]] = history
                }
                setHistory(_t)
                setLoading(false)
            } else {
                setLoading(false)
            }
        });
    }, [])

    return (
        <View style={[Styles.container, GlobalStyle.flex('column', 'center', 'flex-start')]}>

            <View style={[GlobalStyle.BoxShadow, Styles.navbar, GlobalStyle.flex('row', 'space-between', 'center')]}>
                <TouchableOpacity onPress={() => navigation.replace('Dashboard')}>
                    <Ionicons name="arrow-back-outline" size={24} color="#23DB77" />
                </TouchableOpacity>
                <Text style={[Styles.title]}>WhatsTracker</Text>
                <View></View>
            </View>

            {!loading && (
                <ScrollView style={{width: '100%', marginTop: 10}} contentContainerStyle={[{ paddingBottom: 30}, GlobalStyle.flex('column', 'center', 'flex-start')]}>
                    {trackList.map((item, index, array) => {
                        let time = history[item];
                        console.log(history)
                        if(time === undefined || time === null) {
                            return (<></>)
                        } else {
                            let _array = [];
                            let keys = Object.keys(time)
    
                            for(let i = keys.length / 2 - 1 ; i >= 0 ; i --) {
                                let offline_time = new Date(parseInt(keys[i * 2]))
                                let online_time = new Date(parseInt(keys[i * 2 + 1]))
    
                                let temp = {
                                    online: `${online_time.getMonth() + 1}/${online_time.getDate()}/${online_time.getFullYear()} ${online_time.getHours()}:${online_time.getMinutes()}:${online_time.getSeconds()}`,
                                    offline: `${offline_time.getMonth() + 1}/${offline_time.getDate()}/${offline_time.getFullYear()} ${offline_time.getHours()}:${offline_time.getMinutes()}:${offline_time.getSeconds()}`
                                }
                                _array.push(temp)
                            }
    
                            return (
                                <Collapse style={{width: '90%'}}>
                                    <CollapseHeader style={{width: '100%'}}>
                                        <View key={index} style={[GlobalStyle.flex('row', 'space-between', 'center'), GlobalStyle.round, GlobalStyle.BoxShadow, {width: '100%', backgroundColor:'white', marginVertical: 10, padding: 5, }]}>
                                            <View style={[GlobalStyle.flex('row', 'flex-start', 'center')]}>
                                                <View style={{marginRight: 20}}>
                                                    <View style={[{width: 60, height: 60}, GlobalStyle.flex('row', 'center', 'center')]}>
                                                        <AntDesign name="user" color="#23DB77" size={50} />
                                                    </View>
                                                </View>
                                                <Text style={{fontSize: GlobalStyle.SCREEN_WIDTH / 25, fontWeight: 'bold'}}>+ {item}</Text>
                                            </View>
                                            <View></View>
                                        </View>
                                    </CollapseHeader>
                                    <CollapseBody style={{width: '100%'}}>
                                        <View key={index} style={[GlobalStyle.flex('column', 'flex-start', 'center'), GlobalStyle.round, GlobalStyle.BoxShadow, {width: '100%', backgroundColor:'white', marginVertical: 10, padding: 5, }]}>
                                        {_array.map((_item, _index, _array) => {
                                            return (
                                                <View style={[GlobalStyle.flex('row', 'flex-start', 'center')]}>
                                                    <View style={{marginRight: 20}}>
                                                        <View style={[{width: 60, height: 60}, GlobalStyle.flex('row', 'center', 'center')]}>
                                                            <AntDesign name="clockcircleo" color="#23DB77" size={30} />
                                                        </View>
                                                    </View>
                                                    <Text style={{fontSize: GlobalStyle.SCREEN_WIDTH / 25, fontWeight: 'bold'}}>{`online ${_item.online}\noffline ${_item.offline}`}</Text>
                                                </View>
                                            )
                                        })}
                                        </View>
                                    </CollapseBody>
                                </Collapse>
                            )
                        }
                    })}
                </ScrollView>
            )}
            

            {loading && (
                <View style={[{position: 'absolute', width: GlobalStyle.SCREEN_WIDTH, height: GlobalStyle.SCREEN_HEIGHT, left: 0, top: 0}, GlobalStyle.flex('row', 'center', 'center')]}>
                    {/* <Text style={{fontSize: GlobalStyle.SCREEN_WIDTH / 20}}>Loading...</Text> */}
                    <ActivityIndicator size={64} color="#00ff00" />
                </View>
            )}
        </View>
    )
}

const Styles = StyleSheet.create({
    container: {
        flex: 1
    },
    navbar: {
        height: GlobalStyle.SCREEN_HEIGHT / 12,
        width: '100%',
        backgroundColor: 'white',
        paddingHorizontal: 20
    },
    title: {
        fontSize: GlobalStyle.SCREEN_WIDTH / 15,
        fontWeight: 'bold',
        color: '#23DB77'
    }
});

export default History