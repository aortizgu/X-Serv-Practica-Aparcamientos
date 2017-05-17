///////////////TABS EVENTS
function loadCol() {
    console.log('::loadCol')

    $(".col_drop").droppable({
        accept: '.col_inst_drag',
        over: function(event, ui) {
            onColDropped(ui.draggable[0].id)
        }
    });

    $('.col_inst_list_drop').droppable({
        accept: '.col_list_drag',
        over: function(event, ui) {
            onColInstDropped(ui.draggable[0].id)
        }
    });

    $('#col_but_mod_col').click(function() {
        onModyfyCol();
    })

    $('#col_but_del_col').click(function() {
        onDeleteCol();
    })

    $('#col_but_load_inst').click(function() {
        onLoadInst();
    })

    $('#col_but_load_col').click(function() {
        $("#logger_load").modal()
    })

    $('#col_add_col').click(function() {
        $('#dialog_new_col').modal()
    })

    $('#dialog_new_col_ok').click(function(e) {
        e.preventDefault();
        newCol($('#dialog_new_col_name').val());
        $("#dialog_new_col").modal("hide")
    })
}

function showCol() {
    console.log('::showCol')
}
///////////////

///////////////LOAD EVENTS
function onColLoadInst() {
    console.log('::onColLoadInst')
    var list = $('#col_list_inst');
    INST['@graph'].forEach(function(i) {
        var id = 'col_list_inst_' + i['id'];
        list.append('<li class="inst col_inst_drag" id="' + id + '">' + i['title'].split('. ')[1] + '</li>');
    }, this);

    $('.col_inst_drag').draggable({
        helper: 'clone'
    });
}

function onColLoadCol() {
    console.log('::onColLoadCol')
    var list = $('#col_list_col')
    list.html('')
    $('.post_select_col').hide()
    COLS.forEach(function(i) {
        var id = 'col_list_col_' + i['id'];
        list.append('<li class="inst col_col" id="' + id + '">' + i['name'] + '</li>');
    }, this);

    $('.col_col').click(function() {
        onColSelected(this.id.replace('col_list_col_', ''))
    })
}
///////////////

///////////////SELECT EVENTS
function onColColSelected(id) {
    console.log('::onColColSelected:: ' + id)

    $('.col_col').css('font-weight', 'normal');
    $('#col_list_col_' + id).css('font-weight', 'bold');

    $('#col_inst_info').html('')
    var col = getColById(id)
    $('#main_col_name').text(col['name'])
    $('#col_new_name').val(col['name'])
    var list = $('#col_list_col_inst')
    list.html('')
    col['inst'].forEach(function(instId) {
        var inst = getInstById(instId)
        var id = 'col_list_inst_' + instId;
        list.append('<li class="inst col_list_inst col_list_drag" id="' + id + '">' + inst['title'].split('. ')[1] + '</li>');
    }, this);

    $('.col_list_drag').draggable({
        helper: 'clone'
    });

    $('.col_list_inst').click(function() {
        onInstSelected(this.id.replace('col_list_inst_', ''))
    })

    $('.col_info_inst').show()
}

function onColInstSelected(id) {
    console.log('::onColInstSelected:: ' + id)
    var inst = getInstById(id)
    $('#col_inst_info').html(genInfoFromInst(inst))
}
///////////////

///////////////DROP EVENTS
function onColDropped(id) {
    id = id.substring(('col_list_inst_').length, id.length)
    console.log('::onColDropped:: ' + id)
    var col = getColById(ColIdSelected);
    if (col['inst'].indexOf(id) < 0) {
        col['inst'].push(id)
        onColSelected(ColIdSelected)
    }
}

function onColInstDropped(id) {
    id = id.replace(('col_list_inst_'), '')
    console.log('::onColInstDropped:: ' + id)
    var col = getColById(ColIdSelected)
    var index = col['inst'].indexOf(id)
    if (index >= 0) {
        col['inst'].splice(index, 1)
    }
    onColSelected(ColIdSelected)
}
///////////////

///////////////MODIFY EVENTS
function onModyfyCol() {
    console.log('::onModyfyCol')
    var name = $('#col_new_name').val()
    var col = getColById(ColIdSelected);
    col['name'] = name
    onColLoadCol()
    onColSelected(ColIdSelected)
}

function onDeleteCol(id) {
    deleteColById(ColIdSelected)
    $('.pre_select_col').show()
    $('.post_select_col').hide()
    onColLoadCol()
}
///////////////