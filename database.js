
var Database = {

    dbName: 'Book',
    tblHeaders: 'Headers',

    init: function() {
        var request = indexedDB.open(Database.dbName);
        request.onupgradeneeded = request.onsuccess = function(event) {
            var db = event.target.result;
            var storeNames = db.objectStoreNames;

            if(!storeNames.contains(Database.tblHeaders)) {
                Database.uploadHeaders(db);
            }

            db.close();
        };
    },

    uploadHeaders: function(db) {
        var store = db.createObjectStore(Database.tblHeaders, {keyPath: 'id'});
        store.createIndex('id', 'id');
        for (var i in Headers) {
            store.put(Headers[i]);
        }
    },

    removeDB: function() {
        indexedDB.deleteDatabase(Database.dbName);
    },

    findHeader: function(id, f) {
        var request = indexedDB.open(Database.dbName);
        request.onsuccess = function(event) {
            var db = event.target.result;
            var store = db.transaction(Database.tblHeaders, 'readonly').objectStore(Database.tblHeaders);

            store.get(id).onsuccess = function(event) {
                var result = event.target.result;
                f(result ? result : -1);
            }
        }
    }

}