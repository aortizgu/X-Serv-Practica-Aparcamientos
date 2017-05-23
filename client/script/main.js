///////////////MAP VARIABLES
var MainMap = null;
var MainMarker = null;
var MainLocationMarker = null;
///////////////

///////////////TAB EVENTS
function loadMain() {
    console.log('::loadMain')

    $(".inst_drop").droppable({
        accept: '.main_inst_drag',
        over: function(event, ui) {
            onMainDropped(ui.draggable[0].id)
        }
    });

    $('#main_but_load_inst').click(function() {
        onLoadInst();
    })
}

function showMain() {
    console.log('::showMain')

    if (MainMap == null) {
        MainMap = L.map('main_map').locate({
            setView: true,
            maxZoom: 10
        });

        L.tileLayer('http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(MainMap)

        var defaultLocation = new L.LatLng(40.3050684, -3.835954700000002)
        MainLocationMarker = L.marker(defaultLocation).addTo(MainMap).bindPopup("Se encuentra aquí").openPopup();
        MainMap.panTo(defaultLocation);
        MainMap.on('locationfound', onMainLocationFound);
    }
}
///////////////

///////////////LOAD EVENTS
function onMainLoadInst() {
    console.log('::onMainLoadInst')
    var list = $('#main_list_inst');

    INST['@graph'].forEach(function(i) {
        var id = 'main_list_inst_' + i['id'];
        list.append('<li class="inst main_inst_drag" id="' + id + '">' + i['title'].split('. ')[1] + '</li>');
    }, this);

    $('.main_inst_drag').draggable({
        helper: 'clone'
    });

    $('.main_inst_drag').click(function() {
        onInstSelected(this.id.replace('main_list_inst_', ''))
    })
}
///////////////

///////////////SELECT EVENTS
function onMainInstSelected(id) {
    console.log('::onMainInstSelected:: ' + id)

    var inst = getInstById(id)
    $('#main_info').html(genInfoFromInst(inst, 'main'))
    if (MainMap != null) {
        if (MainMarker != null) {
            MainMap.removeLayer(MainMarker);
        }
        var latLng = genLatLngFromInst(inst);
        MainMarker = L.marker(latLng).addTo(MainMap).bindPopup(inst['title'].split('. ')[1]).openPopup();;
        MainMap.panTo(latLng);
    }
}

function onMainColSelected(id) {
    console.log('::onMainColSelected: ' + id)
    var list = $('#main_list_col');
    list.html('')
    var col = getColById(id);
    $('#pre_select_col').text(col['name'])
    col['inst'].forEach(function(i) {
        var inst = getInstById(i)
        var id = 'main_list_col_inst_' + inst['id']
        list.append('<li class="inst main_col" id="' + id + '">' + inst['title'].split('. ')[1] + '</li>');
    }, this);

    $('.main_col').click(function() {
        onInstSelected(this.id.replace('main_list_col_inst_', ''))
    })

}
///////////////

///////////////DROP EVENTS
function onMainDropped(id) {
    id = id.substring(('main_list_inst_').length, id.length)
    console.log('::onMainDropped:: ' + id)
}
///////////////

///////////////MAP EVENTS
function onMainLocationFound(e) {
    var radius = e.accuracy / 2;

    if (MainLocationMarker != null) {
        MainMap.removeLayer(MainLocationMarker);
    }

    MainLocationMarker = L.marker(e.latlng).addTo(MainMap)
        .bindPopup("Se encuentra aquí").openPopup();
}
///////////////