import database from '@react-native-firebase/database';
import schedulePushNotification from './scheduleNotification';

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
                if(data[keys[0]] === 'offline') {
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
                if(data[keys[0]] === 'online') {
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