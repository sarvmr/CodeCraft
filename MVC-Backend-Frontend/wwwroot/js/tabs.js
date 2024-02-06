import { lineMaker } from "./drag_drop.js";

$(document).ready(function() {
    let tabCounter = 1;

    // Switching between tabs
    $(document).on('click', '.tab', function() {
        let tabId = $(this).data('tab-id');
        $('.tab, .tab-content').removeClass('active');
        $(`.tab[data-tab-id="${tabId}"], .tab-content[data-tab-id="${tabId}"]`).addClass('active');
    });

    // Closing tabs
    $(document).on('click', '.close-tab', function(e) {
        e.stopPropagation(); // Prevent triggering the tab switching
        let tabId = $(this).parent().data('tab-id');
        $(`.tab[data-tab-id="${tabId}"], .tab-content[data-tab-id="${tabId}"]`).remove();
    });

    // Adding new tabs
    $('#addTab').click(function() {
        tabCounter++;
        let tabId = "tab-" + tabCounter;
        $('.tab-headers').append(`<div class="tab new-tab-style" data-tab-id="${tabCounter}"><span class="tab-title">Tab ${tabCounter}</span><button class="close-tab">x</button></div>`);
        $('.tab-contents').append(`<div class="tab-content line-container" id="${tabId}" data-tab-id="${tabCounter}">Content for Tab ${tabCounter}</div>`);

        lineMaker(document.getElementById(tabId));
    });
});
