// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/Countries/');
    self.displayName = 'Country Details:';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.Name = ko.observable('');
    self.Flag = ko.observable('');
    self.IOC = ko.observable('');
    self.Url = ko.observable('');
    self.Total = ko.observable('');
    self.isIn = ko.observable(true)

    //Organizar data-binds //

    self.Events = ko.observableArray([
    {
            "Id": ko.observable(''),
            "Name": ko.observable(''),
            "Photo": ko.observable(''),
            "Modality": ko.observable(''),
            "Results": ko.observable('')
          }
    ]);
    self.Participant = ko.observableArray([
    {
            "Id": ko.observable(''),
            "Name": ko.observable(''),
            "Year": ko.observable(''),
            "CityName": ko.observable(''),
            "CountryName": ko.observable(''),
            "Logo": ko.observable(''),
            "Photo": ko.observable(''),
            "Lat": ko.observable(''),
            "Lon": ko.observable('')
        }
    ]);
    self.Organizer = ko.observableArray([
    {
            "Id": ko.observable(''),
            "Name": ko.observable(''),
            "Year": ko.observable(''),
            "CityName": ko.observable(''),
            "CountryName": ko.observable(''),
            "Logo": ko.observable(''),
            "Photo": ko.observable(''),
            "Lat": ko.observable(''),
            "Lon": ko.observable('')
        }
    ]);
    

    ////

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getCountries...');
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.Name(data.Name);
            self.Flag(data.Flag);
            self.IOC(data.IOC);
            self.Events(data.Events);
            self.Participant(data.Participant);
            self.Organizer(data.Organizer);
            self.Url(data.Url);
            
            




        });
    };

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }

    function sleep(milliseconds) {
        const start = Date.now();
        while (Date.now() - start < milliseconds);
    }

    function showLoading() {
        $("#myModal").modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }


    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        console.log("sPageURL=", sPageURL);
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };
    
    $.ajax({
        type: "GET",
        url: "http://192.168.160.58/Olympics/api/Statistics/Medals_Country",
        dataType: "json",
        success: function (data) {
            var IdCounter = []; // array do tipo [CountryId, [Gold, Counter],[Silver, Counter], [Bronze, Counter]]
            
            for (i = 0; i < data.length; i++) {
                IdCounter.push([data[i].CountryId]);
                for (i2 = 0; i2 < data[i].Medals.length; i2++) {
                    IdCounter[i].push([data[i].Medals[i2].MedalName, data[i].Medals[i2].Counter]);
                }     
            }    
            console.log(IdCounter);
            
            google.charts.load("current", { packages: ["corechart"] });
            google.charts.setOnLoadCallback(drawChart);
    
            function drawChart() {
                for (i = 0; i < IdCounter.length; i++) {
                    if (IdCounter[i].includes(self.Id()) & IdCounter[i][0] == self.Id()) {
                        self.isIn(true);
                        console.log(IdCounter[i]);
                        var data = google.visualization.arrayToDataTable([
                            ["MedalName", "Counter"],
                            [IdCounter[i][1][0], IdCounter[i][1][1]],
                            [IdCounter[i][2][0], IdCounter[i][2][1]],
                            [IdCounter[i][3][0], IdCounter[i][3][1]],
                        ]);
                        
                        var options = {
                            title: "Divisão entre Ouro/Prata/Bronze",
                            titleTextStyle: {color: 'black'},
                            legend: {position: 'left', textStyle: {color: 'black', fontSize: 16}},
                            is3D: true,
                            colors: ['gold', 'silver', '#cd7f32' ],
                            
                        };
                        
                        var chart = new google.visualization.PieChart(
                            document.getElementById("chart")
                            );
                            
                        self.Total(IdCounter[i][1][1] + IdCounter[i][2][1] + IdCounter[i][3][1]);
                        console.log(self.Total());
                            
                        chart.draw(data, options);
                        break;
                    }
                    else {
                        self.isIn(false);
                    }
                }
            }
           
        },
        error: function () {
            alert("ERRO");
            hideLoading();
        },
    });

    search = function () {
        console.log("search");
        var api = 'http://192.168.160.58/Olympics/api/Countries/SearchByName?q=' + $("#searchArgs").val();
        self.countrieslist = [];
        ajaxHelper(api,'GET').done(function(data){
            console.log(data);
            showLoading();
            self.records(data);
            $('#pagination').addClass("d-none");
            $('#line').addClass("d-none");
            self.totalRecords(data.length);
            hideLoading();
            for (var info in data) {
                self.countrieslist.push(data[info]);
            }
        });
    }

    $("#searchArgs").autocomplete({ 
        minLength: 2,
        source: function(request, response) {
            $.ajax({
                type: "GET",
                url : "http://192.168.160.58/Olympics/api/Countries/SearchByName",
                data: { 
                    q: $('#searchArgs').val().toLowerCase()
                },
                success: function(data) {
                    if (!data.length) {
                        var result = [{
                            label: 'No results found.',
                            value: response.term,
                            source: " "
                        }];
                        response(result);
                    } else {
                        var nData = $.map(data, function(value, key){
                            return {
                                label: value.Name,
                                value: value.Id,
                                source: "SearchByName"
                            }
                        });
                        results = $.ui.autocomplete.filter(nData, request.term);
                        response(results);
                    }
                },
                error: function(){
                    alert("error");
                }
            }) 
        },
        select: function(event, ui) {
           window.location.href = "../HTML/paisesDetails.html?id=" + ui.item.value;
        },
    });

    //--- start ....
    showLoading();
    var pg = getUrlParameter('id');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");

    
};

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})