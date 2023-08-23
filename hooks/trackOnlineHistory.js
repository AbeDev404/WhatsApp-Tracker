import database from '@react-native-firebase/database';
import schedulePushNotification from './scheduleNotification';
import Toast from 'react-native-toast-message';

const useTrackOnlineHistory = () => {
    
    const trackOnlineHistory = (contact, phone, time) => {
        
        database().ref(`/history/${phone}`).once('value')
        .then((result) => {
            if(result.val() === null) {
                let data = {}; data[`${time}`] = 'online'
                database().ref(`/history/${phone}`).set(data)
            } else {
                let data = result.val();
                let keys = Object.keys(data);
                keys = keys.sort((a, b) => Number(b) - Number(a))
                if(data[`${keys[0]}`] === 'offline') {
                    Toast.show({ type: 'success', position: 'top', text1: `${contact.name === undefined ? 'No Name' : contact.name}`, text2: 'IS ONLINE NOW 👋', visibilityTime: 5000, autoHide: true, topOffset: 30, bottomOffset: 40 });
                    schedulePushNotification('WhatsTrack Notification', `${contact.name === undefined ? 'No Name' : contact.name} is Online`, data)
                    data[`${time}`] = 'online';
                    database().ref(`/history/${phone}`).set(data)
                }
            }
        })
    }
    // schedulePushNotification('WhatsTrack Notification', `${contact.name === undefined ? 'No Name' : contact.name} is Online`, data)
    const trackOfflineHistory = (contact, phone, time) => {
        database().ref(`/history/${phone}`).once('value')
        .then((result) => {
            if(result.val() !== null) {
                let data = result.val();
                let keys = Object.keys(data);
                keys = keys.sort((a, b) => Number(b) - Number(a))
                if(data[`${keys[0]}`] === 'online') {
                    Toast.show({ type: 'error', position: 'top', text1: `${contact.name === undefined ? 'No Name' : contact.name}`, text2: 'IS OFFLINE NOW 👋', visibilityTime: 5000, autoHide: true, topOffset: 30, bottomOffset: 40 });
                    schedulePushNotification('WhatsTrack Notification', `${contact.name === undefined ? 'No Name' : contact.name} is Offline`, data)
                    data[`${time}`] = 'offline';
                    database().ref(`/history/${phone}`).set(data)
                }
            }
        })
    }

    const getOnlineHistory = (phone) => {
        return new Promise((resolve, reject) => {
            database().ref(`/history/${phone}`).once('value')
            .then(result => resolve(result.val()))
            .catch(error => {})
        })
    }

    return [trackOnlineHistory, trackOfflineHistory, getOnlineHistory]
}

export default useTrackOnlineHistory