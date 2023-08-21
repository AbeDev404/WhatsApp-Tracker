import * as Notifications from 'expo-notifications'

const schedulePushNotification = async (title, body, data) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: body,
            data: data,
        },
        trigger: { seconds: 2 },
    });
}

export default schedulePushNotification