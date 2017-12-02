function updateUserList(data) {
    if (data.length > 0) {
        $('#list-member').html("");
        data.forEach(function(i) {
            $("#list-member").append("<div class='user'>" + i + "</div>");
        });
    }
}

var isSend = false;

function clientSendMessage() {
    var message = $('#message').val();
    var msg = message.trim();
    if (msg) {
        socket.emit('client-send-message', msg);
    }
    $('#message').val('');

}

function showMemberAction(user, act) {
    if (!act) act = 'join';
    var msg = '';
    if (act == 'join') {
        msg = "vừa vào phòng chat";
    } else {
        msg = "vừa rời phòng chat";
    }
    $("#chat-block").append("<div class='warning'><strong>" + user + "</strong> " + msg + "</div>");
    $("#chat-box").scrollTop(12300);
}


var socket = io("https://demo-chat-box.herokuapp.com");

socket.on('server-send-chat-data', function(data) {
    updateUserList(data.list);
    $("#chat-block").html('');
    data.messages.map(function(m) {
        $("#chat-block").append("<div class='msg'><strong>" + m.user + "</strong>: " + m.msg + "</div>");
    });

});

socket.on('server-send-register-fail', function() {
    $('#register-message').html('Vui lòng chọn nick nam khác');
});
socket.on('server-send-register-success', function(data) {
    socket.username = data;
    $('#register-form').hide(1000);
    $('#chat-form').show(1000);
});
socket.on('server-send-update-userlist', function(data) {
    updateUserList(data.list);
    showMemberAction(data.user, data.type);
    $("#chat-box").scrollTop(12300);

});
socket.on('server-send-message', function(data) {
    $("#chat-block").append("<div class='msg'><strong>" + data.user + "</strong>: " + data.msg + "</div>");
    $("#chat-box").scrollTop(12300);
});

socket.on('someone-are-writing', function(data) {
    var whois = null;
    if (data.length > 0) {
        for (var i = data.length - 1; i >= 0; i--) {
            var w = data[i];
            if (w != socket.username) {
                whois = w;
                i = -1;
                break;
            }
        }
        if (whois) {
            $('#chat-status').html('<i>' + whois + ' đang viết tin nhắn...</i>');
            return;
        }
    }
    $('#chat-status').html('');
});





$(document).ready(function() {
    //dang ky 
    $('#register').click(function() {
        var un = $('#username').val();
        var usrn = un.trim();
        if (usrn) {
            socket.emit('client-send-username', usrn);
        }
    });

    $("#message").keydown(function(e) {
        // Enter was pressed without shift key
        if (e.keyCode == 13 && !e.shiftKey) {
            clientSendMessage();
            isSend = true;
        }
    });
    $("#message").keyup(function(e) {
        // Enter was pressed without shift key
        if (isSend) {
            $('#message').val('');
            isSend = false;
        }
    });

    $('#send').click(function() {
        clientSendMessage();
    });

    $('#message').focusin(function() {
        socket.emit('writing');
    });
    $('#message').focusout(function() {
        socket.emit('stop-writing');
    });
});