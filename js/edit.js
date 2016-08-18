/**
 * Created by Angelika on 17.08.16.
 */

var DiagnosticsEditor = {

    editParams: {
        type    : 'textarea',
        submit  : 'OK',
        cancel  : 'Отмена',
        cssclass : 'editable',
        tooltip : "Нажмите для редактирования..",
        onblur  : 'cancel'
    },

    init: function() {
        DiagnosticsEditor.chakraInit();
        DiagnosticsEditor.smallChakraInit();
        DiagnosticsEditor.cocoonPartInit();
        DiagnosticsEditor.kharicheskayaInit();
        DiagnosticsEditor.thinLevelsInit();
        DiagnosticsEditor.confidenceInit();
        DiagnosticsEditor.organSystemsInit();
        DiagnosticsEditor.organsInit();
    },

    chakraInit: function() {
        for (var i in MainChakraViolations) {
            var chakra = MainChakraViolations[i];
            var row = $('<tr><td class="first_column">' +chakra.chakra+ '</td><td class="list_pos"></td></tr>');
            var subrow_front = $('<tr><td>Спереди</td><td class="edit" data-id="'+i+'" data-position="front">' + chakra.front + '</td></tr>');
            var subrow_middle = $('<tr data-position="middle"><td>По центру</td><td class="edit" data-id="'+i+'" data-position="middle">' + chakra.middle + '</td></tr>');
            var subrow_back = $('<tr data-position="back"><td>Сзади</td><td class="edit" data-id="'+i+'" data-position="back">'+ chakra.back +'</td></tr>');
            var subtable = $('<table class="table"><tr><th>Позиция</th><th>Описание</th></tr></table>');
            subtable.append(subrow_front).append(subrow_middle).append(subrow_back);
            row.find('td.list_pos').append(subtable);
            $('#Descriptions table#chakra').append(row);
        }

        $('#Descriptions table#chakra .edit').editable(
            function(value, settings) {
                var id = $(this).attr('data-id');
                var position = $(this).attr('data-position');
                MainChakraViolations[id][position] = value;

                var key = 'mainChakra';
                localforage.setItem(key, MainChakraViolations, function() {
                    localforage.getItem(key, function(err, readValue) {
                        MainChakraViolations = readValue;
                    });
                });

                return(value);
            },
            DiagnosticsEditor.editParams
        ).click(DiagnosticsEditor.btnDesign);
    },

    smallChakraInit: function() {
        for (var i in SmallChakraViolations) {
            var smallChakra = SmallChakraViolations[i];
            var s = smallChakra.description;
            var row = $('<tr><td class="first_column">'+smallChakra.chakra+'</td><td class="edit" data-id="'+i+'">'+s+'</td></tr>');
            $('#Descriptions table#small_chakra').append(row);
        }

        $('#Descriptions table#small_chakra .edit').editable(
            function(value, settings) {
                var id = $(this).attr('data-id');
                SmallChakraViolations[id].description = value;
                var key = 'smallChakra';
                localforage.setItem(key, SmallChakraViolations, function() {
                    localforage.getItem(key, function(err, readValue) {
                        SmallChakraViolations = readValue;
                    });
                });

                return(value);
            },
            DiagnosticsEditor.editParams
        ).click(DiagnosticsEditor.btnDesign);
    },

    cocoonPartInit: function() {
        for (var i in CocoonViolations) {
            var cocoon = CocoonViolations[i];
            var row = $('<tr><td class="first_column">'+ cocoon.violotion +'</td><td class="edit" data-id="'+i+'" class="edit">'+ cocoon.description +'</td></tr>');
            $('#Descriptions table#descr_cocoon').append(row);
        }

        $('#Descriptions table#descr_cocoon .edit').editable(
            function(value, settings) {
                var id = $(this).attr('data-id');
                CocoonViolations[id].description = value;
                var key = 'cocoonViolations';
                localforage.setItem(key, CocoonViolations, function() {
                    localforage.getItem(key, function(err, readValue) {
                        CocoonViolations = readValue;
                    });
                });

                return(value);
            },
            DiagnosticsEditor.editParams
        ).click(DiagnosticsEditor.btnDesign);
    },

    kharicheskayaInit: function() {
        for (var i in KharicheskayaLineViolations) {
            var violation = KharicheskayaLineViolations[i];
            var row = $('<tr><td class="first_column">'+ violation.trans +'</td><td class="edit" data-id="'+i+'">'+ violation.description +'</td></tr>');
            $('#Descriptions table#descr_kharicheskaya').append(row);
        }

        $('#Descriptions table#descr_kharicheskaya .edit').editable(
            function(value, settings) {
                var id = $(this).attr('data-id');
                KharicheskayaLineViolations[id].description = value;
                var key = 'kharicheskayaViolations';
                localforage.setItem(key, KharicheskayaLineViolations, function() {
                    localforage.getItem(key, function(err, readValue) {
                        KharicheskayaLineViolations = readValue;
                    });
                });

                return(value);
            },
            DiagnosticsEditor.editParams
        ).click(DiagnosticsEditor.btnDesign);
    },

    thinLevelsInit: function() {
        for (var i in ThinLevels) {
            var level = ThinLevels[i];
            var row = $('<tr><td class="first_column">'+level.level+'</td><td class="edit" data-id="'+i+'">'+ level.description +'</td></tr>');
            $('#Descriptions table#descr_thinlevels').append(row);
        }

        $('#Descriptions table#descr_thinlevels .edit').editable(
            function(value, settings) {
                var id = $(this).attr('data-id');
                ThinLevels[id].description = value;
                var key = 'thinLevels';
                localforage.setItem(key, ThinLevels, function() {
                    localforage.getItem(key, function(err, readValue) {
                        ThinLevels = readValue;
                    });
                });

                return(value);
            },
            DiagnosticsEditor.editParams
        ).click(DiagnosticsEditor.btnDesign);
    },

    confidenceInit: function() {
        for (var i in IndicatorsPersonal) {
            var item = IndicatorsPersonal[i];
            var row = $('<tr><td class="first_column">'+item.level+'</td><td class="edit" data-id="'+i+'">'+ item.description +'</td></tr>');
            $('#Descriptions table#descr_indicators').append(row);
        }

        $('#Descriptions table#descr_indicators .edit').editable(
            function(value, settings) {
                var id = $(this).attr('data-id');
                IndicatorsPersonal[id].description = value;
                var key = 'indicatorsPersonal';
                localforage.setItem(key, IndicatorsPersonal, function() {
                    localforage.getItem(key, function(err, readValue) {
                        IndicatorsPersonal = readValue;
                    });
                });

                return(value);
            },
            DiagnosticsEditor.editParams
        ).click(DiagnosticsEditor.btnDesign);
    },

    organSystemsInit: function() {

    },

    organsInit: function() {

    },

    btnDesign: function() {
        $('.editable input').addClass('btn').addClass('btn-primary').addClass('btn-sm');
    }
}