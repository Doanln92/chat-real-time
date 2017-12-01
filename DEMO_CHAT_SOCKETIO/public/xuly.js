var socket = io("http://localhost:3000");

socket.on("server-send-dki-thatbai", function(){
  alert("Sai Username (co nguoi da dang ki roi!!!)");
});

socket.on("server-send-danhsach-Users", function(data){
  $("#boxContent").html("");
  data.forEach(function(i){
    $("#boxContent").append("<div class='user'>" + i + "</div>");
  });
});

socket.on("server-send-dki-thanhcong", function(data){
  $("#currentUser").html(data);
  $("#loginForm").hide(2000);
  $("#chatForm").show(1000);
});

socket.on("server-send-mesage", function(data){
  $("#listMessages").append("<div class='ms'>" + data.un + ":" + data.nd +"</div>");
});

socket.on("ai-do-dang-go-chu", function(data){
  $("#thongbao").html("<img width='20px' src='typing05.gif'> " + data);
});

socket.on("ai-do-STOP-go-chu", function(){
  $("#thongbao").html("");
});


$(document).ready(function(){
  $("#loginForm").show();
  $("#chatForm").hide();

  $("#txtMessage").focusin(function(){
    socket.emit("toi-dang-go-chu");
  })

  $("#txtMessage").focusout(function(){
    socket.emit("toi-stop-go-chu");
  })

  $("#btnRegister").click(function(){
    socket.emit("client-send-Username", $("#txtUsername").val());
  });

  $("#btnLogout").click(function(){
    socket.emit("logout");
    $("#chatForm").hide(2000);
    $("#loginForm").show(1000);
  });

  $("#btnSendMessage").click(function(){
    socket.emit("user-send-message", $("#txtMessage").val());
  });


});
