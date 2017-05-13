//f5a66501b20a5682b5006ae60fc7b65ab367f863

var INST = null;
var COLS = [];

var GITHUB = null;
var Dialog = null;

$('document').ready(function() {
    console.log('::ready');

    $('.tab').click(function() {
        $('.tab').removeClass('active')
        $('#' + this.id).addClass('active')
        onTab(this.id)
    })

    $('#logger_login_save').click(function(e) {
        e.preventDefault();
        onSaveCol();
        $("#logger_save").modal("hide")
    })

    $('#logger_login_load').click(function(e) {
        e.preventDefault();
        onLoadCol();
        $("#logger_load").modal("hide")
    })

    $('#but_load').click(function() { $("#logger_load").modal() });
    $('#but_save').click(function() { $("#logger_save").modal() });

    loadMain();
    loadCol()
    loadInst();
});

function onTab(id) {
    console.log('::onTab::' + id)
    $('.my-container').hide();
    $('.container').hide();
    switch (id) {
        case 'tab_main':
            $('#container_main').show();
            showMain();
            break;
        case 'tab_inst':
            $('#container_inst').show();
            showInst();
            break;
        case 'tab_col':
            $('#container_col').show();
            showCol();
            break;
        default:
            break;
    }
}

function onLoadInst() {
    console.log('::onLoadInst')
    $.ajax({
            url: "/data/202584-0-aparcamientos-residentes.json",
            type: 'GET',
            cache: false
        })
        .done(function(data, status) {
            INST = JSON.parse(JSON.stringify(data));
            $('.pre_load_inst').hide();
            onMainLoadInst();
            onColLoadInst();
        })
        .fail(function() {
            console.log("error loading " + "/data/202584-0-aparcamientos-residentes.json");
        })
        .always(function() {});
}

function onSaveCol() {
    console.log('::onSaveCol')
    var token = $('#logger_token_save').val()

    GITHUB = new Github({
        token: token,
        auth: "oauth"
    });

    var user = GITHUB.getUser();

    user.userInfo(function(err, userData) {
        if (err == null) {
            var repo = GITHUB.getRepo(userData.login, 'test')
            repo.write('master', 'data.json',
                JSON.stringify(COLS),
                "save data",
                function(err) {
                    if (err == null) {
                        console.log("::onSaveCol:: successfuly saved")
                    } else {
                        console.log(err)
                    }
                });
        } else {
            console.log('::onSaveCol::ERROR: ' + err);
        }
    });

}


function onLoadCol() {
    console.log('::onLoadCol')
    var token = $('#logger_token_load').val()

    GITHUB = new Github({
        token: token,
        auth: "oauth"
    });

    var user = GITHUB.getUser();

    user.userInfo(function(err, userData) {
        if (err == null) {
            var repo = GITHUB.getRepo(userData.login, 'test')
            repo.read('master', 'data.json', function(err, data) {
                if (err == null) {
                    console.log('::onLoadCol: ' + data)
                    COLS = JSON.parse(data)
                    $('.pre_load_col').hide()
                    onColLoadCol();
                } else {
                    console.log('::onLoadCol::ERROR: ' + err);
                }
            })
        } else {
            console.log('::onLoadCol::ERROR: ' + err);
        }
    });

    if (INST == null) {
        onLoadInst()
    }
}

function getInstById(id) {
    console.log('::getInstById')
    var ret = null;
    for (var i in INST['@graph']) {
        if (INST['@graph'][i]['id'] == id) {
            ret = INST['@graph'][i]
            break;
        }
    }
    return ret;
}

function genInfoFromInst(inst) {
    console.log('::genInfoFromId')
    var head = inst['title'].split('. ')[1]
    var body = inst['organization']['organization-desc'] + '<br/>' + inst['address']['street-address'] + ' ' + inst['address']['postal-code'] + ' ' + inst['address']['locality']
    body = body.replace('Titularidad :', '<br/>Titularidad :');
    body = body.replace('Titularidad:', '<br/>Titularidad :');
    body = body.replace('Información sobre accesibilidad :', '<br/>Información sobre accesibilidad :');
    body = body.replace('Información sobre accesibilidad:', '<br/>Información sobre accesibilidad :');
    body = body.replace('Plaza para minusválidos residentes :', '<br/>Plaza para minusválidos residentes :');
    body = body.replace('Plaza para minusválidos residentes:', '<br/>Plaza para minusválidos residentes :');
    body = body.replace('Plazas motos :', '<br/>Plazas motos :');
    body = body.replace('Plazas motos:', '<br/>Plazas motos :');
    body = body.replace('Plazas para movilidad reducida :', '<br/>Plazas para movilidad reducida :');
    body = body.replace('Plazas para movilidad reducida:', '<br/>Plazas para movilidad reducida :');
    body = body.replace('Plazas :', '<br/>Plazas :');
    body = body.replace('Plazas:', '<br/>Plazas :');
    var ret = '<div class="panel panel-default">  <div class="panel-body"><div class="media"><div class="media-body"><h4 class="media-heading">' + head + '</h4>' + body + '</div></div></div></div>';
    return ret
}

function genLatLngFromInst(inst) {
    return new L.LatLng(inst['location']['latitude'], inst['location']['longitude'])
}

function getColById(id) {
    console.log('::getInstById')
    var ret = null;
    for (var i in COLS) {
        if (COLS[i]['id'] == id) {
            ret = COLS[i]
            break;
        }
    }
    return ret;
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function onCheckLogin() {


    $("#logger").modal("hide")
}