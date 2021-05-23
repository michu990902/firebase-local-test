require('assert');
const firebase = require('@firebase/testing');
const projectId = 'firebase-local-tests';

describe('Database rules - basic tests', () => {
    before(() => {
        firebase.clearFirestoreData({
            projectId: projectId,
        });
    });
    
    it('Read record in nonexistent table - deny', async () => {
        const db = firebase.initializeTestApp({projectId}).firestore();
        const testDoc = await db.collection("non-existent-table").doc('id1');
        await firebase.assertFails(testDoc.get());
    });

    it('Write record in nonexistent table - deny', async () => {
        const db = firebase.initializeTestApp({projectId}).firestore();
        const testDoc = await db.collection("non-existent-table");
        await firebase.assertFails(testDoc.add({
            test: 'test',
        }));
    });
});