/**
 * Created by Angelika on 04.08.16.
 */

var Form = {

    validators: [],
    accountFormValid: false,
    tabsFormValid: false,
    needValidate: true,
    isValid: false,

    levels: ['Ф', 'Э', 'А', 'М'],
    initTitle: 'Экспертная система диагностики биоэнергетического состояния',
    isIE: false,

    setNeedValidate: function(v) {
        Form.needValidate = (v == 1 ? true : false);
    },

    setValid: function(v) {
        Form.isValid = v;
    },

    addValidator: function(v) {
        Form.validators.push(v);
    },

    checkIE: function() {
        if(navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > 0) {
            Form.isIE = true;
        }
    },

    init: function() {
        Form.checkIE();

        if (Form.isIE) {
            $('#ie_error').modal();
            $('button#reset').addClass('disabled');
            $('button#reset').off('click');
        }

        $('input[name="validate"]').change(function() {
            var v = $('input[name="validate"]:checked').val();
            Form.setNeedValidate(v);
        });
        $('button[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });

        loadData(function() {
            Form.initValidator();
            Form.initMainChakraPanel();
            Form.initSmallChakraPanel();
            Form.initCocoonPart();
            Form.initOrganSystemsDiagnosticsPart();
            Form.initOrganDiagnosticsPart();
            DiagnosticsEditor.init();

            var hash = window.location.hash.substr(1);
            if (hash.length && hash !== 'Form') {
                $('html, body').animate({
                    scrollTop: $('#'+hash).offset().top
                }, 100);
            }
        });
    },

    resetValidators: function() {
        for (var i in Form.validators) {
            Form.validators[i].resetForm();
        }
        $('#validation_disabled').modal();
        $('#account_form_msg').addClass('hidden');
        $('#tabs_form_msg').addClass('hidden');
        $('#tab_energetics').removeClass('error');
        $('#tab_confidence').removeClass('error');
        return true;
    },

    initMainChakraPanel: function() {
        $('#chakra_main_form #mainContent').empty();
        var positions = ['front', 'back', 'middle'];
        var translate = ['спереди', 'сзади', 'по центру']
        for (var i=0; i<3; i++) {
            var fieldset = $('<div class="col-md-4"><fieldset><legend>Чакры '+translate[i]+'</legend></fieldset></div>');
            for (var j=0; j<MainChakraViolations.length; j++) {
                var id = j+1;
                var checkbox = $('<div class="form-group row"><div class="checkbox"><label><input type="checkbox" name="'+positions[i]+'" value="'+j+'">'+ MainChakraViolations[j].chakra +'</label></div>');
                fieldset.append(checkbox);
            }
            $('#chakra_main_form #mainContent').append(fieldset);
        }
    },

    initSmallChakraPanel: function() {
        $('#chakra_small_form').empty();
        var index = 0;
        for (var i=0; i<3; i++) {
            var div = $('<div class="col-md-4"></div>');
            for (var j=0; j<9; j++) {
                var checkbox = $('<div class="form-group row"><div class="checkbox"><label><input type="checkbox" name="'+ index +'" value="1">'+ SmallChakraViolations[index].chakra +'</label></div></div>');
                div.append(checkbox);
                index++;
            }
            $('#chakra_small_form').append(div);
        }
    },

    initCocoonPart: function() {
        var div = $('#cocoon_violations div.basic');
        div.empty();
        for (var i=1; i<6; i++) {
            var id = i+1;
            var radio = $('<label class="radio-inline"><input type="radio" required="true" name="cocoon" value="'+ id +'">'+CocoonViolations[i].subname+'</label>');
            div.append(radio);
        }
    },

    initOrganSystemsDiagnosticsPart: function() {
        $('#organ #organ_systems_form').empty();
        var part1 = $('<div class="col-md-6"></div>');
        var part2 = $('<div class="col-md-6"></div>');

        var k = 1;
        var m = 6;// Math.trunc(OrganSystems.length / 2);

        for (var i in OrganSystems) {
            var row = $('<div class="form-group row"><div class="col-md-5"><label class="control-label">' + OrganSystems[i].name +'</label></div></div>');
            var checkboxes = $('<div class="col-md-7"></div>');
            for (var j in ThinLevels) {
                var level = ThinLevels[j];
                var checkbox = $('<div class="checkbox-inline"><label><input type="checkbox" data-id="'+i+'" data-level="'+j+'">'+ level.L +'</label></div>');
                checkboxes.append(checkbox);
            }
            row.append(checkboxes);
            if (k <= m) {
                part1.append(row);
            } else {
                part2.append(row);
            }
            k++;
        }
        $('#organ #organ_systems_form').append(part1).append(part2);
    },

    initOrganDiagnosticsPart: function() {
        $('#organs #organs_form').empty();
        var n = OrganDiagnostics.length;
        for (var i in OrganDiagnostics) {
            if (OrganDiagnostics[i].hasOwnProperty('parts')) {
                n++;
                n += OrganDiagnostics[i].parts.length;
            }
        }

        var n = 64;
        var m = 31;//Math.trunc(n/2)-1;
        var k = 1;

        var initOrganCheckboxes = function(obj, pair, i, p) {
            var pairs = ["Л", "П"];

            var organLength = obj.organ.length;
            var className = organLength > 20 ? ' small' : '';

            var row = $('<div class="form-group row"><div class="col-md-4"><label class="control-label'+className+'">'+ obj.organ +'</label></div></div>');
            for (var j in Form.levels) {
                var checkbox = '<div class="checkbox-inline"><label><input type="checkbox" data-main-index="'+ i +'" data-part-index="' + p + '" data-id="'+ obj.organ +'" data-level="' +j+'">'+ Form.levels[j] +'</label></div>';
                row.append(checkbox);
            }

            if (obj.pair || pair) {
                for (var i in pairs) {
                    var checkbox = $('<div class="checkbox-inline pair-'+i+'"><label><input type="checkbox" data-pair="' + pairs[i] +'">' + pairs[i] +'</label></div>');
                    row.append(checkbox);
                }
            }

            if (obj.hasOwnProperty('additional')) {
                var checkbox = $('<div class="checkbox-inline additional"><label><input type="checkbox" data-additional="1">' + obj.additional +'</label></div>');
                row.append(checkbox);
            }

            k++;
            return row;
        };

        var part1 = $('<div class="col-md-6"></div>');
        var part2 = $('<div class="col-md-6 second"></div>');

        for (var i=0; i<OrganDiagnostics.length; i++) {
            var obj = OrganDiagnostics[i];

            if (!obj.hasOwnProperty('parts')) {
                k < m ? part1.append(initOrganCheckboxes(obj, false, i, -1)) : part2.append(initOrganCheckboxes(obj, false, i, -1));
            } else {
                var fieldset = $('<fieldset><legend>'+ obj.section +'</legend></fieldset>');
                k++;
                for (var p in obj.parts) {
                    fieldset.append(initOrganCheckboxes(obj.parts[p], obj.pair, i, p));
                }
                k < m ? part1.append(fieldset) : part2.append(fieldset);
                k < m ? part1.append('<hr>') : part2.append('<hr>');
            }
        }

        $('#organs #organs_form').append(part1).append(part2);
    },

    initValidator: function() {
        var numberRules = {  number: true, min: 0, max: 100 };

        var rules = {
            cosmos: numberRules,
            earth: numberRules,
            native: numberRules,
            conscious: numberRules,
            subconscious: numberRules,
            mind: numberRules,
            soul: numberRules
        };

        $('#outside input[type="text"]').each(function() {
            var name = $(this).attr('name');
            rules[name] = numberRules;
        });

        $('form').each(function(){
            var validator = $(this).validate({
                ignore: false,
                lang: 'ru',
                messages: {
                    'cocoon': 'Выберете форму кокона.'
                },
                rules: rules,
                errorPlacement: function(error, element) {
                    if (element.parent('div').hasClass('date')) {
                        error.appendTo(element.parent('div').parent('div'));
                    }
                    else if (element.attr('name') == 'cocoon') {
                        error.insertAfter('#cocoon_form');
                    }
                    else {
                        error.appendTo(element.parent('div'));
                    }
                }
            });
            Form.addValidator(validator);
        });
    },

    analyseFormData: function() {
        if (Form.validFormData()) {
            var oDiagnostics = new Diagnostics();
            Form.processChakraMainForm(oDiagnostics);
            Form.processChakraSmallForm(oDiagnostics);
            Form.processEnergeticForm(oDiagnostics);
            Form.processConfidenceForm(oDiagnostics);
            Form.processOrganSystemsForm(oDiagnostics);
            Form.processOrgansForm(oDiagnostics);
            Form.printDiagnostics(oDiagnostics);
        }
    },

    //--- returns true if all forms is valid
    validFormData: function() {
        var valid = true;
        if (!Form.needValidate) {
            return Form.resetValidators();
        }

        Form.clearResults();
        Form.tabsFormValid = true;

        Form.accountFormValid = $('#account_form').valid();

        if (!Form.accountFormValid) {
            valid = false;
            $('html, body').animate({
                scrollTop: $("#account_form").offset().top
            }, 100);
        }

        if (!$('#energetic_form').valid()) {
            Form.tabsFormValid = false;
            valid = false;
            $('#tab_energetics').addClass('error');
        } else {
            $('#tab_energetics').removeClass('error');
        }

        var validOutsideTable = function() {
            var valid = true;
            $('#confidence_form #outside table input').each(function() {
                valid = $(this).valid();
            });
            return valid;
        }

        if (!$('#confidence_form').valid()) {
            Form.tabsFormValid = false;
            valid = false;
            $('#tab_confidence').addClass('error');
            if (!validOutsideTable()) {
                $('#outside label').addClass('red');
            } else {
                $('#outside label').removeClass('red');
            }
        } else {
            $('#tab_confidence').removeClass('error');
            $('#outside label').removeClass('red');
        }

        if (Form.accountFormValid && !valid) {
            $('html, body').animate({
                scrollTop: $("#Diagnostics").offset().top
            }, 100);
        }

        if (!Form.accountFormValid) {
            $('#account_form_msg').removeClass('hidden');
        } else {
            $('#account_form_msg').addClass('hidden');
        }

        if (!Form.tabsFormValid) {
            $('#tabs_form_msg').removeClass('hidden');
        } else {
            $('#tabs_form_msg').addClass('hidden');
        }

        Form.setValid(valid);
        return valid;
    },

    processChakraMainForm: function(oDiagnostics) {
        var data = $('#chakra_main_form').serializeArray();
        var diagnostics = [];
        for (var i in data) {
            var obj = data[i];
            var position = obj.name;
            var id = obj.value;
            var s = MainChakraViolations[id][position];
            diagnostics.push(s);
        }
        oDiagnostics.setChakraMain(diagnostics);
    },

    processChakraSmallForm: function(oDiagnostics) {
        var data = $('#chakra_small_form').serializeArray();
        var diagnostics = [];
        for (var i in data) {
            var obj = data[i];
            var id = obj.name;
            var s = SmallChakraViolations[id].description;
            diagnostics.push(s);
        }
        oDiagnostics.setChakraSmall(diagnostics);
    },

    processEnergeticForm: function(oDiagnostics) {
        var diagnostics = [];
        var cocoon = $('input[name="cocoon"]:checked').val();
        if (cocoon !== undefined) {
            for (var i in CocoonViolations) {
                if (CocoonViolations[i].id == cocoon) {
                    diagnostics['cocoon'] = CocoonViolations[i].description;
                    break;
                }
            }
        }

        diagnostics['kharicheskaya'] = [];

        $('#kharicheskaya_violation input[type="checkbox"]:checked').each(function() {
            var position = $(this).data('id');
            for (var i in KharicheskayaLineViolations) {
                if (KharicheskayaLineViolations[i].position == position) {
                    diagnostics['kharicheskaya'].push(KharicheskayaLineViolations[i].description);
                }
            }
        });

        diagnostics['thin_levels'] = [];
        $('#thin_levels input[type="checkbox"]:checked').each(function() {
            var level = $(this).data('id');
            for (var i in ThinLevels) {
                if (ThinLevels[i].id == level) {
                    diagnostics['thin_levels'].push(ThinLevels[i].description);
                }
            }
        });

        diagnostics['biofield'] = [];
        diagnostics['biofield']['description'] = BiofieldCheck[0].description;
        var valid = $('#biofield_sizes input').valid();
        if (valid) {
            var cosmos = +$('#biofield_sizes input[name="cosmos"]').val();
            var earth = +$('#biofield_sizes input[name="earth"]').val();
            var native = +$('#biofield_sizes input[name="native"]').val();
            var s = '';

            if (!isNaN(cosmos) && !isNaN(earth)) {
                if (cosmos > earth) {
                    s = BiofieldCheck[1].description;
                } else
                if (cosmos < earth) {
                    s = BiofieldCheck[2].description;
                } else
                if (cosmos === earth) {
                    s = BiofieldCheck[3].description;
                }

                diagnostics['biofield']['cosmoearth'] = s;
            }

            s = '';
            if (!isNaN(native)) {
                for (var i=4; i<7; i++) {
                    var parallel = BiofieldCheck[i];
                    var min = +parallel.min;
                    var max = +parallel.max;

                    if (native >= min && native <= max) {
                        s = parallel.description;
                        break;
                    }
                }
                diagnostics['biofield']['native'] = s;
            }
        }
        oDiagnostics.setEnergeticForm(diagnostics);
    },

    processConfidenceForm: function(oDiagnostics) {
        var diagnostics = [];
        var diff = [5, 10];
        var valid = $('#confidence #inside input').valid();

        if (valid) {
            diagnostics['inside'] = {
                'harmonic': 'Внутрення уверенность: в целом состояние гармоничное.',
                'priority': ''
            };

            var inside = [
                { 'name': 'conscious',    'value': +$('#confidence #inside input[name="conscious"]').val() },
                { 'name': 'subconscious', 'value': +$('#confidence #inside input[name="subconscious"]').val() },
                { 'name': 'mind',         'value': +$('#confidence #inside input[name="mind"]').val() },
                { 'name': 'soul',         'value': +$('#confidence #inside input[name="soul"]').val() }
            ];

            var isInsideOk = true;
            for (var i in inside) {
                if (isNaN(inside[i].value)) {
                    isInsideOk = false;
                }
            }

            if (isInsideOk) {
                inside.sort(function(a,b){
                    if (a.value > b.value)
                        return -1;
                    if (a.value < b.value)
                        return 1;
                    return 0;
                });

                var middle = 0;
                for (var i in inside) {
                    middle += inside[i].value;
                }

                middle /= 4;
                for (var i in inside) {
                    if (Math.abs(inside[i].value - middle)*0.01 > 0.1) {
                        diagnostics['inside'].harmonic = 'Внутрення уверенность: в целом состояние негармоничное.';
                        break;
                    }
                }

                var maxName = inside[0].name;
                for (var i in IndicatorsPersonal) {
                    if (IndicatorsPersonal[i].name === maxName) {
                        diagnostics['inside'].priority = IndicatorsPersonal[i].description;
                        break;
                    }
                }
            }
        }
        oDiagnostics.setConfidenceForm(diagnostics);
    },

    processOrganSystemsForm: function(oDiagnostics) {
        var mainSelector = 'form#organ_systems_form div.checkbox-inline ';
        var diagnostics = [];
        for (var i in OrganSystems) {
            var obj = OrganSystems[i];
            for (var l in Form.levels) {
                if ($(mainSelector + 'input[type="checkbox"][data-id="'+i+'"][data-level="'+l+'"]').prop('checked')) {
                    var s = obj.diagnostics[l].description;
                    if (s.length) {
                        diagnostics.push(s);
                    }
                }
            }
        }
        oDiagnostics.setOrganSystemsForm(diagnostics);
    },

    processOrgansForm: function(oDiagnostics) {
        var mainSelector = 'form#organs_form div.checkbox-inline ';
        var diagnostics = [];
        for (var i in OrganDiagnostics) {
            diagnostics.push([]);

            var obj = OrganDiagnostics[i];
            if (obj.hasOwnProperty('parts')) {
                for (var p in obj.parts) {
                    var part = obj.parts[p];
                    for (var l in Form.levels) {
                        if ($(mainSelector + 'input[type="checkbox"][data-main-index="'+i+'"][data-part-index="'+p+'"][data-level="'+l+'"]').prop('checked')) {
                            if (part.diagnostics[l] !== undefined) {
                                var s = part.diagnostics[l].description;
                                diagnostics[i].push(s);
                            }
                        }
                    }
                }
            } else {
                for (var l in Form.levels) {
                    if ($(mainSelector + 'input[type="checkbox"][data-main-index="'+i+'"][data-level="'+l+'"]').prop('checked')) {
                        if (obj.diagnostics[l] !== undefined) {
                            var s = obj.diagnostics[l].description;
                            diagnostics[i].push(s);
                        }
                    }
                }
            }
        }

        var explanations = [];
        for (var i in diagnostics) {
            var m = diagnostics[i].length;
            var name = (OrganDiagnostics[i].hasOwnProperty('section')) ? OrganDiagnostics[i].section : OrganDiagnostics[i].organ;

            if (m > 0) {
                var explanation = name + ': ';
                for (var j=0; j<m; j++) {
                    explanation += diagnostics[i][j];
                    if (j < m-1) {
                        explanation += '; ';
                    }
                }
                explanations.push(explanation);
            }
        }

        oDiagnostics.setOrgansForm(explanations);
    },

    clearResults: function() {
        $('#Results #bioenergy-part, #Results #organism-part').empty();
        $('#Results #bioenergy-part, #Results #organism-part').append('<p>Результаты не были получены.</p>');
    },

    printDiagnostics: function(oDiagnostics) {
        if (Form.needValidate) {
            $('#diagnostics_success').modal();
        }

        var title = Form.initTitle;
        if (Form.needValidate && Form.isValid) {
            title = 'Анкета - ' + $('input[name="firstname"]').val() +' '+ $('input[name="name"]').val();
        }
        $('head title').text(title);

        $('.link_results').removeClass('disabled');
        $('html, body').animate({
            scrollTop: $("#Results").offset().top
        }, 100);

        var selector = '#Results #bioenergy-part';
        $(selector).empty();
        if (oDiagnostics.chakraMain.length) {
            $(selector).append('<label>Чакры</label>');
            for (var i in oDiagnostics.chakraMain) {
                var s = oDiagnostics.chakraMain[i];
                $(selector).append('<p>'+s+'</p>');
            }
            $(selector).append('<hr/>');
        }
        if (oDiagnostics.chakraSmall.length) {
            $(selector).append('<label>Мелкие чакры</label>');
            for (var i in oDiagnostics.chakraSmall) {
                var s = oDiagnostics.chakraSmall[i];
                $(selector).append('<p>'+s+'</p>');
            }
            $(selector).append('<hr/>');
        }

        $(selector).append('<label>Энергетика</label>');
        if (oDiagnostics.energeticForm.hasOwnProperty('cocoon')) {
            var s = '<b>Форма кокона:</b>&nbsp;' + oDiagnostics.energeticForm.cocoon;
            $(selector).append('<p>'+s+'</p>');
        }

        if (oDiagnostics.energeticForm.kharicheskaya.length) {
            for (var i in oDiagnostics.energeticForm.kharicheskaya) {
                var s = oDiagnostics.energeticForm.kharicheskaya[i];
                $(selector).append('<p>'+s+'</p>');
            }
        }

        if (oDiagnostics.energeticForm.thin_levels.length) {
            for (var i in oDiagnostics.energeticForm.thin_levels) {
                var s = oDiagnostics.energeticForm.thin_levels[i];
                $(selector).append('<p>'+s+'</p>');
            }
        }

        if (oDiagnostics.energeticForm.hasOwnProperty('biofield')) {
            var s = oDiagnostics.energeticForm.biofield.description;
            $(selector).append('<p><small>'+s+'</small></p>');

            if (oDiagnostics.energeticForm.biofield.hasOwnProperty('cosmoearth')) {
                var s = oDiagnostics.energeticForm.biofield.cosmoearth;
                $(selector).append('<p>'+s+'</p>');
            }

            if (oDiagnostics.energeticForm.biofield.hasOwnProperty('native')) {
                var s = oDiagnostics.energeticForm.biofield.native;
                $(selector).append('<p>'+s+'</p>');
            }
        }

        if (oDiagnostics.confidenceForm.hasOwnProperty('inside')) {
            $(selector).append('<hr>');
            $(selector).append('<label>Уверенность</label>');
            var s = oDiagnostics.confidenceForm.inside.harmonic;
            $(selector).append('<p>'+s+'</p>');
            if (oDiagnostics.confidenceForm.inside.hasOwnProperty('priority')) {
                var s = oDiagnostics.confidenceForm.inside.priority;
                $(selector).append('<p>'+s+'</p>');
            }
        }

        if ($(selector).html().length === 0) {
            $(selector).append('<p>Результаты не были получены.</p>');
        }

        selector = '#Results #organism-part';
        $(selector).empty();
        if (oDiagnostics.organSystemsForm.length) {
            $(selector).append('<label>Системы организма</label>');
            var s = '';
            for (var i in oDiagnostics.organSystemsForm) {
                s += oDiagnostics.organSystemsForm[i] + ' ';
            }
            $(selector).append('<p>'+s+'</p>');
        }

        if (oDiagnostics.organsForm.length) {
            $(selector).append('<label>Внутренние органы</label>');
            for (var i in oDiagnostics.organsForm) {
                var s = oDiagnostics.organsForm[i];
                $(selector).append('<p>'+s+'</p>');
            }
        }
        if ($(selector).html().length === 0) {
            $(selector).append('<p>Результаты не были получены.</p>');
        }

        if (Form.needValidate && Form.isValid) {
            $('button#print').removeClass('disabled');
        }
    },

    printResults: function() {
        window.print();
    }
};

function Diagnostics(prop) {
    prop = prop || {};
}

Diagnostics.prototype = {
    setChakraMain: function(diagnostics) {
        this.chakraMain = diagnostics;
    },

    setChakraSmall: function(diagnostics) {
        this.chakraSmall = diagnostics;
    },

    setEnergeticForm: function(diagnostics) {
        this.energeticForm = diagnostics;
    },

    setConfidenceForm: function(diagnostics) {
        this.confidenceForm = diagnostics;
    },

    setOrganSystemsForm: function(diagnostics) {
        this.organSystemsForm = diagnostics;
    },

    setOrgansForm: function(diagnostics) {
        this.organsForm = diagnostics;
    }
};
