import {View, StyleSheet, Text, TouchableOpacity, TextInput, ToastAndroid} from 'react-native'
import {useState, useEffect} from 'react'
import auth from "@react-native-firebase/auth";
import * as SecureStore from 'expo-secure-store'


import GlobalStyle from '../../config/global.style'

const SignIn = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        SecureStore.getItemAsync('is_login')
            .then(result => {
                if(result !== null && result !== undefined && result !== '') {
                    navigation.replace('Dashboard', {user: JSON.parse(result)})
                }
            })
    }, [])

    const onLogin = () => {
        // navigation.replace('Dashboard')
        
        if(email === '' || password === '') {
            ToastAndroid.show('Please Input The Fields Correctly', ToastAndroid.LONG)
        } else {
            auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                SecureStore.setItemAsync('is_login', JSON.stringify(user))
                navigation.replace('Dashboard', {user: user})
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                ToastAndroid.show(`errorCode: ${errorCode}, errorMessage: ${errorMessage}`, ToastAndroid.LONG)
            });
        }
    }

    return (
        <View style={[GlobalStyle.flex('column', 'center', 'center'), {flex: 1, padding: 10}]}>
            <Text style={[GlobalStyle.title]}>SIGN IN</Text>
            <View style={GlobalStyle.inputContainerStyle}>
                <TextInput onChangeText={(e) => setEmail(e)} style={GlobalStyle.inputStyle} placeholder='Please Input Your Email' />
            </View>

            <View style={GlobalStyle.inputContainerStyle}>
                <TextInput onChangeText={(e) => setPassword(e)} style={GlobalStyle.inputStyle} secureTextEntry={true} placeholder='Please Input Your Password' />
            </View>

            <TouchableOpacity onPress={() => onLogin()} style={[GlobalStyle.buttonStyle, GlobalStyle.flex('row', 'center', 'center')]}>
                <Text style={[GlobalStyle.buttonTextStyle, {color: 'white'}]}>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.push('SignUp')} style={[GlobalStyle.buttonStyle, GlobalStyle.flex('row', 'center', 'center')]}>
                <Text style={[GlobalStyle.buttonTextStyle, {color: 'white'}]}>REGISTER</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SignIn