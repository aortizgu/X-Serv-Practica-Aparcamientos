///////////////TABS EVENTS
function loadInst() {
    console.log('::loadInst')

    $('#list_but_load_inst').click(function() {
        onLoadInst();
    })

    $('#inst_but_load_foll').click(function() {
        onLoadFoll()
    })
}

function showInst() {
    console.log('::showInst')

}
///////////////

///////////////LOAD EVENTS
function onInstLoadInst() {
    console.log('::onInstLoadInst')
    var list = $('#inst_list_inst');
    INST['@graph'].forEach(function(i) {
        var id = 'inst_list_inst_' + i['id'];
        list.append('<li class="inst inst_list_inst_item" id="' + id + '">' + i['title'].split('. ')[1] + '</li>');
    }, this);

    $('.inst_list_inst_item').click(function() {
        onInstSelected(this.id.replace('inst_list_inst_', ''))
    })
}

function onInstLoadFoll() {
    console.log('::onInstLoadFoll')
}
///////////////

///////////////SELECT EVENTS
function onInstInstSelected(id) {
    console.log('::onInstInstSelected ' + id)
    var inst = getInstById(id)
    $('#inst_inst_info').html(genInfoFromInst(inst, 'inst', 'ints_inst_info_drop'))

    $('.ints_inst_info_drop').droppable({
        accept: '.ints_foll_drag',
        over: function(event, ui) {
            onFolDrag(ui.draggable[0].id)
        }
    });
}

function onFollowerDrag(id) {
    console.log('::onFollowerDrag ' + id)
    for (var i in INST['@graph']) {
        if (INST['@graph'][i].id == InstSelected) {
            if (INST['@graph'][i].foll == undefined) {
                INST['@graph'][i].foll = []
            }
            if (INST['@graph'][i].foll.indexOf(id) < 0) {
                INST['@graph'][i].foll.push(id)
            }
            break
        }
    }
    onInstSelected(InstSelected)
}

function onInstColSelected(id) {
    console.log('::onInstColSelected ' + id)
}
///////////////

///////////////GOOGLE+ EVENTS
function onInstNewUser(user) {
    $('#inst_list_foll').append('<li class="ints_foll_drag" id="' + user.id + '">' + user.displayName + '</li>');
    $('.ints_foll_drag').draggable({
        helper: 'clone'
    });
}
///////////////

///////////////
function onFolDrag(id) {
    console.log('::onFolDrag ' + id)
    onFollowerDrag(id)
}
///////////////