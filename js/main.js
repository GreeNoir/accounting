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

var Form = {

    initMainChakraPanel: function() {
        var positions = ['front', 'back', 'middle'];
        var translate = ['спереди', 'сзади', 'по центру']
        for (var i=0; i<3; i++) {
            var fieldset = $('<div class="col-md-4"><fieldset><legend></legend>Чакры '+translate[i]+'<legend></fieldset></legend></div>');
            for (var j=0; j<MainChakraViolations.length; j++) {
                var id = j+1;
                var checkbox = $('<div class="form-group row"><div class="checkbox"><label><input type="checkbox" data-position="' +positions[i]+'" data-id="'+id+'" value="">'+ MainChakraViolations[j].chakra +'</label></div>');
                fieldset.append(checkbox);
            }
            $('#chakra_main_form').append(fieldset);
        }
    },

    initSmallChakraPanel: function() {
        var index = 0;
        for (var i=0; i<3; i++) {
            var div = $('<div class="col-md-4"></div>');
            for (var j=0; j<9; j++) {
                var id = index+1;
                var checkbox = $('<div class="form-group row"><div class="checkbox"><label><input type="checkbox" data-id="'+ id +'" value="">'+ SmallChakraViolations[index].chakra +'</label></div></div>');
                div.append(checkbox);
                index++;
            }
            $('#chakra_small_form').append(div);
        }
    },

    initCocoonPart: function() {
        var div = $('<div class="form-group row"></div>');
        for (var i=1; i<6; i++) {
            var id = i+1;
            var radio = $('<label class="radio-inline"><input type="radio" name="cocoon" data-id="'+id+'" value="">'+CocoonViolations[i].subname+'</label>');
            div.append(radio);
        }
        $('#cocoon_violations').append(div);
    }
}
