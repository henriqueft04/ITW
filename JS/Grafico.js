
$(document).ready(function(){

  $.ajax({
    type: 'GET',
    url:'http://192.168.160.58/Olympics/api/Statistics/Games_Competitions',
    dataType: 'json',
    contentType: 'application/json',
    success: function(response){
      // Parse the data and create the chart
      var datasets = response.map(function(item) {
        if (item.Counter) {
          return {
            label: item.Name,
            data: [item.Counter],
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1
          };
        }
      });
    
      datasets = datasets.filter(Boolean);
      var chartData = {
        labels: ["Counter"],
        datasets: datasets
      };
    
      var g1 = document.getElementById('graf1');
    
      var chart = new Chart(g1, {
        type: "bar",
        data: chartData,
        options: {}
      });
    }

  })



    $.ajax({
        type: 'GET',
        url:'http://192.168.160.58/Olympics/api/Statistics/Games_Athletes',
        dataType: 'json',
        contentType: 'application/json',
        success: function(response){
            // Parse the data and create the chart
            var datasets = response.map(function(item) {
              if (item.Counter) {
                return {
                  label: item.Name,
                  data: [item.Counter],
                  backgroundColor: "rgba(255,99,132,0.2)",
                  borderColor: "rgba(255,99,132,1)",
                  borderWidth: 1
                };
              }
            });
          
            datasets = datasets.filter(Boolean);
            var chartData = {
              labels: ["Counter"],
              datasets: datasets
            };
          
            var g2 = document.getElementById('graf2');
          
            var chart = new Chart(g2, {
              type: "bar",
              data: chartData,
              options: {}
            });
          }
    })
})

