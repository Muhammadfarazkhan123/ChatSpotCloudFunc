const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// exports.sendNotificationToTopic=functions.firestore.document('chat/{Chatid}/Chats/{key}').onWrite(async(event)=>{
//     console.log(event,"first line")
// let title=event.after.get('name');
// console.log(event.after.get('name'),'name')
// let content=event.after.get('Msg');
// console.log(event.after.get('Msg'),'message')

// var message={
//     notification:{
//         title:title,
//         body:content
//     },
//     topic:'faraz'
// }
// console.log(message,"second line")

// let response =await admin.messaging().send(message)
// console.log(response,"check response")
// })

exports.sendNotificationToFcmToken = functions.firestore.document('Notification/{key}').onWrite(async (event, context) => {
    // console.log(event.after.get(),"get")
    // console.log(event.after.data(),"data")
    // console.log(context.params.key,"id")
    // console.log(event,"event")
    let PushId = context.params.key
    let Uid = event.after.get('Uid')
    let title = event.after.get('name')
    let content = event.after.get('Msg')
    console.log(Uid, "check code1")
    let FcmToken = []
    await admin.firestore().collection('FcmTokens').where("uid", "==", Uid).get().then((querySnapshot) => {
        // console.log(querySnapshot,"querySnapshot")    
        return querySnapshot.forEach(val => {

            console.log(val.id, "id hai")
            FcmToken.push(val.id)
            return val
        })
    })
    console.log("check code2")
    FcmToken.map(async token => {
        var message = {
            notification: {
                title: title,
                body: content
            },
            token: token
        }
        let response = await admin.messaging().send(message)
        console.log(response, "response hai yeh")
    })
    admin.firestore().collection('Notification').doc(PushId).delete()
})

