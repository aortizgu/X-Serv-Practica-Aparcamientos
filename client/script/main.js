function loadMain() {
    console.log('::loadMain')

    var list = $('#main_list_inst');

    for (var i = 0; i < 25; i++) {
        var id = 'main_item_list' + i;
        list.append('<li class="inst inst_drag" id="' + id + '">Item ' + i + '</li>');
    }

    $('.inst_drag').click(function() {
        onMainInstSelected(this.id)
    })

    $('.inst_drag').draggable({
        helper: 'clone'
    });

    $(".inst_drop").droppable({
        accept: '.inst_drag',
        over: function(event, ui) {
            onMainDropped(ui.draggable[0].id)
        }
    });
}

function onMainDropped(id) {
    console.log('::onMainDropped:: ' + id)
}

function onMainInstSelected(id) {
    console.log('::onMainInstSelected:: ' + id)

}