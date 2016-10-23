jQuery(function($){

  function scroll(){
    console.log($(this).height());
    $("#chatmsgs").animate({ scrollTop: 999999999999999 }, "slow");
  }

  //radio buttons
  $('#option-red').on('click',function(){
    var radioValue = $("input[name='colorText']:checked").val();
    $('#chatmsgs').css("color",radioValue);
  });
  $('#option-blue').on('click',function(){
    var radioValue=$("input[name='colorText']:checked").val();
    $('#chatmsgs').css("color",radioValue);
  });
  $('#option-black').on('click',function(){
    var radioValue=$("input[name='colorText']:checked").val();
    $('#chatmsgs').css("color",radioValue);
  });

  //initialize socket.io
  var socket = io.connect();

  //turn on connected status
  socket.on('connected',function(con){
    $('#status').html(con).css("color","green");
  });

  //when user connects
  socket.on('online',function(num){
    $('#online').html(num).css("color", "red").css("font-size",18);
    $('#chatmsgs').append("<p class=\"connect\" align=\"center\">------------------( user connected )---------------------</p><br/>" );
    scroll();
  });

  //when user disconnects
  socket.on('offline',function(num){
    $('#online').html(num).css("color","red").css("font-size",18);
    $('#chatmsgs').append("<p class=\"disconnect\" align=\"center\">------------------( user disconnected )------------------</p><br/>");
    scroll();
  });

  //when stored messages are received, push the stored messages to the client
  socket.on('stored-msgs',function(data){
    if($('#chatmsgs').text().length==10){ //10 is the length of an empty chatmsgs.text()
      console.log("stored-msgs incoming")
      for(var i=0;i<data.length;i++){
        $('#chatmsgs').append(data[i].name + ": " + data[i].msg + "<br/>");
      }
    }
    scroll();
  });

  //when a new message is incoming from the server 
  socket.on('new message',function(data){
    console.log(data.name + ": " + data.msg);
    $('#chatmsgs').append(data.name + ": " + data.msg + "<br/>");
    scroll();
  });

  //when the page load
  $(window).load(function(){
    console.log($('#username').text().length);

      //if the name field is empty
      if($('#username').text().length==0){
        $('#textbox').prop('disabled',true); //disable the textbox
        $('#name-form').submit(function(e){ //when the name field is submitted
          e.preventDefault();
          $('#username').prop('disabled',true);//enable the textbox
          $('#textbox').prop('disabled',false);//then disable the name field
        });
      }

    //when the textbox form is submitted
    $('#form').submit(function(e){
      console.log($('#username').val().length);
      e.preventDefault();
      var name = $('#username').val();
      var msg = $('#textbox').val();
      var message = {name:$('#username').val(),msg:$('#textbox').val()};
      socket.emit('send message', message);
      $('#textbox').val('');
      if(name.length != 0){
        $('#username').prop('disabled', true);
      }
    });
  });
});
