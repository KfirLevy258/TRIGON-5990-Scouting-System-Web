import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'


export const listAllUsers = functions.https.onCall(() => {
  return admin.auth().listUsers();
});

export const createUser = functions.https.onCall((data => {
  const email = data.email;
  const password = data.password;
  const phoneNumber = data.phoneNumber;
  const name = data.name;

  const db = admin.firestore();

  let userDetails;

  if (phoneNumber && email) {
    userDetails = {
      email: email,
      emailVerified: true,
      phoneNumber: phoneNumber,
      password: password,
      displayName: name,
      disabled: false
    };
  } else {
    if(phoneNumber) {
      userDetails = {
        phoneNumber: phoneNumber,
        displayName: name,
        disabled: false
      };
    } else {
      userDetails = {
        email: email,
        emailVerified: true,
        password: password,
        displayName: name,
        disabled: false
      };
    }
  }


  return admin.auth().createUser(userDetails)
    .then(user  => {
      return db.collection('users').doc(user.uid).set({
        email: email,
        phoneNumber: phoneNumber,
        name: name,
        photoURL: null,
        groupIds: []
      })
        .then(() => {
          return user;
        })
    })
}));

export const deleteUser = functions.https.onCall(data => {
  const uid = data.uid;

  deleteUserIcon(uid)
    .catch(err => console.log(err.message));
  return admin.auth().deleteUser(uid);

});

const deleteUserIcon = function(uid: string) {
  return admin.storage().bucket().file(`users/${uid}`).delete();
};

export const updateEmail = functions.https.onCall((data => {
  const uid = data.uid;
  const email = data.email;

  return admin.auth().updateUser(uid, {
    email: email,
    emailVerified: true,
  });
}));

export const resetPassword = functions.https.onCall((data => {
  const uid = data.uid;
  const password = data.password;

  return admin.auth().updateUser(uid, {
    password: password
  });
}));

export const addGroupToUser = function(uid: string, gid: string) {
  const db = admin.firestore();
  const userRef = db.collection("users").doc(uid);

  return db.runTransaction(transaction => {
    return transaction.get(userRef)
      .then(queryResult => {
        const userRecord = queryResult.data();
        const groupIds = userRecord && userRecord.groupIds ? userRecord.groupIds : [];
        groupIds.push(gid);
        return transaction.update(userRef, {
          groupIds: groupIds
        })
      })
  })
};

export const removeGroupFromUser = function(uid: string, gid: string) {
  const db = admin.firestore();
  const userRef = db.collection("users").doc(uid);

  return db.runTransaction(transaction => {
    return transaction.get(userRef)
      .then(queryResult => {
        const userRecord = queryResult.data();
        const groupIds = userRecord && userRecord.groupIds ? userRecord.groupIds : [];
        const index = groupIds.findIndex((obj: any) => {
          return obj.gid === gid;
        });
        groupIds.splice(index, 1);
        return transaction.update(userRef, {
          groupIds: groupIds
        })
      })
  })
};
