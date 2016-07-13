function request_tweet ()
{
  var img = document.getElementById('pic').getElementsByTagName('img')[0];
  
  if (img === undefined)
  {
    alert('Image is missing, reloading...');
    socket.emit('image-request');
    return;
  }

  var link = img.getAttribute('src');
  
  var cookies = {
    oauth_token: get_cookie('oauth_token'),
    oauth_verifier: get_cookie('oauth_verifier')
  };

  var quote = {
    text: document.getElementById('quote').getElementsByTagName('p')[0].innerHTML,
    author: document.getElementById('quote').getElementsByTagName('a')[0].innerHTML
  };

  socket.emit('tweet-request',
  {
    link: link,
    cookies: cookies,
    quote: quote
  });
};

function request_image_callback ()
{
  document.getElementById('pic').innerHTML = '';
  socket.emit('image-request');
};

function request_quote_callback ()
{
  document.getElementById('quote').innerHTML = '';
  socket.emit('quote-request');
};

function ready_image_callback (data)
{
  var title = document.createElement('h3');
  title.innerHTML = data.alt;
  
  var image = document.createElement('img');
  image.setAttribute('src', data.src);
  image.setAttribute('alt', data.alt);
  
  var pic = document.getElementById('pic');

  pic.appendChild(title);
  pic.appendChild(image);
};

function ready_quote_callback (data)
{  
  var quote = (document.createElement('p'));
  quote.contentEditable = true;
  quote.innerHTML = data.text;
  
  var link = document.createElement('a');
  link.setAttribute('href', data.link);
  link.innerHTML = data.author;

  var quote_span = document.getElementById('quote');

  quote_span.appendChild(quote);
  quote_span.appendChild(link);  
};

function ready_tweet_callback (err)
{
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

function get_cookie(c_name)
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

// Define a socket.io client object
var socket = io.connect('http://localhost:3000/');

// Data ready callbacks
socket.on('image-ready', ready_image_callback);
socket.on('quote-ready', ready_quote_callback);
socket.on('tweet-ready', ready_tweet_callback);

socket.on('auth-error', handle_auth_error);

// Send image and quote events requests
socket.emit('image-request');
socket.emit('quote-request');

// Reload image button
var reload_image = document.createElement('button');

reload_image.setAttribute('class', 'w3-btn-floating-large w3-left w3-green');
reload_image.innerHTML = 'I';

reload_image.addEventListener('click', request_image_callback);

// Reload quote button
var reload_quote = document.createElement('button');

reload_quote.setAttribute('class', 'w3-btn-floating-large w3-left w3-green');
reload_quote.innerHTML = 'Q';

reload_quote.addEventListener('click', request_quote_callback);

// Share button
var share = document.createElement('button');

share.setAttribute('class', 'w3-btn-floating-large w3-right w3-green');
share.innerHTML = 'S';

share.addEventListener('click', request_tweet);

// Append action buttons to bottom inside footer
var footer = document.body.getElementsByTagName('footer')[0];
footer.appendChild(reload_image);
footer.appendChild(reload_quote);
footer.appendChild(share);
