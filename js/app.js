                var map;
              var service;
              var infowindow;
             var markers2=ko.observableArray([]);
              var markers=ko.observableArray([]);
              var op;
              var e;
              function initialize() {    //this function used to dispaly map
                  var pyrmont = new google.maps.LatLng(35.5570454,45.43594250000001);  //lat and lng of sulimany

                  map = new google.maps.Map(document.getElementById('map'), {
                      center: pyrmont,
                      zoom: 15
                  });
                          var a=new AppViewModel(); 
                     
                  google.maps.event.addListenerOnce(map,'bounds_changed',a.performance);
                      
                     ko.applyBindings(new AppViewModel());  // Activates knockout.js
              };
              initialize();
                   

            function AppViewModel() {
              var self=this;
              
              
              
              this.performance=function() {

                     var request = {
                         bounds: map.getBounds(),  //using google map places librare to return all resturant inside sulimany
                         name: "restaurant's"
                     };
                       
                     service = new google.maps.places.PlacesService(map);
                     service.nearbySearch(request, self.callback);
                 };
                         
                self.callback=function (results, status) {
                             
                  if (status == google.maps.places.PlacesServiceStatus.OK) {
                      for (var i = 0; i < results.length; i++) {
                           var place = results[i];
                           
                                  markers2.push(place); //push ech place  to markers2 array
                                   
                                
                                 self.create(place)

                      }
                  }

              };
                    
                  
                self.create=function(pl) {

                      
                        op ='<option>'+pl.name+'</option>'; //create option 
                     
                      $("#list").append(op); 

                      var d=new google.maps.InfoWindow();

                       e = new google.maps.Marker({ //crete marker on the maps
                          map: map ,
                          draggable: true,
                          animation: google.maps.Animation.DROP,
                           position: pl.geometry.location
                      });


                      markers.push(e);


                      google.maps.event.addListener(e,'click',(function (a) {

                          return function () {
                              d.setContent('<div><h3>'+pl.name+'</h3><img src="'+pl.icon+'"></div>'); //display information about each place

                             d.open(map,a);

                          }

                      })(e));

                      e.addListener('click', function() {    //make animatinon of markers
                          for (var i = 0; i < markers().length; i++) {
                              markers()[i].setAnimation(null);
                          }
                          toggleBounce(this);
                          map.setZoom(17);
                          
                      });

              function toggleBounce(ele) {
                  if (ele.getAnimation() !== null) {
                      ele.setAnimation(null);
                  } else {
                      ele.setAnimation(google.maps.Animation.BOUNCE);
                  }
                      }


                  };
                      
                    
                    self.listres= function () {
                      
                 $('#list').change(function (){
                      
                  var d=new google.maps.InfoWindow();
                  var value=$(this).val();
                   console.log(value);
                    for(var i=0; i<markers2().length; i++) { //display enformation on location when click the option
                        if(value == markers2()[i].name){
                            d.setContent('<div><h3>'+markers2()[i].name+'</h3><img src="'+markers2()[i].icon+'"></div>');
                            d.open(map,markers()[i]);

                                 markers()[i].setAnimation(null);

                                toggleBounce(markers()[i]);
                                map.setZoom(17);
                                map.setCenter(markers()[i].getPosition());


                            function toggleBounce(ele) {
                                if (ele.getAnimation() !== null) {
                                    ele.setAnimation(null);
                                } else {
                                    ele.setAnimation(google.maps.Animation.BOUNCE);
                                }
                            }

                    }
                    }

              });
        };
               self.fltar =function () {  //flter of location of markers and list
                  
                  var serch=$('#serch').val();
                       
                  $.ajax({
                      type:"GET",
                      url:'https://maps.google.com/maps/api/geocode/json?address=' +serch+ '&sensor=false&key=AIzaSyDwTN8eExcaw0x3fDV6EECxtlsRZ_wTDGc',
                      dataType:"json",
                      success:function () {
                               $('#list').empty();

                                var serchWithoutSpace= $.trim(serch);
                                //console.log(markers().length);
                          for (var i = 0; i < markers().length; i++) {

                              if(serchWithoutSpace !== markers2()[i].name) {
                                  ;
                                  markers()[i].setMap(null);

                              }
                              else {
                                  markers()[i].setMap(map);
                                  op='<option>'+markers2()[i].name+'</option>';
                                   $('#list').append(op);
                              }

                          }

                      },
                            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                              alert("Status: " + textStatus); alert("Error: " + errorThrown); 
                                }
    

                  });
              };

              
               self.clearfltar=function () {  //clear flter
                  $.ajax({
                      type:"GET",
                      url:'https://maps.google.com/maps/api/geocode/json?address=' +serch+ '&sensor=false&key=AIzaSyDwTN8eExcaw0x3fDV6EECxtlsRZ_wTDGc',
                      dataType:"json",
                      success:function () {


                          for (var i = 0; i < markers().length; i++) {


                                  markers()[i].setMap(map);
                                  op='<option>'+markers2()[i].name+'</option>';
                                   $('#list').append(op);

                          }
                      },
                            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                              alert("Status: " + textStatus); alert("Error: " + errorThrown); 
                                }
     
                  });
              };

            }  
          
         
        