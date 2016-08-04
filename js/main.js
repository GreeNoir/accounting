/**
 * Created by Angelika on 04.08.16.
 */

var DB = {

    dbName: 'Book',
    tblParts: 'Parts',

    init: function() {
        $.indexedDB(DB.dbName, {
            "schema": {
                "1": function(versionTransaction) {
                        var parts = versionTransaction.createObjectStore(DB.tblParts, {
                            "keyPath": "itemId"
                        });
                        //parts.createIndex("price");
                    },
                "2": function(versionTransaction) { }
            }
        }).done(function(){
                // Once the DB is opened with the object stores set up, show data from all tables
                window.setTimeout(function(){
                    DB.uploadBook();
                }, 200);
        });
    },

    uploadBook: function() {
        var data = Book;
        $.indexedDB(DB.dbName).transaction(DB.tblParts).then(function(){
            console.log("Transaction completed, all data inserted");
        }, function(err, e){
            console.log("Transaction NOT completed", err, e);
        }, function(transaction){
            var parts = transaction.objectStore(DB.tblParts);
            parts.clear();
            $.each(data, function(i){
                _(parts.add(this));
            })
        });
    },

    deleteDB: function(){
        // Delete the database
        $.indexedDB(DB.dbName).deleteDatabase();
    }
}

function _(promise){
    promise.then(function(a, e){
        console.log("Action completed", e.type, a, e);
    }, function(a, e){
        console.log("Action completed", a, e);
    }, function(a, e){
        console.log("Action completed", a, e);
    })
}
