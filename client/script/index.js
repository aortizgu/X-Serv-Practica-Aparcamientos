$('document').ready(function() {
    console.log('::ready');

    $('.tab').click(function() {
        $('.tab').removeClass('active')
        $('#' + this.id).addClass('active')
        onTab(this.id)
    })

    $('#but_load').click(function() { onLoad() });
    $('#but_save').click(function() { onSave() });
});

function onTab(id) {
    console.log('::onTab::' + id)
    $('.container_body').hide();
    switch (id) {
        case 'tab_main':
            $('#container_main').show();
            loadMain();
            break;
        case 'tab_inst':
            $('#container_inst').show();
            loadInst();
            break;
        case 'tab_col':
            $('#container_col').show();
            loadCol();
            break;
        default:
            break;
    }
}

function onLoad() {
    console.log('::onLoad')
}

function onSave() {
    console.log('::onSave')
}