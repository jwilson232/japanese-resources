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
        var output = "Level " + wkof.user.level + 
                     " - R: " + lessons.current.radical.length + 
                     ", K: " + lessons.current.kanji.length + 
                     ", V: " + lessons.current.vocabulary.length;

        if (lessons.previous.radical > 0 || lessons.previous.kanji > 0 || lessons.previous.vocabulary > 0) {
            output = "Lessons " + String(wkof.user.level - 1) + 
                     " - R: " + lessons.previous.radical.length + 
                     ", K: " + lessons.previous.kanji.length + 
                     ", V: " + lessons.previous.vocabulary.length + 
                     " | " + output
        }
        
        var html = document.getElementsByClassName("lessons-and-reviews__lessons-button--25")[0].innerHTML;
        var updated_lesson = html.slice(0, 26) + ' <div style="font-size:10px">' + output + '</div>' + html.slice(26);

        document.getElementsByClassName("lessons-and-reviews__lessons-button--25")[0].innerHTML = updated_lesson; 
        
        var html = document.getElementsByClassName("lessons-and-reviews__reviews-button--0")[0].innerHTML;
        var updated_review = html.slice(0, 26) + ' <div style="font-size:10px">&nbsp    </div>' + html.slice(26);
        
        console.log(updated_review);
        document.getElementsByClassName("lessons-and-reviews__reviews-button--0")[0].innerHTML = updated_review; 


    }

})();