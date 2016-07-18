// setup root url using a regexp to parse the current location
var url = '';

var regex = new RegExp(/[0-9]+.[0-9]+.[0-9]+.[0-9]+:[0-9]{4}/i);
url = 'http://' + regex.exec(window.location.href);

/* functions */
function request_tweet (callback)
{
  var img = document.getElementById('pic').getElementsByTagName('img')[0];
  if (img === undefined)
  {
    spawn_msg('Image is missing...', { body: '...new image request send'});
    callback(null);
  }

  var link = img.getAttribute('src');
  
  var text = document.getElementById('quote').getElementsByTagName('p')[0].innerHTML;
  var author = document.getElementById('quote').getElementsByTagName('p')[1].innerHTML;

  callback({
    link: link,
    quote: text + ' - ' + author
  });
};

function ready_image_callback (data)
{
  if (data !== null)
  {
    var pic = document.getElementById('pic');
    pic.innerHTML = data.alt + '<br>';
    //var title = document.createElement('h3');
    //title.innerHTML = data.alt;
    
    var image = document.createElement('img');
    image.setAttribute('src', data.src);
    image.setAttribute('alt', data.alt);
    image.setAttribute('class', 'w3-animate-zoom');
    

    //pic.appendChild(title);
    pic.appendChild(image);
  }
  else
  {
    var pic = document.getElementById('pic');
    pic.innerHTML = 'Opssssss!';
  }
};

function ready_quote_callback (data)
{
  if(data.text.length <= 120)
  {  var quote = document.createElement('p');
    quote.innerHTML = data.text;

    var author = document.createElement('p');
    //link.setAttribute('href', data.link);
    author.innerHTML = data.author;

    var quote_span = document.getElementById('quote');

    quote_span.appendChild(quote);
    quote_span.appendChild(author);
  }
};

function ready_name_callback (data)
{
  var screen_name = document.createElement('p');
  screen_name.setAttribute('align', 'right');
  screen_name.innerHTML = '@' + data.screen_name;

  var user = document.getElementById('user');
  user.appendChild(screen_name);
};

function ready_tweet_callback (err)
{
  if (err)
    spawn_msg('Cannot post tweet', null);
  else
    spawn_msg('Tweet posted!', { body: document.getElementById('user').getElementsByTagName('p')[0].innerHTML });
};

function redirect_root ()
{
  // redirect to root
  window.location.assign(url);
}

function spawn_msg (message, options)
{
  if (Notification.permission == 'granted'){
    var n = new Notification(message, options);
    setTimeout(n.close.bind(n), 4000);
  }
  else
    alert(message);
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
var socket = io.connect(url);

// Data ready callbacks
socket.on('image-ready', ready_image_callback);
socket.on('quote-ready', (data) => {
  if(data.text.length > 120)
  {
    //socket.emit('quote-request');
    //return;

    
    console.log(data.text);
    console.log(data.text.length);

    var to = setTimeout(function() {
      document.getElementById('quote').innerHTML = '';
      socket.emit('quote-request');
      //return;
      // this code runs 3 seconds after the page loads
      clearTimeout(to);
    }, 500);
    
  }

  ready_quote_callback(data);
});
socket.on('name-ready', ready_name_callback);
socket.on('tweet-ready', ready_tweet_callback);

socket.on('auth-error', redirect_root);

// Send image and quote events requests
socket.emit('image-request');
socket.emit('quote-request');
socket.emit('name-request');

// Reload image button
var reload_image = document.createElement('button');

reload_image.setAttribute('class', 'w3-btn w3-white w3-border w3-border-blue w3-round-xlarge w3-left');
reload_image.innerHTML = 'Image';

reload_image.addEventListener('click', () => {
  document.getElementById('pic').innerHTML = '';
  socket.emit('image-request');
});

// Reload quote button
var reload_quote = document.createElement('button');

reload_quote.setAttribute('class', 'w3-btn w3-white w3-border w3-border-blue w3-round-xlarge w3-left');
reload_quote.innerHTML = 'Quote';

reload_quote.addEventListener('click', () => {
  document.getElementById('quote').innerHTML = '';
  socket.emit('quote-request');
});

// Home button
var home = document.createElement('button');

home.setAttribute('class', 'w3-btn w3-white w3-border w3-border-blue w3-round-xlarge w3-center');
home.style.visibility = 'hidden';
home.innerHTML = 'Home';

home.addEventListener('click', () => {
  redirect_root();
});

// Share button
var share = document.createElement('button');

share.setAttribute('class', 'w3-btn w3-white w3-border w3-border-blue w3-round-xlarge w3-right');
share.innerHTML = 'Share';

share.addEventListener('click', () => {
  request_tweet((data) => {
    if (data)
    {
      socket.emit('tweet-request', data);
      share.disabled = true;
      reload_image.disabled = true;
      reload_quote.disabled = true;
      home.style.visibility = 'visible';
    }
    else
      socket.emit('image-request');
  });
});

// Append action buttons to bottom inside footer
var footer = document.body.getElementsByTagName('footer')[0];
footer.appendChild(reload_image);
footer.appendChild(reload_quote);
footer.appendChild(share);
footer.appendChild(home);

// request permission on page load
document.addEventListener('DOMContentLoaded', function ()
{
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.'); 
    return;
  }
  if (Notification.permission !== "granted")
    Notification.requestPermission();
});
