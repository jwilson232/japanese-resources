// ==UserScript==
// @name         Lessons Overview
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display number of radical, kanji and vocab lessons pending per level
// @author       Joe Wilson
// @match        https://www.wanikani.com/dashboard
// @icon         https://www.google.com/s2/favicons?domain=wanikani.com
// @grant        none
// ==/UserScript==

(function() {
    var script = 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js';
    var css = 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css';

    var promises = [];
    promises[0] = wkof.load_script(script, true /* use_cache */);
    promises[1] = wkof.load_css(css, true /* use_cache */);

    Promise.all(promises).then(do_something);

    function do_something() {
        wkof.include('Apiv2');
        wkof.ready('Apiv2').then(get_data);

        console.log('jQuery UI script loaded!');
    };

    function get_data() {
        var options = {
            force_update: true
        };

        wkof.Apiv2.get_endpoint('summary', options)
        .then(get_lessons);
    }
    
    function get_lessons(response) {
        var config = {
            wk_items: {
                filters: {
                    srs: 'init'
                }
            }
        };
        var lessons = response.lessons[0].subject_ids;
        var lesson_index = []

        for (var i = 0; i < lessons.length; i++) {
            lesson_index.push(lessons[i]);
        }        
        
        lesson_index = lesson_index.join(',');
        
        wkof.ItemData.get_items(config)
            .then(split_lessons);
    }

    function split_lessons(response) {
        var lessons = {
            "current": {
                "radical": [],
                "kanji": [], 
                "vocabulary": []
            },
            "previous": {
                "radical": [],
                "kanji": [], 
                "vocabulary": []
            }
        }
        
        for (var i = 0; i < response.length; i++) {
            var type = String(response[i].object); 
            var level = response[i].data.level == wkof.user.level ? "current": "previous";
            
            if (lessons[level][type] != undefined) {
                lessons[level][type].push(response[i]);  
            } else {
                lessons[level][type] = response[i];  
            }

        }

        update_ui(lessons);
    }

    function update_ui(lessons) {
        // To Do: Update UI properly
        console.log("Lessons from level " + wkof.user.level + " - Radical: " + lessons.current.radical.length + ", Kanji: " + lessons.current.kanji.length + ", Vocabulary: " + lessons.current.vocabulary.length);
        if (log.radical > 0 || log.kanji > 0 || log.vocabulary > 0) {
            console.log("Lessons from level " + String(wkof.user.level - 1) + " - Radical: " + lessons.previous.radical.length + ", Kanji: " + lessons.previous.kanji.length + ", Vocabulary: " + lessons.previous.vocabulary.length);
        }
        
    }

})();