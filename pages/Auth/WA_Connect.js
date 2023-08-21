import {View, StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator} from 'react-native'
import WebView from 'react-native-webview'
import {useEffect, useState} from 'react'
import { activateKeepAwakeAsync } from 'expo-keep-awake';

import GlobalStyle from '../../config/global.style'
import Logo from '../../components/logo'

const WhatsAppConnect = ({navigation}) => {
    const jsCode = `
    setInterval(function() {
        const is_link = document.getElementsByTagName('body')[0].innerHTML.indexOf('Link a device') >= 0;
        if(!is_link) {
            window.ReactNativeWebView.postMessage('Link a device');
        } else {
            if(document.getElementsByTagName('body')[0].innerHTML.indexOf('Click to reload QR code') >= 0) location.href = location.href;
            let qrcode = document.getElementsByTagName('canvas')[0].toDataURL("image/jpeg").split(';base64,')[1];
            window.ReactNativeWebView.postMessage(qrcode);
        }
    }, 5000)
    `
    const [isSafe, SetIsSafe] = useState(false)
    const [qrCode, setQRCode] = useState(null)

    useEffect(() => {
        activateKeepAwakeAsync()
        setTimeout(() => {
            SetIsSafe(true)
        }, 3000)
    }, [])

    return (
        <View style={[styles.container, GlobalStyle.flex('column', 'center', 'flex-start')]}>
            {isSafe && (
                <WebView 
                    javaScriptEnabled={true}
                    injectedJavaScript={jsCode}
                    source={{uri: 'https://web.whatsapp.com'}}
                    style={styles.webView} 
                    containerStyle={styles.webView}
                    onLoadProgress={({ nativeEvent }) => {
                    console.log(nativeEvent.progress)
                    }}
                    contentMode="desktop"
                    userAgent="Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:90.0) Gecko/20100101 Firefox/90.0"
                    onMessage={event => {
                        if(event.nativeEvent.data === 'Link a device') {
                            SetIsSafe(false); 
                            navigation.replace('Dashboard')
                        } else {
                            setQRCode(event.nativeEvent.data)
                        }
                    }}
                />
            )}

            <Text style={[GlobalStyle.title, {textAlign: 'center', fontSize: 25}]}>Please Scan This QR Code To Link With Your Device</Text>
            { qrCode !== null ? (
                <View style={{position: 'relative'}}>
                    <Image style={{width: 264, height: 264}} source={{uri : `data:image/png;base64,${qrCode}`}} /> 
                    <Logo style={{position: 'absolute', left: 128 - 32, top: 128 - 32, width: 64, height: 64}} />
                </View>
            ) : (<View style={{width: 264, height: 264, position: 'relative'}} >
                    <ActivityIndicator style={{position: 'absolute', left: 128 - 32, top: 128 - 32, width: 64, height: 64}} size={64} color="#00ff00" />
                </View>)}
          
            <TouchableOpacity onPress={() => {SetIsSafe(false); navigation.replace('Dashboard')}} style={[GlobalStyle.buttonStyle, GlobalStyle.flex('row', 'center', 'center')]}>
                <Text style={[GlobalStyle.buttonTextStyle, {color: 'white'}]}>Continue</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    webView: {
        display: 'none',
        width: 0, 
        height: 0,
        position: 'absolute'
    }
})

export default WhatsAppConnect