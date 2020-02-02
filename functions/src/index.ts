import * as admin from 'firebase-admin';

admin.initializeApp({storageBucket: 'trigonscouting-dd18a.appspot.com'});
import * as userFunctions from './users'

export const listAllUsers = userFunctions.listAllUsers;

export const createUser = userFunctions.createUser;
export const deleteUser = userFunctions.deleteUser;
export const updateEmail = userFunctions.updateEmail;
export const resetPassword = userFunctions.resetPassword;
