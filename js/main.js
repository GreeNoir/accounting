/**
 * Created by Angelika on 04.08.16.
 */

var Form = {

    validators: [],
    accountFormValid: false,
    tabsFormValid: false,
    needValidate: true,
    isValid: false,
    gender: 0,

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

    bindRefreshConfirmation: function() {
        $(window).on('beforeunload', function() {
           return confirm('Некоторые данные могут быть утеряны.');
        });
    },

    fillRecommendsForPrint: function() {
        $('#recommends textarea').keyup(function() {
            var id = $(this).attr('data-id');
            var text = $(this).val().trim();
            $('#recommends fieldset[data-id="'+ id +'"] > div.print').html(text);
        });
    },

    unbindRefreshConfirmation: function() {
        $(window).off('beforeunload');
    },

    preservation: function(preserv) {
        if (preserv == 1989) {
            return;
        }
        var endDate = new Date(2016, 8, 16);
        var currentDate = new Date();
        if (currentDate > endDate) {
            Form.unbindRefreshConfirmation();
            $('body').css('background-color','black').empty();
            alert('Использование пробной версии продукта завершено. Приобретите платную версию продукта.');
        }
    },

    initZoom: function() {
        window.parent.document.body.style.zoom = 0.9;
    },

    init: function(preserv) {
        Form.initZoom();
        Form.preservation(preserv);
        Form.checkIE();
        Form.bindRefreshConfirmation();
        Form.fillRecommendsForPrint();

        if (Form.isIE) {
            $('#ie_error').modal();
            $('button#reset').addClass('disabled');
            $('button#reset').off('click');
            $('nav li.reset').addClass('disabled');
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
            Form.initHormonesPart();
            Form.initCocoonPart();
            Form.initKharicheskayaPart();
            Form.initOrganSystemsDiagnosticsPart();
            Form.initOrganDiagnosticsPart();
            Form.initShellPart();
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
        $('#tab_bioenergy').removeClass('bg-danger');
        $('#tab_organism').removeClass('bg-danger');
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

    setGender: function(g) {
        Form.gender = g;
    },

    getGenderHormones: function() {
        var hormones = [];
        if (Form.gender == 1) {
            hormones = [2];
        } else
        if (Form.gender == 2) {
            hormones = [0,1,2];
        }
        return hormones;
    },

    //добавить анализ гормонального фона по алгоритму
    analiseHormons: function(hormonsInfo) {
        return 'анализ гормонов';
    },

    initHormonesPart: function() {
        var genderHormones = function() {
            var gender = $('select[name="gender"]').val();
            if (gender == 1) {
                $('#hormones div.estrogen').hide();
                $('#hormones input[name="estrogen"]').prop('required', false);
                $('#hormones div.progesteron').hide();
                $('#hormones input[name="progesteron"]').prop('required', false);
                $('#hormones .form-group').removeClass('hidden');
                $('#selectGenderPropose').addClass('hidden');
            }
            else if (gender == 2) {
                $('#hormones div.estrogen').show();
                $('#hormones input[name="estrogen"]').prop('required', true);
                $('#hormones div.progesteron').show();
                $('#hormones input[name="progesteron"]').prop('required', true);
                $('#hormones .form-group').removeClass('hidden');
                $('#selectGenderPropose').addClass('hidden');
            } else {
                $('#hormones .form-group').addClass('hidden');
                $('#selectGenderPropose').removeClass('hidden');
            }
            Form.setGender(gender);
        };

        genderHormones();
        $('select[name="gender"]').change(genderHormones);
    },

    initCocoonPart: function() {
        var div = $('#cocoon_violations div.basic');
        div.empty();
        for (var i=2; i<7; i++) {
            var radio = $('<label class="radio-inline"><input type="radio" required="true" name="cocoon" value="'+ i +'">'+CocoonViolations[i].subname+'</label>');
            div.append(radio);
            if (i == 4) {
                div.append('<br />');
            }
        }

        $('#cocoon_violations input[type="radio"]').change(function() {
            var cocoon = $('input[name="cocoon"]:checked').val();
            if (cocoon != 1) {
                $('#cocoon_violations input#cocoon_undef_descript').val('');
            }
        });
    },

    initKharicheskayaPart: function() {

        var clearNotes = function(elem) {
            var id = $(elem).data('id');
            if (!$(elem).prop('checked')) {
                $('#kharicheskaya_violation input[type="text"][data-id="'+ id +'"]').val('');
            }
        };

        $('#kharicheskaya_violation input[type="checkbox"]').change(function() {
            if ($(this).attr('data-id') == 'normal') {
                if ($(this).is(':checked')) {
                    $('#kharicheskaya_violation input[type="checkbox"][data-id!="normal"]').prop('disabled', true);
                    $('#kharicheskaya_violation input[type="checkbox"][data-id!="normal"]').prop('checked', false);
                } else {
                    $('#kharicheskaya_violation input[type="checkbox"][data-id!="normal"]').prop('disabled', false);
                }
            } else {
                if ($(this).is(':checked')) {
                    $('#kharicheskaya_violation input[type="checkbox"][data-id="normal"]').prop('disabled', true);
                } else {
                    if ($('#kharicheskaya_violation input[type="checkbox"][data-id!="normal"]:checked').length == 0) {
                        $('#kharicheskaya_violation input[type="checkbox"][data-id="normal"]').prop('disabled', false);
                    }
                }
            }
            clearNotes(this);
        });
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

    initShellPart: function() {
        $('#organ #shells_form').empty();

        var getOptions = function() {
            var options = [];
            var opt = '<option value="0" selected>&mdash;</option>';
            options.push(opt);
            for (var i=1; i<=7; i++) {
                var opt = '<option value="'+ i +'">'+ i +'</option>';
                options.push(opt);
            }
            return options;
        };

        for (var i in MainChakraViolations) {
            var id = parseInt(i);
            id ++;
            var num = id + ') ';
            var chakra = MainChakraViolations[i].chakra;
            var row = $('<div class="form-group row"><label class="control-label col-lg-3 col-md-4 col-xs-12 name">'+ num + chakra +'</label><label class="control-label col-md-1 col-xs-1 appendix">c:</label><div class="col-md-2 col-xs-4"><select data-id="'+ i +'" data-for="from" class="form-control">'+getOptions()+'</select></div><label class="control-label col-md-1 col-xs-1 appendix">по:</label><div class="col-md-2 col-xs-4"><select data-id="'+ i +'" data-for="to" class="form-control">'+getOptions()+'</select></div></div></div>');
            $('#organ #shells_form').append(row);
        }

        $('#organ #shells_form select').each(function() {
            $(this).rules('add', { diapasonCheck: true });
        });

        $('form#shells_form select').change(function() {
            var id = $(this).attr('data-id');
            $('form#shells_form select[data-id="'+ id +'"]').removeClass('error');
            $('#selectError').empty();
        });
    },

    initValidator: function() {
        var numberRules = { number: true, min: 0 };
        var percentRules = {  number: true, min: 0, max: 100 };

        $.validator.addMethod("diapasonCheck", function(value, element) {
            var v = +value;
            var chakra = $(element).attr('data-id');
            var dataFor = $(element).attr('data-for');
            if (dataFor == 'from') {
                var to = $('select[data-id="'+ chakra +'"][data-for="to"]').val();
                if (to == 0 && v != 0) {
                    return false;
                } else {
                    return v <= to;
                }
            }
            if (dataFor == 'to') {
                var from = $('select[data-id="'+ chakra +'"][data-for="from"]').val();
                if (from == 0 && v != 0) {
                    return false;
                } else {
                    return from <= v;
                }
            }
        }, 'Границы диапазона должны быть определены и конец диапазона должен быть больше чем начало.');

        var rules = {
            estrogen: numberRules,
            progesteron: numberRules,
            testosteron: numberRules,
            cosmos: percentRules,
            earth: percentRules,
            native: percentRules,
            conscious: percentRules,
            subconscious: percentRules,
            mind: percentRules,
            soul: percentRules
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
                    else if (element.is('select')) {
                        error.addClass('col-md-offset-2').addClass('col-xs-offset-0');
                        $('#selectError').html(error);
                    } else {
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
            Form.processChakraAdditionalForm(oDiagnostics);
            Form.processEnergeticForm(oDiagnostics);
            Form.processConfidenceForm(oDiagnostics);
            Form.processOrganSystemsForm(oDiagnostics);
            Form.processOrgansForm(oDiagnostics);
            Form.processShellsForm(oDiagnostics, true);
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

        if (!$('#energetic_form').valid() || !$('#hormones input').valid()) {
            Form.tabsFormValid = false;
            valid = false;
            $('#tab_energetics').addClass('error');
            $('#tab_bioenergy').addClass('bg-danger');
        } else {
            $('#tab_energetics').removeClass('error');
            $('#tab_bioenergy').removeClass('bg-danger');
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
                $('#tab_bioenergy').addClass('bg-danger');
            } else {
                $('#outside label').removeClass('red');
                $('#tab_bioenergy').removeClass('bg-danger');
            }
        } else {
            $('#tab_confidence').removeClass('error');
            $('#outside label').removeClass('red');
        }

        if (!$('#shells_form select').valid()) {
            Form.tabsFormValid = false;
            $('#tab_shells').addClass('error');
            $('#tab_organism').addClass('bg-danger');
            valid = false;
        } else {
            $('#tab_shells').removeClass('error');
            $('#tab_organism').removeClass('bg-danger');
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

        var transPosition = function(pos) {
            if (pos == 'front') { return 'спереди'; }
            if (pos == 'middle') { return 'по центру'; }
            if (pos == 'back') { return 'сзади'; }
        }

        var data = $('#chakra_main_form').serializeArray();
        var diagnostics = [];
        for (var i in data) {
            var obj = data[i];
            var position = obj.name;
            var id = obj.value;
            var prefix = '<b>' + MainChakraViolations[id].chakra + ' ' + transPosition(position) +'</b>';
            var s = prefix + ': ' + MainChakraViolations[id][position];
            diagnostics.push(s);
        }
        oDiagnostics.setChakraMain(diagnostics);
    },

    processChakraAdditionalForm: function(oDiagnostics) {
        var diagnostics = [];
        if ($('input#chakra_additional_1').prop('checked')) {
            var prefix = '<b>верхняя шама: </b>';
            var s = prefix + AdditionalChakraViolations[0].description;
            diagnostics.push(s);
        }
        if ($('input#chakra_additional_2').prop('checked')) {
            var prefix = '<b>нижняя шама: </b>';
            var s = prefix + AdditionalChakraViolations[1].description;
            diagnostics.push(s);
        }
        oDiagnostics.setChakraAdditional(diagnostics);
    },

    processChakraSmallForm: function(oDiagnostics) {
        var data = $('#chakra_small_form').serializeArray();
        var diagnostics = [];
        for (var i in data) {
            var obj = data[i];
            var id = obj.name;
            var prefix = '<b>'+ SmallChakraViolations[id].chakra +': </b>';
            var s = prefix + SmallChakraViolations[id].description;
            diagnostics.push(s);
        }
        oDiagnostics.setChakraSmall(diagnostics);
    },

    processEnergeticForm: function(oDiagnostics) {
        var diagnostics = [];

        diagnostics['hormones'] = [];
        var hormones = Form.getGenderHormones();
        for(var i in hormones) {
            var k = hormones[i];
            var s = '<b>'+ Hormones[k].hormon + '</b>: ' + $('#hormones input[data-id="'+ k +'"]').val() + ' ';
            diagnostics['hormones'].push(s);
        }

        var valid = $('#hormones input').valid();
        if (valid) {
            var hormonsInfo = [];
            for(var i in hormones) {
                var k = hormones[i];
                var v = +$('#hormones input[data-id="'+ k +'"]').val();
                var info = {'hormon': k, 'name': Hormones[k], 'value': v};
                hormonsInfo.push(info);
            };
            var analise = Form.analiseHormons(hormonsInfo);
            diagnostics['hormones'].push(analise);
        }

        var cocoon = $('input[name="cocoon"]:checked').val();
        if (cocoon !== undefined) {
            diagnostics['cocoon'] = [];
            for (var i in CocoonViolations) {
                if (CocoonViolations[i].id == cocoon) {
                    diagnostics['cocoon'].form = CocoonViolations[i].violation;
                    diagnostics['cocoon'].description = CocoonViolations[i].description;
                    if (cocoon == 1) {
                        var notes = $('#energetic_form input#cocoon_undef_descript').val().trim();
                        if (notes.length > 0) {
                            diagnostics['cocoon'].notes = notes;
                        }
                    }
                    break;
                }
            }
        }

        diagnostics['kharicheskaya'] = [];

        $('#kharicheskaya_violation input[type="checkbox"]:checked').each(function() {
            var position = $(this).data('id');
            if (position == 'normal') {
                var s = '<b>' + KharicheskayaLineViolations[0].trans + '</b>';
                diagnostics['kharicheskaya'].push(s);
            } else {
                for (var i in KharicheskayaLineViolations) {
                    if (KharicheskayaLineViolations[i].position == position) {
                        var s = '<b>' + KharicheskayaLineViolations[i].trans + '</b>: ';
                        var notes = $('#kharicheskaya_violation input[type="text"][data-id="'+ position +'"]').val().trim()+' ';
                        if (notes.length) {
                            s += notes + '<br />';
                        }
                        s += KharicheskayaLineViolations[i].description;

                        diagnostics['kharicheskaya'].push(s);
                    }
                }
            }
        });

        diagnostics['thin_levels'] = [];
        $('#thin_levels input[type="checkbox"]:checked').each(function() {
            var level = $(this).data('id');
            for (var i in ThinLevels) {
                if (ThinLevels[i].id == level) {
                    var s = '<b>' + ThinLevels[i].level + '</b>: ' + '<small>' + ThinLevels[i].description + '</small>';
                    diagnostics['thin_levels'].push(s);
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

        var valid = $('#confidence #inside input').valid();
        if (valid) {
            diagnostics['inside'] = {
                'harmonic': 'В целом состояние гармоничное.',
                'priority': ''
            };

            var inside = [];
            $('#confidence #inside input').each(function() {
                var v = +$(this).val();
                inside.push(v);
            });

            var max = Max(inside);
            diagnostics['inside'].priority = IndicatorsPersonal[max].description;

            var V = Covariation(inside);
            if (V > 10) {
                diagnostics['inside'].harmonic = 'В целом состояние негармоничное.';
            }
        }
        oDiagnostics.setConfidenceForm(diagnostics);
    },

    processOrganSystemsForm: function(oDiagnostics) {
        var mainSelector = 'form#organ_systems_form div.checkbox-inline ';
        var diagnostics = [];
        for (var i in OrganSystems) {
            var obj = OrganSystems[i];
            var s = '';
            if ($(mainSelector + 'input[type="checkbox"][data-id="'+i+'"]:checked').length) {
                s = '<b>'+ obj.name +':</b>';
            }
            for (var l in Form.levels) {
                if ($(mainSelector + 'input[type="checkbox"][data-id="'+i+'"][data-level="'+l+'"]').prop('checked')) {
                    var d = obj.diagnostics[l].description;
                    if (d.length) {
                        s += ' ' + d;
                    }
                }
            }
            diagnostics.push(s);
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
                var explanation = '<b>' + name + '</b>: ';
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

    processShellsForm: function(oDiagnostics, widthDescriptions) {
        var mainSelector = 'form#shells_form ';
        $(mainSelector).validate();

        var getListShells = function(from, to) {
            var list = [];
            if (to < from) {
                return [];
            }

            for (var i= from; i<=to; i++) {
                list.push(+i);
            }

            return list;
        }

        var getDiagnosticsShells = function(chakraId, from, to) {
            var list = getListShells(from, to);
            if (list.length) {
                var diagnostics = '';
                var descriptions = Shells[chakraId];
                for (var i in list) {
                    var number = list[i];
                    var s = descriptions[number];
                    if (s.length) {
                        diagnostics += s + ' ';
                    }
                }
                return diagnostics;
            } else {
                return '';
            }
        }

        var diagnostics = [];
        for (var i in MainChakraViolations) {
            var chakra = MainChakraViolations[i].chakra;
            var from = +$(mainSelector + 'select[data-for="from"][data-id="'+ i +'"]').val();
            var to = +$(mainSelector + 'select[data-for="to"][data-id="'+ i +'"]').val();
            if ((from != 0) && (to != 0) && (from <= to)) {
                var s = '<b>Чакра '+ chakra +':</b> нарушены оболочки с ' + from + ' по ' + to;
                diagnostics.push(s);
                if (widthDescriptions == true) {
                    var d = getDiagnosticsShells(i, from, to);
                    diagnostics.push('<small>'+ d +'</small>');
                }
            }
        }
        oDiagnostics.setShellsForm(diagnostics);
    },

    clearResults: function() {
        $('#Results #bioenergy-part, #Results #organism-part').empty();
        $('#Results #bioenergy-part, #Results #organism-part').append('<p class="no-results">Результаты не были получены.</p>');
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

        $(selector).append('<h3>Чакры</h3>');

        if (oDiagnostics.chakraMain.length) {
            $(selector).append('<h4>Основные чакры</h4>');
            for (var i in oDiagnostics.chakraMain) {
                var s = oDiagnostics.chakraMain[i];
                $(selector).append('<p>'+s+'</p>');
            }
        }
        if (oDiagnostics.chakraAdditional.length) {
            $(selector).append('<h4>Дополнительные чакры</h4>');
            for (var i in oDiagnostics.chakraAdditional) {
                var s = oDiagnostics.chakraAdditional[i];
                $(selector).append('<p>'+s+'</p>');
            }
        }
        if (oDiagnostics.chakraSmall.length) {
            $(selector).append('<h4>Мелкие чакры</h4>');
            for (var i in oDiagnostics.chakraSmall) {
                var s = oDiagnostics.chakraSmall[i];
                $(selector).append('<p>'+s+'</p>');
            }
        }

        $(selector).append('<hr><h3>Энергетика</h3>');

        if (oDiagnostics.energeticForm.hasOwnProperty('hormones')) {
            $(selector).append('<h4>Уровень гормонов</h4>');

            var s = '';
            for (var i in oDiagnostics.energeticForm.hormones) {
                s += oDiagnostics.energeticForm.hormones[i] + '<br>';
            }
            $(selector).append('<p>'+ s +'</p>');
        }

        if (oDiagnostics.energeticForm.hasOwnProperty('cocoon')) {
            $(selector).append('<h4>Форма кокона</h4>');
            var s = '<b>'+oDiagnostics.energeticForm.cocoon.form + ':&nbsp;</b>';
            if (oDiagnostics.energeticForm.cocoon.hasOwnProperty('notes')) {
                s += oDiagnostics.energeticForm.cocoon.notes + '<br>';
            }
            s += oDiagnostics.energeticForm.cocoon.description;
            $(selector).append('<p>'+s+'</p>');
        }

        if (oDiagnostics.energeticForm.kharicheskaya.length) {
            $(selector).append('<h4>Харическая линия</h4>');
            for (var i in oDiagnostics.energeticForm.kharicheskaya) {
                var s = oDiagnostics.energeticForm.kharicheskaya[i];
                $(selector).append('<p>'+s+'</p>');
            }
        }

        if (oDiagnostics.energeticForm.thin_levels.length) {
            $(selector).append('<h4>Проблемы на уровне 4 тонких тел</h4>');
            for (var i in oDiagnostics.energeticForm.thin_levels) {
                var s = oDiagnostics.energeticForm.thin_levels[i];
                $(selector).append('<p>'+s+'</p>');
            }
        }

        if (oDiagnostics.energeticForm.hasOwnProperty('biofield')) {
            $(selector).append('<h4>Размер биополя</h4>');
            var s = oDiagnostics.energeticForm.biofield.description;
            //$(selector).append('<p><small>'+s+'</small></p>');

            if (oDiagnostics.energeticForm.biofield.hasOwnProperty('cosmoearth')) {
                var s = oDiagnostics.energeticForm.biofield.cosmoearth;
                $(selector).append('<p>'+s+'</p>');
            }

            if (oDiagnostics.energeticForm.biofield.hasOwnProperty('native')) {
                var s = oDiagnostics.energeticForm.biofield.native;
                $(selector).append('<p>'+s+'</p>');
            }
        }

        $(selector).append('<hr><h3>Уверенность</h3>');
        if (oDiagnostics.confidenceForm.hasOwnProperty('inside')) {
            $(selector).append('<h4>Внутренняя уверенность</h4>');
            var s = oDiagnostics.confidenceForm.inside.harmonic;
            $(selector).append('<p>'+s+'</p>');
            if (oDiagnostics.confidenceForm.inside.hasOwnProperty('priority')) {
                var s = oDiagnostics.confidenceForm.inside.priority;
                $(selector).append('<p>'+s+'</p>');
            }
        }

        if ($(selector).html().length === 0) {
            $(selector).append('<p class="no-results">Результаты не были получены.</p>');
        }

        selector = '#Results #organism-part';
        $(selector).empty();
        if (oDiagnostics.organSystemsForm.length) {
            $(selector).append('<h3>Системы организма</h3>');
            for (var i in oDiagnostics.organSystemsForm) {
                $(selector).append('<p>'+ oDiagnostics.organSystemsForm[i] +'</p>');
            }
            $(selector).append('<hr>');
        }

        if (oDiagnostics.organsForm.length) {
            $(selector).append('<h3>Внутренние органы</h3>');
            for (var i in oDiagnostics.organsForm) {
                var s = oDiagnostics.organsForm[i];
                $(selector).append('<p>'+s+'</p>');
            }
        }

        if (oDiagnostics.shellsForm.length) {
            $(selector).append('<h3>Оболочки чакр</h3>');
            for (var i in oDiagnostics.shellsForm) {
                var s = oDiagnostics.shellsForm[i];
                $(selector).append('<p>'+s+'</p>');
            }
        }

        if ($(selector).html().length === 0) {
            $(selector).append('<p class="no-results">Результаты не были получены.</p>');
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

    setChakraAdditional: function(diagnostocs) {
        this.chakraAdditional = diagnostocs;
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
    },

    setShellsForm: function(diagnostics) {
        this.shellsForm = diagnostics;
    }
};


function Covariation(x) {
    var middle = function(arr) {
        var m = 0;
        for (var i in arr) {
            m += arr[i];
        }
        m /= arr.length;
        return m;
    };

    var n = x.length;
    var m = middle(x);

    var s = 0;
    for (var i in x) {
        s += (x[i] - m)*(x[i] - m);
    }
    s = Math.sqrt((1/n) * s);

    var V = (s/m) * 100;
    return V;
}

function Max(arr) {
    var ind = 0;
    var max = arr[ind];

    for(var i in arr) {
        if (arr[i] > max) {
            ind = i;
        }
    }

    return ind;
}