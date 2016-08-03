window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB ||  window.msIndexedDB;

var Database = {

    dbName: 'Book',
    tblHeaders: 'Headers',

    init: function() {
        try {
            var request = indexedDB.open(Database.dbName);
            request.onupgradeneeded = request.onsuccess = function(event) {
                var db = event.target.result;
                var storeNames = db.objectStoreNames;

                if(!storeNames.contains(Database.tblHeaders)) {
                    Database.uploadHeaders(db);
                }

                db.close();
            };
        } catch(e) {
            Database.onerror(e, false);
        }
    },

    onerror: function(event, show) {
        if (show === true) {
            alert('Ошибка работы базы данных. Обновите страницу');
        }
        Database.removeDB();
    },

    uploadHeaders: function(db) {
        try {
            var store = db.createObjectStore(Database.tblHeaders, {keyPath: 'id'});
            store.createIndex('id', 'id');
            for (var i in Headers) {
                store.put(Headers[i]);
            }
        } catch(e) {
            Database.onerror(e, false);
        }

    },

    removeDB: function() {
        indexedDB.deleteDatabase(Database.dbName);
    },

    findHeader: function(id, f) {
        try {
            var request = indexedDB.open(Database.dbName);
            request.onsuccess = function(event) {
                var db = event.target.result;
                try {
                    var store = db.transaction(Database.tblHeaders, 'readonly').objectStore(Database.tblHeaders);

                    store.get(id).onsuccess = function(event) {
                        var result = event.target.result;
                        f(result ? result : -1);
                    }
                } catch (e) {
                    Database.onerror(e, true);
                }
            }
        } catch(e) {
            Database.onerror(e, true);
        }
    }

}