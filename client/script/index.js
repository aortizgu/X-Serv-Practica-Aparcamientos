///////////////GLOBAL OBJECTS
var INST = null;
var COLS = [];
var USERS = {};
var GITHUB = null;
var Dialog = null;
var ColIdSelected = null;
var InstSelected;
///////////////

///////////////TABS METHODS
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
    loadCol();
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
///////////////

///////////////MULTIPLEX EVENTS
function onInstSelected(id) {
    $('.pre_select_inst').hide()
    $('.post_select_inst').show()
    InstSelected = id
    onMainInstSelected(id)
    onInstInstSelected(id)
    onColInstSelected(id)
    createCarrousel(id)
}

function onColSelected(id) {
    $('.pre_select_col').hide()
    $('.post_select_col').show()
    ColIdSelected = id
    onMainColSelected(ColIdSelected)
    onInstColSelected(ColIdSelected)
    onColColSelected(ColIdSelected)
}

function onNewUserInfo(user) {
    USERS[user.id] = user
    onInstNewUser(user)
}

function onNewUser(id) {
    $('.pre_load_foll').hide()
    $('.post_load_foll').show()
    if (USERS[id] == undefined) {
        handleClientLoad(id)
    }
}
///////////////

///////////////LOAD||SAVE METHODS
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
            onInstLoadInst();
        })
        .fail(function() {
            console.log("error loading " + "/data/202584-0-aparcamientos-residentes.json");
        })
        .always(function() {});
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

function onLoadFoll() {
    console.log('::onLoadFoll')

    try {
        var host = "ws://localhost:8080/";
        console.log("::onLoadFoll::Host:", host);
        var s = new WebSocket(host);
        s.onopen = function(e) {
            console.log("::onLoadFoll::Socket opened.");
        };
        s.onclose = function(e) {
            console.log("::onLoadFoll::Socket closed.");
        };
        s.onmessage = function(e) {
            console.log("::onLoadFoll::Socket message:", e.data);
            onNewUser(e.data)
        };
        s.onerror = function(e) {
            console.log("Socket error:", e);
        };
    } catch (ex) {
        console.log("Socket exception:", ex);
    }
}
///////////////

///////////////INST TOOLS
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

function getWikimediaUrls(inst) {
    $.ajax({
            url: "https://commons.wikimedia.org/w/api.php?format=json&action=query&generator=geosearch&ggsprimary=all&ggsnamespace=6&ggsradius=50&ggscoord=" + inst['location']['latitude'] + "|" + inst['location']['longitude'] + "&ggslimit=10&prop=imageinfo&iilimit=1&iiprop=url&iiurlwidth=200&iiurlheight=200&callback=?",
            type: 'GET',
            cache: false
        })
        .done(function(data, status) {
            INST = JSON.parse(JSON.stringify(data));
            $('.pre_load_inst').hide();
            onMainLoadInst();
            onColLoadInst();
            onInstLoadInst();
        })
        .fail(function() {
            console.log("error loading " + "/data/202584-0-aparcamientos-residentes.json");
        })
        .always(function() {});
}

function createCarrousel(id) {
    console.log('::createCarrousel')
    var classTarget = 'inst_carrousel'
    var inst = getInstById(id)
    var url = "https://commons.wikimedia.org/w/api.php?format=json&action=query&generator=geosearch&ggsprimary=all&ggsnamespace=6&ggscoord=" + inst['location']['latitude'] + "|" + inst['location']['longitude'] + "&ggslimit=10&prop=imageinfo&iilimit=1&iiprop=url&iiurlwidth=200&iiurlheight=200&callback=?";

    $.getJSON({
            url: url,
            type: 'GET',
            cache: false
        })
        .done(function(data, status) {
            console.log("loaded " + url);
            data.query.pages.forEach(function(element) {
                console.log("loaded " + element.imageinfo[0].url);
            }, this);
        })
        .fail(function() {
            console.log("error loading " + url);
        })
        /* <div id="myCarousel" class="carousel slide" data-ride="carousel">
                <ol class="carousel-indicators">
                    <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
                    <li data-target="#myCarousel" data-slide-to="1"></li>
                    <li data-target="#myCarousel" data-slide-to="2"></li>
                </ol>
                <div class="carousel-inner" role="listbox">
                    <div class="item active">
                        <img class="first-slide" src="images/deparIII-edificio3.JPG" alt="First slide">
                        <div class="container">
                            <div class="carousel-caption">
                                <h1>Departamental III</h1>
                                <p>Este es el Departamental III, el edificio más nuevo de la universidad con casi 50 aulas, en el que se imparten clases de todos los grados y master.</p>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <img class="second-slide" src="images/aularioII-edificio.JPG" alt="Second slide">
                        <div class="container">
                            <div class="carousel-caption">
                                <h1>Aulario II</h1>
                                <p>Este es el Aulario II, con casi 20 aulas, en el que se imparten clases de todos los grados y master.</p>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <img class="third-slide" src="images/deporte-estadio.JPG" alt="Third slide">
                        <div class="container">
                            <div class="carousel-caption">
                                <h1>Estadio Raúl Gonzalez Blanco</h1>
                                <p>El estadio Raúl Gonzalez Blanco alberga campo de fútbol, rugby y pista de atletismo adjunto a una amplio set de instalaciones deportivas.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">
                    <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">
                    <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                </a>
            </div>*/
}

function genInfoFromInst(inst, classExtra) {
    console.log('::genInfoFromId')
    var head = inst['title'].split('. ')[1]
    var body = inst['organization']['organization-desc'] + '<br/>' + inst['address']['street-address'] + ' ' + inst['address']['postal-code'] + ' ' + inst['address']['locality']
    if (inst.foll != undefined) {
        body += '<br/>Followers: '
        var first = true
        for (var i in inst.foll) {
            if (!first) {
                body += ', '
            }
            body += USERS[inst.foll[i]].displayName + ' '
            first = false
        }
        body += '.'
    }
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
    var ret = '<div class="panel panel-default '
    if (classExtra != undefined) {
        ret += classExtra
    }
    ret += '">  <div class="panel-body"><div class="media"><div class="media-body"><h4 class="media-heading">' + head + '</h4>' + body + '<div id="myCarousel" class="carousel slide inst_carrousel" data-ride="carousel"></div></div></div></div></div>';
    return ret
}

function genLatLngFromInst(inst) {
    return new L.LatLng(inst['location']['latitude'], inst['location']['longitude'])
}
///////////////

///////////////COL TOOLS
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

function deleteColById(id) {
    console.log('::deleteColById')
    var ret = null;
    for (var i in COLS) {
        if (COLS[i]['id'] == id) {
            COLS.splice(i, 1)
            break;
        }
    }
}

function newCol(name) {
    console.log('::newCol ' + name)
    var col = {
        "name": name,
        "id": guid(),
        "inst": []
    }
    COLS.push(col)
    onColLoadCol();
    $('.pre_load_col').hide()
}
///////////////

///////////////GOOGLE+ API
function handleClientLoad(id) {
    gapi.client.setApiKey('AIzaSyAR9Q_escnuyjAkTudGwdIACNadESixNKA');
    makeApiCall(id);
}

function makeApiCall(id) {
    gapi.client.load('plus', 'v1', function() {
        var request = gapi.client.plus.people.get({
            'userId': id
        });
        request.execute(function(resp) {
            console.log('::makeApiCall:: name ' + resp.displayName)
            onNewUserInfo(resp)
        });
    });
}
///////////////

///////////////MISC TOOLS
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}
///////////////
