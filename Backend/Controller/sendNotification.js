const { Expo } = require('expo-server-sdk');
const expo = new Expo();
const sendNotifications = async (pushToken, title, body) => {
    try {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            return;
        }
        const message = {
            to: pushToken,
            sound: 'default',
            title,
            body
        }
        const messages = [message]
        // Batching nofications
        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];
        (async () => {
            for (let chunk of chunks) {
                try {
                    let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                    console.log(ticketChunk);
                    tickets.push(...ticketChunk);
                } catch (error) {
                    console.error(error);
                }
            }
        })();
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    sendNotifications,
    expo
}