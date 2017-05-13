var ColIdSelected = null;

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

    $('#col_but_load_inst').click(function() {
        onLoadInst();
    })

    $('#col_but_load_col').click(function() {
        $("#logger_load").modal()
    })
}

function showCol() {
    console.log('::showCol')
}

function onColLoadInst() {
    console.log('::onMainLoadInst')
    var list = $('#col_list_inst');
    INST['@graph'].forEach(function(i) {
        var id = 'col_list_inst_' + i['id'];
        list.append('<li class="inst col_inst_drag" id="' + id + '">' + i['title'].split('. ')[1] + '</li>');
    }, this);

    $('.col_inst_drag').draggable({
        helper: 'clone'
    });

}

function onColDropped(id) {
    id = id.substring(('col_list_inst_').length, id.length)
    console.log('::onColDropped:: ' + id)
    var col = getColById(ColIdSelected);
    if (col['inst'].indexOf(id) < 0) {
        col['inst'].push(id)
        onColColSelected('col_list_col_' + ColIdSelected)
    }
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
        onColColSelected(this.id)
    })

}

function onColColSelected(id) {
    $('.col_col').css('font-weight', 'normal');
    $('#' + id).css('font-weight', 'bold');

    id = id.replace(('col_list_col_'), '')
    console.log('::onColColSelected:: ' + id)

    $('.pre_select_col').hide()
    $('.post_select_col').show()
    ColIdSelected = id
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
        onColInstSelected(this.id)
    })

    $('.col_info_inst').show()
    onMainSelectCol()
}

function onColInstSelected(id) {
    id = id.replace('col_list_inst_', '')
    console.log('::onColInstSelected:: ' + id)
    var inst = getInstById(id)
    $('#col_inst_info').html(genInfoFromInst(inst))
}

function onColInstDropped(id) {
    id = id.replace(('col_list_inst_'), '')
    console.log('::onColInstDropped:: ' + id)
    var col = getColById(ColIdSelected)
    var index = col['inst'].indexOf(id)
    if (index >= 0) {
        col['inst'].splice(index, 1)
    }
    onColColSelected('col_list_col_' + ColIdSelected)
}

function onModyfyCol() {
    console.log('::onModyfyCol')
    var name = $('#col_new_name').val()
    var col = getColById(ColIdSelected);
    col['name'] = name
    onColLoadCol()
    onColColSelected('col_list_col_' + ColIdSelected)
}