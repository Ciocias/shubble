function request_tweet () {

  var img = document.getElementById('pic').getElementsByTagName('img')[0];
  
  if (img === undefined)
  {
    alert('Image is missing, reloading...');
    socket.emit('image-request');
  }

  var link = img.getAttribute('src');
  
  var cookies = {
    oauth_token: document.cookie.oauth_token,
    oauth_verifier: document.cookie.oauth_verifier
  };

  var quote = {
    text: document.getElementById('quote').getElementsByTagName('h2')[0].innerHTML,
    author: document.getElementById('quote').getElementsByTagName('a')[0].innerHTML
  };

  socket.emit('tweet-request',
    {
      link: link,
      cookies: cookies,
      quote: quote

    });
};

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

function ready_tweet_cb (err) {
  if (err)
    alert("Cannot post tweet");
  else
    alert("Tweet posted!");
};

function handle_auth_error ()
{
  // redirect to root
  window.location.assign("http://127.0.0.1:3000")
}

function getCookie(c_name)
{
  var i,x,y,ARRcookies=document.cookie.split(";");

  for (i=0;i<ARRcookies.length;i++)
  {
    x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
    y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
    x=x.replace(/^\s+|\s+$/g,"");
    if (x==c_name)
    {
        return unescape(y);
    }
   }
}

var socket = io.connect('http://localhost:3000/');

socket.on('image-ready', ready_image_cb);
socket.on('quote-ready', ready_quote_cb);
socket.on('tweet-ready', ready_tweet_cb);

socket.on('auth-error', handle_auth_error);

socket.emit('image-request');
socket.emit('quote-request');

var reload_image = document.createElement('button');
reload_image.setAttribute('class', 'w3-btn-floating-large w3-left w3-green');
reload_image.innerHTML = 'I';

reload_image.addEventListener('click', () => {
  document.getElementById('pic').innerHTML = '';

  socket.emit('image-request');
});

var reload_quote = document.createElement('button');
reload_quote.setAttribute('class', 'w3-btn-floating-large w3-left w3-green');
reload_quote.innerHTML = 'Q';

reload_quote.addEventListener('click', () => {
  document.getElementById('quote').innerHTML = '';

  socket.emit('quote-request');
});

var share = document.createElement('button');
share.setAttribute('class', 'w3-btn-floating-large w3-right w3-green');
share.innerHTML = 'Share';
share.addEventListener('click', () => {

  var img = document.getElementById('pic').getElementsByTagName('img')[0];
  
  if (img === undefined)
  {
    alert('Image is missing, reloading...');
    socket.emit('image-request');
  }

  var link = img.getAttribute('src');
  
  var cookies = {
    oauth_token: getCookie('oauth_token'),
    oauth_verifier: getCookie('oauth_verifier')
  };

  var quote = {
    text: document.getElementById('quote').getElementsByTagName('h2')[0].innerHTML,
    author: document.getElementById('quote').getElementsByTagName('a')[0].innerHTML
  };

  socket.emit('tweet-request',
    {
      link: link,
      cookies: cookies,
      quote: quote

    });
});

document.body.getElementsByTagName('footer')[0].appendChild(reload_image);
document.body.getElementsByTagName('footer')[0].appendChild(reload_quote);
document.body.getElementsByTagName('footer')[0].appendChild(share);
