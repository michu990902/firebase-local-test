require('assert');
const firebase = require('@firebase/testing');
const projectId = 'firebase-local-tests';

describe('Database rules - posts', () => {
    it('Read as anonymus - allow', async () => {
        const db = firebase.initializeTestApp({projectId}).firestore();
        const testDoc = await db.collection("posts").doc('id1');
        await firebase.assertSucceeds(testDoc.get());
    });

    it('Write as anonymus - allow', async () => {
        const db = firebase.initializeTestApp({projectId}).firestore();
        const testDoc = await db.collection("posts");
        await firebase.assertSucceeds(testDoc.add({
            test: 'test',
        }));
    });

    it('Read as logged user - allow', async () => {
        const auth = {
            uid: 'user1',
        };
        const db = firebase.initializeTestApp({projectId, auth}).firestore();
        const testDoc = await db.collection("posts").doc('id1');
        await firebase.assertSucceeds(testDoc.get());
    });

    it('Write as logged user - allow', async () => {
        const auth = {
            uid: 'user1',
        };
        const db = firebase.initializeTestApp({projectId, auth}).firestore();
        const testDoc = await db.collection("posts");
        await firebase.assertSucceeds(testDoc.add({
            test: 'test',
            userId: auth.uid,
        }));
    });
});