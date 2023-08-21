import React, {useState, useEffect} from 'react';
import {Alert, Modal, StyleSheet, Text, TouchableOpacity, View, TextInput} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 

import GlobalStyle from '../config/global.style';

const ContactSettingsModal = ({visible, onClose}) => {
  const [_modalVisible, setModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('')
  const [contactName, setContactName] = useState('')

  useEffect(() => {
    setModalVisible(visible);
  }, [visible])

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={_modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={[styles.icon]} onPress={() => onClose()}>
                <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
            
            <View style={GlobalStyle.inputContainerStyle}>
                <TextInput onChange={(e) => setContactName(e)} style={GlobalStyle.inputStyle} placeholder='Please Input Contact Name' />
            </View>

            <View style={GlobalStyle.inputContainerStyle}>
                <TextInput onChange={(e) => setPhoneNumber(e)} style={GlobalStyle.inputStyle} placeholder='Please Input Phone Number' />
            </View>

            <TouchableOpacity onPress={onClose} style={[GlobalStyle.buttonStyle, GlobalStyle.flex('row', 'center', 'center')]}>
                <Text style={[GlobalStyle.buttonTextStyle, {color: 'white'}]}>ADD CONTACT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        position: 'relative',
    },
    icon: {
        position: 'absolute',
        top: 15,
        right: 15
    },
    phoneInput: {
        borderColor: '#ddd',
        borderWidth: 2,
        borderRadius: 2,
        padding: 16
    },
});

export default ContactSettingsModal;