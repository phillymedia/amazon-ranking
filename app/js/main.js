var tippy = require("./tippy.min.js");

$(document).ready(function() {

  var drag_colors = ['#f3a847','#f2af5c','#f1b46e','#efba80','#ecc192','#e9c7a4','#e5cdb5','#e0d3c6','#d9d9d9'];
  for (i = 0; i < drag_colors.length; i++) {
    $(".drag:nth-child(" + (i + 1) + ")").css("border-color", drag_colors[i])
  }






  $('#select-all').click(function(event) {

          $('.drag input').each(function() {
              this.checked = true;
          });
          $(".drag").removeClass("unchecked");
interaction();
  });


  $(".drag input").click(function() {
    if (!$(this).is(':checked')) {
      $(this).parent().addClass("unchecked");
    } else {
      $(this).parent().removeClass("unchecked");
    }
    interaction();
  });

  var metro_list = require("./metro-data.json");
  var metro_shape = require("./metro_shape.json");

  function sortResults(prop, asc) {
    metro_list = metro_list.sort(function(a, b) {
      if (asc) return (a[prop] > b[prop]);
      else return (b[prop] > a[prop]);
    });
  }
  var marker = new Array();

  function interaction() {
    //create empy array
    $(".my-div-icon:visible").remove();
    var user_list = [];
    var rank = 8;
    $(".list-group-item input:checked").each(function() {
      //assign data-rank
      //var rank = $(this).index(".list-group-item input:checked");
      //$(this).closest('.list-group-item').attr("data-rank", rank + 1);
      $(this).closest('.list-group-item').attr("data-rank", rank);
      //create array from user list
      user_list[this.closest('.list-group-item').id] = Number(rank);
      //console.log(user_list);
      rank--;
    });


    //empty #results container
    $("#rank-table tbody").html("");

    //clear map
    var city_markers = [];

    //find, multiply, and creat new list
    var new_list = [];
    for (i = 0; i < metro_list.length; i++) {
      for (prop in user_list) {
        if (metro_list[i][prop]) {
          new_list[prop] = metro_list[i][prop] * user_list[prop];
        }
      }
      new_list["metro"] = metro_list[i].metro;
      new_list["population"] = metro_list[i].population;
      new_list["education_raw"] = metro_list[i].education_raw;
      new_list["students_raw"] = metro_list[i].students_raw;
      new_list["diversity_raw"] = metro_list[i].diversity_raw;
      new_list["laborCosts_raw"] = metro_list[i].laborCosts_raw;
      new_list["transit_raw"] = metro_list[i].transit_raw;
      new_list["crime_raw"] = metro_list[i].crime_raw;
      new_list["costOfLiving_raw"] = metro_list[i].costOfLiving_raw;
      new_list["lat"] = metro_list[i].lat;
      new_list["long"] = metro_list[i].long;

      //convert undefined to 0
      if (new_list.tax === undefined) {
        new_list.tax = 0;
      }
      if (new_list.education === undefined) {
        new_list.education = 0;
      }
      if (new_list.students === undefined) {
        new_list.students = 0;
      }
      if (new_list.airport === undefined) {
        new_list.airport = 0;
      }
      if (new_list.diversity === undefined) {
        new_list.diversity = 0;
      }
      if (new_list.laborCosts === undefined) {
        new_list.laborCosts = 0;
      }
      if (new_list.transit === undefined) {
        new_list.transit = 0;
      }
      if (new_list.living === undefined) {
        new_list.living = 0;
      }
      if (new_list.crime === undefined) {
        new_list.crime = 0;
      }
      if (new_list.costOfLiving === undefined) {
        new_list.costOfLiving = 0;
      }

      var city_table = "<table id='data-table-popup' class='minim-table'><tbody><tr align='left'><td>Population:<div class='subtext'>people</div></td><td class='data-highlight'><span>" + new_list.population + "</span></td><td>Diversity:<div class='subtext'>minority makeup</div></td><td class='data-highlight'><span>" + new_list.diversity_raw + "</span></td></tr><tr align='left'><td>Students:<div class='subtext'>undergraduate students</div></td><td class='data-highlight'><span>" + new_list.students_raw + "</span></td><td>College Graduates:<div class='subtext'>25+ w/ bachelor's</div></td><td class='data-highlight'><span>" + new_list.education_raw + "</span></td></tr><tr align='left'><td>Cost of Living:<div class='subtext'>avg monthly housing cost</div></td><td class='data-highlight'><span>" + new_list.costOfLiving_raw + "</span></td><td>Labor Costs:<div class='subtext'>avg IMP salary*</div></td><td class='data-highlight'><span>" + new_list.laborCosts_raw +
      "</span></td></tr><tr align='left'><td>Crime rate:<div class='subtext'>per 100,000 people</div></td><td class='data-highlight'><span>" + new_list.crime_raw + "</span></td><td>Transit:<div class='subtext'>annual delay**</div></td><td class='data-highlight'><span>" + new_list.transit_raw + "</span></td></tr></tbody></table>"

      //append rows to table
      $("#rank-table tbody").append('<tr title="' + city_table + '" data-score="' + (new_list.tax + new_list.education + new_list.students + new_list.airport + new_list.diversity + new_list.laborCosts + new_list.transit + new_list.crime + new_list.costOfLiving) + '" data-tax="' + new_list.tax + '" data-education="' + new_list.education +
        '" data-students="' + new_list.students + '" data-airport="' + new_list.airport + '" data-diversity="' + new_list.diversity + '" data-laborCosts="' + new_list.laborCosts + '" data-transit="' + new_list.transit + '" data-crime="' + new_list.crime + '" data-costOfLiving="' + new_list.costOfLiving +
        '" data-population="' + new_list.population + '" data-education_raw="' + new_list.education_raw + '" data-students_raw="' + new_list.students_raw + '" data-diversity_raw="' + new_list.diversity_raw + '" data-laborCosts_raw="' + new_list.laborCosts_raw + '" data-transit_raw="' + new_list.transit_raw + '" data-crime_raw="' + new_list.crime_raw + '" data-costOfLiving_raw="' + new_list.costOfLiving_raw + '" data-lat="' + new_list.lat + '" data-long="' + new_list.long + '" class="rank-row"><td class="rank"></td><td>' + new_list.metro + '</td></tr>');
    };



    tippy('.rank-row', {
      animation: 'scale',
      duration: 0,
      arrow: true,
      theme: 'light'
    });
    var $wrapper = $('#rank-table tbody');
    $wrapper.find('.rank-row').sort(function(a, b) {
      return +a.dataset.score - +b.dataset.score;
    }).appendTo($wrapper);





    //fill data rows
    var data_fields = ["population", "education_raw", "students_raw", "diversity_raw", "laborcosts_raw", "transit_raw", "crime_raw", "costofliving_raw"];
    for (i = 0; i < data_fields.length; i++) {
      var cell_id = ("#" + data_fields[i] + "_cell")
      $(cell_id).html("<span>" + $("#rank-table tbody tr:first-of-type").data(data_fields[i]) + "</span>");

    }
    // console.log($("#rank-table tbody tr:first-of-type").data("population"));

    //assign colors to list
    for (i = 0; i < drag_colors.length; i++) {
      $(".drag:nth(" + (i + 1) + ")").css("border-color", drag_colors[i])
    }
    //assign ranks
    var rank = $("td.rank").length;
    for (i = 0; i < rank; i++) {
      $(".rank-row:nth-of-type(" + (i + 1) + ")").find(".rank").html("#" + (i + 1));
    }
    //show Philly ranking

    var top5 = $(".rank-row:nth-of-type(1n+6)");


if ($('.rank-row:nth-of-type(1):contains("Philadelphia-Camden-Wilmington")').length > 0) {

} else {
    $('.rank-row:contains("Philadelphia-Camden-Wilmington")').show();
    $('.rank-row:contains("Philadelphia-Camden-Wilmington")').css({
      'background-color' : 'rgba(35, 47, 62, 0.2)',
      'border-top': '2px solid black'
    });
}



$( ".rank-row:lt(5)" ).each(function( index ) {
  //console.log( index + ": " + $( this ).text() );
      lat = $(this).data("lat"),
      lng = $(this).data("long")
  //console.log([lat, lng]);

  //create marker for cities
  var indexClass = ("my-div-icon my-div-icon_" + index);
  var myIcon = L.divIcon({className: indexClass});
  console.log(myIcon);
  // var city_marker = $(".rank-row:first-of-type"),
  //     lat = (city_marker[0].dataset.lat),
  //     lng = (city_marker[0].dataset.long);
      //marker_latlong = [city_marker[0].dataset.lat, city_marker[0].dataset.long];
      //$(".my-div-icon:visible").remove();
  var marker = new L.marker([lat, lng], {icon: myIcon}).bindPopup($(this).find('td:nth-of-type(2)').text()).addTo(map);
  if (indexClass == ("my-div-icon my-div-icon_0")){
      map.panTo([lat, lng]);
  }

  var checked = $('.drag input:checked');
  if (checked.length == 0) {
    $(".my-div-icon").remove();
    $("#cleared").css("display","block");
    $(".blur").css("filter", "blur(5px)")
  } else {
    $("#cleared").css("display","none");
    $(".blur").css("filter", "none")

    //move first row to new container
    var num1_city = $("#rank-table tbody tr:first-of-type td:nth-of-type(2)").html();
    $("#num1_container #num1_city").html(num1_city);

  }




});



  }

  //user interaction
  Sortable.create(rankList, {
    animation: 150, // ms, animation speed moving items when sorting, `0` — without animation
    onSort: function(evt) {
      interaction();
    },

  });



  //map
  var map = L.map('results-map', {
    attributionControl: false,
    minZoom:3,
    maxZoom:5,
    scrollWheelZoom: false



}).setView([39.187075, -97.159753], 3);
  mapLink =
    '<a href="http://openstreetmap.org">OpenStreetMap</a>';
  L.tileLayer(
    'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; ' + mapLink + ' Contributors',
      maxZoom: 18,
    }).addTo(map);




  //console.log(metro_shape.features[6].properties.NAME);


  //mobile table

interaction();

});
