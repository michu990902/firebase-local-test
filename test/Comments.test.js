require('assert');
const firebase = require('@firebase/testing');
const projectId = 'firebase-local-tests';

describe('Database rules - comments', () => {
    it('Read as anonymus - deny', async () => {
        const db = firebase.initializeTestApp({projectId}).firestore();
        const testDoc = await db.collection("comments").doc('id1');
        await firebase.assertFails(testDoc.get());
    });

    it('Write as anonymus - deny', async () => {
        const db = firebase.initializeTestApp({projectId}).firestore();
        const testDoc = await db.collection("comments");
        await firebase.assertFails(testDoc.add({
            test: 'test',
        }));
    });

    it('Read as logged user - allow', async () => {
        const auth = {
            uid: 'user1',
        };
        const db = firebase.initializeTestApp({projectId, auth}).firestore();
        const testDoc = await db.collection("comments").doc('id1');
        await firebase.assertSucceeds(testDoc.get());
    });

    it('Write as logged user - allow', async () => {
        const auth = {
            uid: 'user1',
        };
        const db = firebase.initializeTestApp({projectId, auth}).firestore();
        // const testDoc = await db.collection("comments");
        // await firebase.assertSucceeds(testDoc.add({
        //     test: 'test',
        //     userId: auth.uid,
        // }));
        const testDoc = await db.collection("comments").doc('comment1');
        await firebase.assertSucceeds(testDoc.set({
            test: 'test',
            userId: auth.uid,
        }));
    });

    it('Update as logged user (not owner) - deny', async () => {
        const auth = {
            uid: 'user2',
        };
        const db = firebase.initializeTestApp({projectId, auth}).firestore();
        const testDoc = await db.collection("comments").doc('comment1');
        await firebase.assertFails(testDoc.update({
            test: 'test 2',
        }));
    });

    it('Update as logged user (owner) - allow', async () => {
        const auth = {
            uid: 'user1',
        };
        const db = firebase.initializeTestApp({projectId, auth}).firestore();
        const testDoc = await db.collection("comments").doc('comment1');
        await firebase.assertSucceeds(testDoc.update({
            test2: 'test 2',
        }));
    });
});