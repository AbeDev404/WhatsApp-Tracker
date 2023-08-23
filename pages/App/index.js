import { ScrollView, Text, View, StyleSheet, TouchableOpacity, Image, Switch, ActivityIndicator } from 'react-native'
import { Menu, Divider, Button } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'; 
import {useState, useEffect, useRef} from 'react'
import WebView from 'react-native-webview';
import { AntDesign } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store'
import { Ionicons } from '@expo/vector-icons';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { activateKeepAwakeAsync } from 'expo-keep-awake';
import Toast from 'react-native-toast-message';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import injectScript from '../../config/injectScript';
import useTrackOnlineHistory from '../../hooks/trackOnlineHistory';
import registerForPushNotificationsAsync from '../../hooks/registerNotification';
import ContactSettingsModal from '../../components/Contact.Settings.modal';
import GlobalStyle from '../../config/global.style';
import Config from '../../config'

const BACKGROUND_FETCH_TASK = 'BACKGROUND_FETCH_TASK';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();

  console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

const Dashboard = ({navigation}) => {
    const [visible, setVisible] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [isSafe, SetIsSafe] = useState(false)
    const [isReady, SetIsReady] = useState(false)
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(true);
    const [trackList, setTrackList] = useState([])
    const [tracking, setTracking] = useState(false)
    const _webView = useRef(null)
    const [trackOnlineHistory, trackOfflineHistory, getOnlineHistory] = useTrackOnlineHistory()

    useEffect(() => {
        setTimeout(() => {
            SetIsSafe(true)
        }, 1000)

        activateKeepAwakeAsync();
        registerForPushNotificationsAsync()

        SecureStore.getItemAsync('track_list').then(result => {
            if(result !== null && result !== undefined && result !== '') {
                setTrackList(JSON.parse(result))
            }
        });
    }, [])
    useEffect(() => {
        SecureStore.setItemAsync('track_list', JSON.stringify(trackList));
        if(tracking) {
            _webView.current.injectJavaScript(`
                setTrackList('${JSON.stringify(trackList)}')
                true;
            `)
        }
    }, [trackList])

    _openMenu = () => setVisible(true);
    _closeMenu = () => setVisible(false);
    onMessage = (message) => {
        if(message.nativeEvent.data === 'Link a device') {
            SetIsSafe(false)
            navigation.replace('WAConnect')
            setLoading(false)
        } else {
            let data = JSON.parse(message.nativeEvent.data)
            if(data.type === 'auth') {
                if(data.isLoggedIn === true) {
                    _webView.current.injectJavaScript(`
                    getContacts();
                    true;
                    `)
                }
            } else if(data.type === 'contacts') {
                setContacts(data.data)
                setLoading(false);
            } else if(data.type === 'track') {
                console.log(message.nativeEvent.data)
                let data = JSON.parse(message.nativeEvent.data)

                let contact = contacts.filter((item, index, array) => item.id.indexOf(`${data.phone}@`) >= 0)[0];
                if(data.status === 'online') {
                    trackOnlineHistory(contact, data.phone, Date.now());
                } else {
                    trackOfflineHistory(contact, data.phone, Date.now());
                }
            }
        }
    }

    const onUpdateContact = () => {
        setLoading(true)
        _webView.current.injectJavaScript(`
        getContacts();
        true;
        `)

    }
    const onAlarm = (index, phone_number) => {
        let length = trackList.filter((_item, index, array) => _item == phone_number).length;
        if(length > 0) {
            setTrackList(e => e.filter((item, index, array) => item !== phone_number))
        } else {
            setTrackList(e => [...e, phone_number])
        }
    }

    const onLogout = () => {
        // _webView.current.injectJavaScript(`
        //     document.evaluate('/html/body/div/div/div/div[4]/header/div[2]/div/span/div[4]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();

        //     setTimeout(function() {
        //         document.evaluate('/html/body/div/div/div/div[4]/header/div[2]/div/span/div[4]/span/div/ul/li[6]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
        //         setTimeout(function() {
        //             document.evaluate('/html/body/div/div/span[2]/div/div/div/div/div/div/div[3]/div/button[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
        //         }, 500)
        //     }, 500);
        // `)

        SetIsReady(false)
        setTracking(false)
        SetIsSafe(false)
        _closeMenu();
        SecureStore.setItemAsync('contacts', '')
        SecureStore.setItemAsync('is_login', '')
        navigation.replace('SignIn')
    }

    const onToogleTrack = () => {
        if(tracking) {
            setTracking(false)
            _webView.current.injectJavaScript(`
                setTracking(false);
                true;
            `)
        } else {
            _webView.current.injectJavaScript(`
                setTrackList('${JSON.stringify(trackList)}')
                setTracking(true);
                true;
            `)
            setTracking(true)
        }
    }

    const onGoOnlineHistory = () => {
        _closeMenu()
        SetIsReady(false)
        SetIsSafe(false)
        setTracking(false)
        navigation.push('History')
    }

    return (
        <View style={[Styles.container, GlobalStyle.flex('column', 'center', 'flex-start')]}>
            <View style={[GlobalStyle.BoxShadow, Styles.navbar, GlobalStyle.flex('row', 'space-between', 'center')]}>
                <TouchableOpacity onPress={onToogleTrack}>
                    <MaterialCommunityIcons name="lightning-bolt" size={30} color={tracking ? '#23DB77' : 'gray'} />
                </TouchableOpacity>
                <Text style={[Styles.title]}>WhatsTracker</Text>
                <Menu
                    visible={visible}
                    onDismiss={_closeMenu}
                    anchor={
                    <TouchableOpacity onPress={_openMenu}>
                        <MaterialIcons name="more-vert" size={24} color="#23DB77" />
                    </TouchableOpacity>}
                >
                    <Menu.Item onPress={() => onGoOnlineHistory()} title="See Online History" />
                    <Menu.Item onPress={() => onUpdateContact()} title="Update Contact" />
                    <Divider />
                    <Menu.Item onPress={() => onLogout()} title="Log Out" />
                </Menu>
            </View>
            {!loading && (
                <ScrollView style={{width: '100%', marginTop: 10}} contentContainerStyle={[{ paddingBottom: 30}, GlobalStyle.flex('column', 'center', 'flex-start')]}>
                    {contacts.map((item, index, array) => {
                        let phone_number = item.id.substring(0, item.id.indexOf('@'));
                        return (
                            <View key={index} style={[GlobalStyle.flex('row', 'space-between', 'center'), GlobalStyle.round, GlobalStyle.BoxShadow, {width: '90%', backgroundColor:'white', marginVertical: 10, padding: 5, }]}>
                                <View style={[GlobalStyle.flex('row', 'flex-start', 'center')]}>
                                    <View style={{marginRight: 20}}>
                                        <View style={[{width: 60, height: 60}, GlobalStyle.flex('row', 'center', 'center')]}>
                                            <AntDesign name="user" color="#23DB77" size={50} />
                                        </View>
                                    </View>
                                    <View>
                                        <Text style={{fontSize: GlobalStyle.SCREEN_WIDTH / 25, fontWeight: 'bold'}}>{item.name === undefined ? 'No Name' : item.name}</Text>
                                        <Text style={{fontSize: GlobalStyle.SCREEN_WIDTH / 25}}>+ {phone_number}</Text>
                                    </View>
                                </View>
                                <Switch onValueChange={() => onAlarm(index, phone_number)} value={trackList.filter((_item, index, array) => _item === phone_number).length !== 0} />
                            </View>
                        )  
                    })}
                </ScrollView>
            )}
            {/* <View style={[GlobalStyle.flex('row', 'center', 'center')]}>
                <View style={[GlobalStyle.BoxShadow, {borderRadius: 100, backgroundColor: '#23DB77', padding: 15}]}>
                    <TouchableOpacity onPress={onToogleTrack}>
                    <MaterialCommunityIcons name="lightning-bolt" size={40} color=color={tracking ? '#23DB77' : 'gray'} />
                        <MaterialIcons name="online-prediction" size={40} color={tracking ? 'white' : 'gray'} />
                    </TouchableOpacity>
                </View>
            </View> */}

            {isSafe && (
                <WebView
                    // injectedJavaScript={injectScript}
                    source={{uri: 'https://web.whatsapp.com/'}}
                    // style={{width: 300, height: 600, position: 'absolute', top: '150%'}} 
                    containerStyle={{width: 0, height: 0}}
                    onMessage={onMessage}
                    ref={_webView}
                    onLoadEnd={() => {
                        _webView.current.injectJavaScript(injectScript);
                        _webView.current.injectJavaScript(`
                        window.ReactNativeWebView.postMessage(JSON.stringify({type: 'auth', isLoggedIn: WAPI.isLoggedIn(), isConnected: WAPI.isConnected()}))
                        true;
                        `)
                    }}
                    contentMode="desktop"
                    userAgent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"
                />
            )}
            {loading && (
                <View style={[{position: 'absolute', width: GlobalStyle.SCREEN_WIDTH, height: GlobalStyle.SCREEN_HEIGHT, left: 0, top: 0}, GlobalStyle.flex('row', 'center', 'center')]}>
                    {/* <Text style={{fontSize: GlobalStyle.SCREEN_WIDTH / 20}}>Loading...</Text> */}
                    <ActivityIndicator size={64} color="#00ff00" />
                </View>
            )}
            <Toast />
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
})

export default Dashboard