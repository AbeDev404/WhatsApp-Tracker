import {View, StyleSheet, Text, TouchableOpacity, TextInput, ToastAndroid} from 'react-native'
import {useState} from 'react'
import auth from "@react-native-firebase/auth";

import GlobalStyle from '../../config/global.style'

const SignUp = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password1, setPassword1] = useState('')

    onRegister = () => {
        if(email === '' || password === '') {
            ToastAndroid.show('Please Input The Fields Correctly', ToastAndroid.LONG)
        } else if(password !== password1) {
            ToastAndroid.show('Please Input The PASSWORD Correctly', ToastAndroid.LONG)
        } else {
            auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
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
            <Text style={[GlobalStyle.title]}>SIGN UP</Text>
            <View style={GlobalStyle.inputContainerStyle}>
                <TextInput onChangeText={(e) => setEmail(e)} style={GlobalStyle.inputStyle} placeholder='Please Input Your Email' />
            </View>

            <View style={GlobalStyle.inputContainerStyle}>
                <TextInput onChangeText={(e) => setPassword(e)} style={GlobalStyle.inputStyle} secureTextEntry={true} placeholder='Please Input Your Password' />
            </View>

            <View style={GlobalStyle.inputContainerStyle}>
                <TextInput onChangeText={(e) => setPassword1(e)} style={GlobalStyle.inputStyle} secureTextEntry={true} placeholder='Please Confirm Your Password' />
            </View>

            <TouchableOpacity onPress={onRegister} style={[GlobalStyle.buttonStyle, GlobalStyle.flex('row', 'center', 'center')]}>
                <Text style={[GlobalStyle.buttonTextStyle, {color: 'white'}]}>REGISTER</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.push('SignIn')} style={[GlobalStyle.buttonStyle, GlobalStyle.flex('row', 'center', 'center')]}>
                <Text style={[GlobalStyle.buttonTextStyle, {color: 'white'}]}>LOGIN</Text>
            </TouchableOpacity>
            
        </View>
    )
}

export default SignUp