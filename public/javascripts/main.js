'use strict';

var ShoppingPlanner = {};

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    $('#radius_slider').slider().change(function () {
        $('#radius').text($(this).val());
    });

    $.ajax({
        dataType: "json",
        url: 'jsonData/distinct.json',
        success: function (result) {
            var subcategories = _.map(result.subcategory, function (subcategory) {
                return {id: subcategory, text: subcategory};
            });

            $("#subcategory").select2({
                placeholder: 'Select categories',
                data: subcategories,
                multiple: true,
                maximumSelectionLength: 5
            });
        }
    });

    $("#get_direction_button").click(function () {
        var data = {};
        data.product_types = $("#subcategory").select2('val');
        data.radius = $('#radius_slider').val();
        data.lat = ShoppingPlanner.current_lat;
        data.lng = ShoppingPlanner.current_lng;

        if (data.product_types.length == 0) {
            ShoppingPlanner.showError('Please select atleast one category ! ');
            return;
        }

        console.log('Before Ajax', data);
        $.ajax({
            type: "post",
            dataType: "json",
            url: "/get_shortest_path",
            data: data,
            success: function (result) {
                console.log("Ajax Success - ", result.data.coords);
                ShoppingPlanner.calculateAndDisplayRoute(result.data.coords);
            },
            error: function (a, b, c) {
                console.error("Ajax Error - ", a.responseJSON);
            }
        });
    });
});

ShoppingPlanner.showError = function (msg) {
    $('.top-left').notify({
        message: {text: msg},
        type: 'warning'
    }).show();
}