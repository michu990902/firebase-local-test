require('assert');
const firebase = require('@firebase/testing');
const projectId = 'firebase-local-tests';

describe('Database rules - projects', () => {
    // TODO: anonym, logged, member, admin (not member) 
    it('Create admin', async () => {
        const auth = {
            uid: 'admin',
        };
        const db = firebase.initializeTestApp({projectId, auth}).firestore();
        const testDoc = await db.collection("users").doc('admin');
        await firebase.assertSucceeds(testDoc.set({
            uid: 'admin',
            roles: {
                admin: true,
            },
        }));
    });

    it('Write as anonymus - deny', async () => {
        const db = firebase.initializeTestApp({projectId}).firestore();
        const testDoc = await db.collection("projects");
        await firebase.assertFails(testDoc.add({
            test: 'test',
        }));
    });

    it('Write as admin - allow', async () => {
        const auth = {
            uid: 'admin',
        };
        const db = firebase.initializeTestApp({projectId, auth}).firestore();
        const testDoc = await db.collection("projects").doc('project1');
        await firebase.assertSucceeds(testDoc.set({
            test: 'test admin',
            userId: auth.uid,
            members: ['member'],
        }));
    });

    it('Write as member - deny', async () => {
        const auth = {
            uid: 'member',
        };
        const db = firebase.initializeTestApp({projectId, auth}).firestore();
        const testDoc = await db.collection("projects").doc('project1');
        await firebase.assertSucceeds(testDoc.update({
            test: 'test member',
        }));
    });

    it('Update as logged (not member) - deny', async () => {
        const auth = {
            uid: 'user',
        };
        const db = firebase.initializeTestApp({projectId, auth}).firestore();
        const testDoc = await db.collection("projects").doc('project1');
        await firebase.assertFails(testDoc.update({
            test: 'test user (not member)',
        }));
    });

    it('Write as logged (not member) - deny', async () => {
        const auth = {
            uid: 'user',
        };
        const db = firebase.initializeTestApp({projectId, auth}).firestore();
        const testDoc = await db.collection("projects");
        await firebase.assertFails(testDoc.add({
            test: 'test user (not member)',
            userId: auth.uid,
        }));
    });

    //

    it('Read as anonymus - deny', async () => {
        const db = firebase.initializeTestApp({projectId}).firestore();
        const testDoc = await db.collection("projects").doc('project1');
        await firebase.assertFails(testDoc.get());
    });

    it('Read as logged user (not member) - deny', async () => {
        const auth = {
            uid: 'user',
        };
        const db = firebase.initializeTestApp({projectId, auth}).firestore();
        const testDoc = await db.collection("projects").doc('project1');
        await firebase.assertFails(testDoc.get());
    });

    it('Read as member - allow', async () => {
        const auth = {
            uid: 'member',
        };
        const db = firebase.initializeTestApp({projectId, auth}).firestore();
        const testDoc = await db.collection("projects").doc('project1');
        await firebase.assertSucceeds(testDoc.get());
    });

    it('Read as admin - allow', async () => {
        const auth = {
            uid: 'admin',
        };
        const db = firebase.initializeTestApp({projectId, auth}).firestore();
        const testDoc = await db.collection("projects").doc('project1');
        await firebase.assertSucceeds(testDoc.get());
    });
});