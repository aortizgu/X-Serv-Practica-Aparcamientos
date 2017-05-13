var MainMap = null;
var MainMarker = null;
var MainLocationMarker = null;

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

function onMainDropped(id) {
    id = id.substring(('main_list_inst_').length, id.length)
    console.log('::onMainDropped:: ' + id)
}

function onMainInstSelected(id) {
    id = id.substring(('main_list_inst_').length, id.length)
    console.log('::onMainInstSelected:: ' + id)

    $('.pre_select_inst').hide()
    var inst = getInstById(id)
    $('#main_info').html(genInfoFromInst(inst))

    var latLng = genLatLngFromInst(inst);
    if (MainMarker != null) {
        MainMap.removeLayer(MainMarker);
    }
    MainMarker = L.marker(latLng).addTo(MainMap).bindPopup(inst['title'].split('. ')[1]).openPopup();;
    MainMap.panTo(latLng);
}

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
        onMainInstSelected(this.id)
    })
}

function onMainSelectCol() {
    console.log('::onMainLoadInst')
    var list = $('#main_list_col');
    list.html('')
    var col = getColById(ColIdSelected);
    $('#pre_select_col').text(col['name'])
    col['inst'].forEach(function(i) {
        var inst = getInstById(i)
        var id = 'main_list_inst_' + inst['id']
        list.append('<li class="inst main_col" id="' + id + '">' + inst['title'].split('. ')[1] + '</li>');
    }, this);

    $('.main_col').click(function() {
        onMainInstSelected(this.id)
    })

}


function onMainLocationFound(e) {
    var radius = e.accuracy / 2;

    if (MainLocationMarker != null) {
        MainMap.removeLayer(MainLocationMarker);
    }

    MainLocationMarker = L.marker(e.latlng).addTo(MainMap)
        .bindPopup("Se encuentra aquí").openPopup();
}

function onMainColSelected(id) {
    id = id.substring(('main_list_col_').length, id.length)
    console.log('::onMainColSelected:: ' + id)
}