function request_tweet (socket, callback)
{
  var img = document.getElementById('pic').getElementsByTagName('img')[0];
  
  if (img === undefined)
  {
    alert('Image is missing, reloading...');
    callback(null);
  }

  var link = img.getAttribute('src');
  
  //var cookies = {
  //  oauth_token: get_cookie('oauth_token'),
  //  oauth_verifier: get_cookie('oauth_verifier')
  //};

  var quote = {
    text: document.getElementById('quote').getElementsByTagName('p')[0].innerHTML,
    author: document.getElementById('quote').getElementsByTagName('a')[0].innerHTML
  };

  callback({
    link: link,
    //cookies: cookies,
    quote: quote
  });
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

function ready_name_callback (data)
{
  var name = document.getElementById('name');
  name.innerHTML = data.name + ' @' + data.screen_name;
};

function ready_tweet_callback (err)
{
  if (err)
    alert("Cannot post tweet");
  else
    alert("Tweet posted!");
};

function redirect_root ()
{
  // redirect to root
  window.location.assign("http://127.0.0.1:3000");
}

/*
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
*/
// Define a socket.io client object
var socket = io.connect('http://localhost:3000/');

// Data ready callbacks
socket.on('image-ready', ready_image_callback);
socket.on('quote-ready', ready_quote_callback);
socket.on('name-ready', ready_name_callback);
socket.on('tweet-ready', ready_tweet_callback);

socket.on('auth-error', redirect_root);

// Send image and quote events requests
socket.emit('image-request');
socket.emit('quote-request');

// Reload image button
var reload_image = document.createElement('button');

reload_image.setAttribute('class', 'w3-btn-floating-large w3-left w3-cyan');
reload_image.innerHTML = 'I';

reload_image.addEventListener('click', () => {
  document.getElementById('pic').innerHTML = '';
  socket.emit('image-request');
});

// Reload quote button
var reload_quote = document.createElement('button');

reload_quote.setAttribute('class', 'w3-btn-floating-large w3-left w3-cyan');
reload_quote.innerHTML = 'Q';

reload_quote.addEventListener('click', () => {
  document.getElementById('quote').innerHTML = '';
  socket.emit('quote-request');
});

// Load name button
var load_name = document.getElementById('name');

load_name.setAttribute('class', 'w3-card-4 w3-animate-zoom w3-center');
load_name.innerHTML = 'whoami';

load_name.addEventListener('mouseenter', () => {
  load_name.setAttribute('class', 'w3-card-4 w3-animate-zoom w3-center');
  socket.emit('name-request');
  //load_name.style.visibility = 'hidden';
});
load_name.addEventListener('mouseleave', () => {
  load_name.innerHTML = 'hello';
});

// Share button
var share = document.createElement('button');

share.setAttribute('class', 'w3-btn-floating-large w3-right w3-cyan');
share.innerHTML = 'S';

share.addEventListener('click', () => {
  request_tweet(socket, (data) => {
    if (data)
      socket.emit('tweet-request', data);
    else
      socket.emit('image-request');

    share.style.visibility = 'hidden';
    reload_image.style.visibility = 'hidden';
    reload_quote.style.visibility = 'hidden';
    load_name.style.visibility = 'hidden';
  });
});

// Home button
var home = document.createElement('button');

home.setAttribute('class', 'w3-btn-floating-large w3-right w3-cyan');
home.innerHTML = 'H';

home.addEventListener('click', () => {
  redirect_root();
});

// Append action buttons to bottom inside footer
var footer = document.body.getElementsByTagName('footer')[0];
footer.appendChild(reload_image);
footer.appendChild(reload_quote);
//footer.appendChild(load_name);
footer.appendChild(share);
footer.appendChild(home);
