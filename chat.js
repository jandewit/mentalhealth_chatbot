var shiftDown = false;
var script = require('./script')();
var current_step = 0;
var silence_timer;

$(document).ready(function() {
  processBotMessage(script[current_step]);

  $('#input_field').on('input', function(e) {
    if (script[current_step].type == 'silence') {

      var silence_time = 5000;
      if (script[current_step].silence_time !== undefined) {
        silence_time = script[current_step].silence_time;
      }

      var content = $("#input_field").html().replace(/<div>/gi,'<br>').replace(/<\/div>/gi,'').replace('<br><br><br>', '<br><br>');
      if (content == '') {
        silence_timer = setTimeout(function() { startTyping(script[current_step]); }, silence_time);
      }
      else {
        clearTimeout(silence_timer);
        $('#typing').hide();
      }
    }
  });
});

$(document).keypress(function (e) {
    if(e.keyCode == 13) {
        if($('#input_field').is(":focus") && !shiftDown) {
            e.preventDefault(); // prevent another \n from being entered
            postMessage();
        }
    }
});

$(document).keydown(function (e) {
    if(e.keyCode == 16) shiftDown = true;
});

$(document).keyup(function (e) {
    if(e.keyCode == 16) shiftDown = false;
});

function postMessage() {
  var content = $("#input_field").html().replace(/<div>/gi,'<br>').replace(/<\/div>/gi,'').replace('<br><br><br>', '<br><br>');

  if (content != '') {
    var bubble = $(`    <div class="bubble_container">
          <div class="bubble_1">
            <div class="bubble_1_content">
              ` + content + `
            </div>
            <div class="bubble_1_tail">
              <img src="img/chat_pink.svg" />
            </div>
          </div>
        </div>`);

    $("#messages").append(bubble);

    $('#messages').find('#typing').appendTo('#messages');

    setTimeout(function() { $("body").scrollTop($("body")[0].scrollHeight); }, 10);

    $("#input_field").empty();

    if (script[current_step].type == 'silence') {
      var silence_time = 5000;
      if (script[current_step].silence_time !== undefined) {
        silence_time = script[current_step].silence_time;
      }

      silence_timer = setTimeout(function() { startTyping(script[current_step]); }, silence_time);
    }

    // Check to see if we are currently awaiting input
    if (script[current_step].type == 'boolean') {
      if (content.toLowerCase().includes('ja') || content.toLowerCase().includes('ok')) {
        current_step = script[current_step].positive;
        processBotMessage(script[current_step]);
      }
      else if (content.toLowerCase().includes('nee')) {
        current_step = script[current_step].negative;
        processBotMessage(script[current_step]);
      }
      else {
        processBotMessage({
          'typing_time': 3000,
          'type': 'timed',
          'timing': 1,
          'text': 'Ik begrijp dit antwoord niet, probeer met \'ja\' of \'nee\' te antwoorden.',
          'next': current_step
        });
      }
    }

    else if (script[current_step].type == 'any') {
      if (script[current_step].next !== undefined) {
        current_step = script[current_step].next;
      }
      else {
        current_step++;
      }

      processBotMessage(script[current_step]);
    }
  }
}

function processBotMessage(msg) {

  if (msg.type == 'timed') {
    setTimeout(function() { startTyping(msg); }, msg.timing);
  }

  /*else if (msg.type == 'silence') {
    var silence_time = 5000;
    if (msg.silence_time !== undefined) {
      silence_time = msg.silence_time;
    }

    var content = $("#input_field").html().replace(/<div>/gi,'<br>').replace(/<\/div>/gi,'').replace('<br><br><br>', '<br><br>');
    if (content == '') {
      silence_timer = setTimeout(function() { startTyping(msg); }, silence_time);
    }
  }*/
}

function startTyping(msg) {
  $('#messages').find('#typing').appendTo('#messages');
  $('#typing').show();
  $("body").scrollTop($("body")[0].scrollHeight);
  silence_timer = setTimeout(function() { postBotMessage(msg); }, msg.typing_time);
}

function postBotMessage(msg) {
  $('#typing').hide();
  var bubble = $(`    <div class="bubble_container">
    <div class="bubble_2_img">
      <div class="cute-robot-v1 cute-robot-v1-small">
        <div class="circle-bg">
          <div class="robot-ear left"></div>
          <div class="robot-head">
            <div class="robot-face">
              <div class="eyes left"></div>
              <div class="eyes right"></div>
              <div class="mouth"></div>
            </div>
          </div>
          <div class="robot-ear right"></div>
          <div class="robot-body"></div>
        </div>
      </div>
    </div>
    <div class="bubble_2">
      <div class="bubble_2_tail">
        <img src="img/chat_gray.svg" />
      </div>
      <div class="bubble_2_content">
        ` + msg.text + `
      </div>
    </div>
  </div>`);

  $("#messages").append(bubble);

  setTimeout(function() { $("body").scrollTop($("body")[0].scrollHeight); }, 10);

  if (msg.next !== undefined) {
    current_step = msg.next;
  }
  else {
    current_step++;
  }

  processBotMessage(script[current_step]);
}
