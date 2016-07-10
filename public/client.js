var socket = io.connect('http://127.0.0.1:3000');

function request_tweet () {};

function ready_image_cb (data) {

  var hhh = document.createElement('h3');
  hhh.innerHTML = data.alt;
  
  var img = document.createElement('img');
  img.setAttribute('src', data.src);
  img.setAttribute('alt', data.alt);
  
  var pic = document.getElementById('pic');

  pic.appendChild(hhh);
  pic.appendChild(img);
};

function ready_quote_cb (data) {
  
  var hh = (document.createElement('h2'));
  hh.innerHTML = data.text;
  
  var link = document.createElement('a');
  link.innerHTML = data.author;
  link.setAttribute('href', data.link);

  var quote = document.getElementById('quote');

  quote.appendChild(hh);
  quote.appendChild(link);  
};

function ready_tweet_cb (data) {
  //data.result maybe error
  alert(data.result);
};

socket.on('image_ready', ready_image_cb);
socket.on('quote_ready', ready_quote_cb);
socket.on('tweet_ready', ready_tweet_cb);

socket.emit('image_request');
socket.emit('quote_request');

document.getElementById('sharebtn').addEventListener(request_tweet);
