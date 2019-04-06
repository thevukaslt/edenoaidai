/* eslint-disable no-param-reassign */

import Dexie from 'dexie';
import router from './router';

/**
 * Returns initialized Dexie database instance
 *
 */
function getDatabaseInstance() {
    const database = new Dexie('edenoAidai');

    database.version(1).stores({
        songs: '++id, &songId, *title, verse, body, copyright',
    });

    return database;
}

/**
 * Checks if table is empty and needs to be populated
 *
 * @param {Dexie} table Table of Dexie Database
 */
function needsInstall(table) {
    return table
        .count()
        .then(count => count === 0)
        .catch(err => console.log(err));
}

export default async function(Vue) {
    const database = getDatabaseInstance();
    Vue.prototype.$songs = database.songs;

    // Redirect to installation page if not ready
    (await needsInstall(database.songs)) && router.push('/install');
}
