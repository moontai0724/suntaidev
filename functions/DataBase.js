// packages
const sqlite = require("sqlite");
const path = require("path");

// ================================================== Start My Program ==================================================

var db_settings;
setTimeout(async function () {
    // Cause app.js located at root directory
    db_settings = await sqlite.open(path.join(process.cwd(), "database", "settings.sqlite"), { Promise });
});

module.exports = {
    /**
     * Enter sql by yourself!
     * @requires sqlite A module to use sqlite.
     * @param {string} sql sql command.
     * @returns {Promise<Array<JSON>>} An array of JSON format list of specific data, or returns a promise rejection with error.
     */
    all: function (sql) {
        return new Promise((resolve, reject) => {
            try {
                console.log('SQLITE All: ' + sql);
                setTimeout(() => db_settings.all(sql).then(resolve, reject), db_settings ? 0 : 2000);
            } catch (error) {
                // When database is not ready for I/O.
                reject(error);
            }
        });
    },
    /**
     * Enter sql by yourself!
     * @requires sqlite A module to use sqlite.
     * @param {string} sql sql command.
     * @returns {Promise<Array<JSON>>} An JSON format of specific data, or returns a promise rejection with error.
     */
    get: function (sql) {
        return new Promise((resolve, reject) => {
            try {
                console.log('SQLITE Get: ' + sql);
                setTimeout(() => db_settings.get(sql).then(resolve, reject), db_settings ? 0 : 2000);
            } catch (error) {
                // When database is not ready for I/O.
                reject(error);
            }
        });
    },
    /**
     * Enter sql by yourself!
     * @requires sqlite A module to use sqlite.
     * @param {string} sql sql command.
     * @returns {Promise} Nothing returned.
     */
    run: function (sql) {
        return new Promise((resolve, reject) => {
            try {
                console.log('SQLITE Run: ' + sql);
                setTimeout(() => db_settings.run(sql).then(resolve, reject), db_settings ? 0 : 2000);
            } catch (error) {
                // When database is not ready for I/O.
                reject(error);
            }
        });
    },
    /**
     * Read an entire table or a specific row in a table from database.
     * @requires sqlite A module to use sqlite.
     * @param {string} tableName Table name in database, like: Groups, Owners, Users... etc.
     * @param {string} [id] (Optional) Specific id in a table, such like a groupId.
     * @returns {Promise<Array<JSON>>} An array of JSON format list of specific data, or returns a promise rejection with error.
     */
    readTable: function (tableName, id) {
        return new Promise((resolve, reject) => {
            if (/\s/.test(tableName)) reject('tableName have whitespace(s).');
            if (/\s/.test(id)) reject('id have whitespace(s).');
            try {
                console.log('SELECT * FROM ' + tableName + (id ? ' WHERE id="' + id + '"' : ''));
                setTimeout(() => db_settings.all('SELECT * FROM ' + tableName + (id ? ' WHERE id="' + id + '"' : '')).then(resolve, reject), db_settings ? 0 : 2000);
            } catch (error) {
                // When database is not ready for I/O.
                reject(error);
            }
        });
    },
    /**
     * Insert value(s) into a table.
     * @requires sqlite A module to use sqlite.
     * @param {string} tableName Table name in database, like: Groups, Owners, Users... etc.
     * @param {string | Array<string>} value Value(s) to be update, can be an array or a string.
     * @example "Value To Insert" || ["Value1", "Value2", "Value3"]
     * @returns {Promise<boolean>} Promise resolve with a parameter of true, or returns a promise rejection with error.
     */
    insertValue: function (tableName, value) {
        return new Promise((resolve, reject) => {
            if (/\s/.test(tableName)) reject('tableName have whitespace(s).');
            let valueToInsert = "";
            if (typeof (value) == 'object') {
                valueToInsert = value.join('", "');
            } else {
                if (value.includes('"')) value = value.replace('"', '');
                // if (value.includes(',')) {
                //     value = value.replace(/ , /g, ',').replace(/, /g, ',').replace(/ ,/g, ',').split(',');
                //     valueToInsert = value[0];
                //     for (let i = 1; i < value.length; i++) valueToInsert += '", ' + value[i];
                // } else valueToInsert = value;
                valueToInsert = value;
            }
            // Start insert values.
            try {
                console.log('INSERT INTO ' + tableName + ' VALUES ("' + valueToInsert + '")');
                setTimeout(() => db_settings.run('INSERT INTO ' + tableName + ' VALUES ("' + valueToInsert + '")').then(resolve, reject), db_settings ? 0 : 2000);
            } catch (error) {
                // When database is not ready for I/O.
                reject(error);
            }
        });
    },
    /**
     * Update value(s) in a table.
     * @requires sqlite A module to use sqlite.
     * @param {string} tableName Table name in database, like: Groups, Owners, Users... etc.
     * @param {string} id Specific id in a table, such like a groupId.
     * @param {JSON} formattedData If there have a data in JSON format, put it here; else, leave it empty ("").
     * @param {string | Array<string>} [columnName] Specific column to update, can be an array or a string.
     * @example ["columnName1", "columnName2", "columnName3"] || "columnName"
     * @param {string | Array<string>} [value] Value(s) to be update, can be an array or a string.
     * @example ["Value1", "Value2", "Value3"] || "Value To Update"
     * @example updateValue("EarthquakeNotification", "U4af4980629...", "", "area", "新北市");
     * @example updateValue("EarthquakeNotification", "U4af4980629...", {"area": "新北市"});
     * @returns {Promise<boolean>} Promise resolve with a parameter of true, or returns a promise rejection with error.
     */
    updateValue: function (tableName, id, formattedData, columnName, value) {
        return new Promise((resolve, reject) => {
            if (/\s/.test(tableName)) reject('tableName have whitespace(s).');
            if (/\s/.test(id)) reject('id have whitespace(s).');
            let valueToUpdate = "";
            if (formattedData && formattedData != "") {
                try {
                    switch (typeof (formattedData)) {
                        case 'object':
                            formattedData = JSON.parse(JSON.stringify(formattedData));
                            break;
                        case 'string':
                            formattedData = JSON.parse(formattedData);
                            break;
                    }
                    for (let key in formattedData) {
                        valueToUpdate += ', ' + key + '="' + formattedData[key] + '"';
                    }
                    valueToUpdate = valueToUpdate.replace(', ', "");
                } catch (error) {
                    if (error) reject('JSON data format doesn\'t currect!');
                }
            } else {
                switch (typeof (columnName)) {
                    case 'object':
                        valueToUpdate = columnName[0] + '="' + value[0] + '"';
                        for (let i = 1; i < columnName.length; i++) valueToUpdate += ', ' + columnName[i] + '="' + value[i] + '"';
                        break;
                    case 'string':
                        if (/\s/.test(columnName)) reject('columnName have whitespace(s).');
                        if (columnName.includes('"')) columnName = columnName.replace('"', '');
                        if (value.includes('"')) value = value.replace('"', '');
                        // if (columnName.includes(',') && value.includes(',')) {
                        //     columnName = columnName.replace(/ , /g, ',').replace(/ , /g, ',').replace(/, /g, ',').replace(/ ,/g, ',').split(',');
                        //     value = value.replace(/ , /g, ',').replace(/, /g, ',').replace(/ ,/g, ',').split(',');
                        //     valueToUpdate = columnName[0] + '="' + value[0] + '"';
                        //     for (let i = 1; i < columnName.length; i++) valueToUpdate += ', ' + columnName[i] + '="' + value[i] + '"';
                        // } else valueToUpdate = columnName + '="' + value + '"';
                        valueToUpdate = columnName + '="' + value + '"';
                        break;
                    default:
                        reject('Value type is not accepted.');
                        break;
                }
            }
            try {
                console.log('UPDATE ' + tableName + ' SET ' + valueToUpdate + ' WHERE id="' + id + '"');
                setTimeout(() => db_settings.run('UPDATE ' + tableName + ' SET ' + valueToUpdate + ' WHERE id="' + id + '"').then(resolve, reject), db_settings ? 0 : 2000);
            } catch (error) {
                // When database is not ready for I/O.
                reject(error);
            }
        });
    },
    /**
     * Remove a specific row in a table from database.
     * @requires sqlite A module to use sqlite.
     * @param {string} tableName Table name in database, like: Groups, Owners, Users... etc.
     * @param {string} id Specific id in a table, such like a groupId.
     * @returns {Promise<boolean>} Promise resolve with a parameter of true, or returns a promise rejection with error.
     */
    deleteWithId: function (tableName, id) {
        return new Promise((resolve, reject) => {
            if (/\s/.test(tableName)) reject('tableName have whitespace(s).');
            if (/\s/.test(id)) reject('id have whitespace(s).');
            try {
                console.log('DELETE FROM ' + tableName + ' WHERE id="' + id + '"');
                setTimeout(() => db_settings.run('DELETE FROM ' + tableName + ' WHERE id="' + id + '"').then(resolve, reject), db_settings ? 0 : 2000);
            } catch (error) {
                reject(error);
            }
        });
    },
    /**
     * Create a table with sql command.
     * @requires sqlite A module to use sqlite.
     * @param {string} tableName Table name in database, like: Groups, Owners, Users... etc.
     * @param {string} [sql] sql command to create column(s) without id column.
     * @default sql CREATE TABLE tableName ("id" TEXT UNIQUE, PRIMARY KEY("id"))
     * @example datatype: NULL, INTEGER, REAL, TEXT, BLOB
     * @example NOT NULL, UNIQUE, DEFAULT(), CHECK()
     */
    createTable: function (tableName, sql = "") {
        return new Promise((resolve, reject) => {
            if (/\s/.test(tableName)) reject('tableName have whitespace(s).');
            try {
                console.log('CREATE TABLE "' + tableName + '" ("id" TEXT UNIQUE,' + sql + ' PRIMARY KEY("id"))');
                setTimeout(() => db_settings.run('CREATE TABLE "' + tableName + '" ("id" TEXT UNIQUE,' + sql + ', PRIMARY KEY("id"))').then(resolve, reject), db_settings ? 0 : 2000);
            } catch (error) {
                reject(error);
            }
        });
    },
    /**
     * Check if a table already exist or not.
     * @requires sqlite A module to use sqlite.
     * @param {string} tableName The table name to check.
     * @returns {Promise<Boolean>} If the table already exists, returns true; else, return false. Or returns a promise rejection with error.
     */
    checkTable: function (tableName) {
        return new Promise((resolve, reject) => {
            if (/\s/.test(tableName)) reject('tableName have whitespace(s).');
            try {
                setTimeout(() => db_settings.all('SELECT * FROM sqlite_master').then(tables => {
                    if (tables.findIndex(value => value.tbl_name == tableName) > -1) resolve(true);
                    else resolve(false);
                }, reject), db_settings ? 0 : 2000);
            } catch (error) {
                reject(error);
            }
        });
    }
}