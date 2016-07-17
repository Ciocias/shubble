# shubble ![](public/shubble.ico)
Simple Web & REST service to post a random 'image and quote' tweet

## REST api

Method                  | Url           | Descripton                                 |
----------------------- | ------------- | ------------------------------------------ |
[Get](#get-api/image)   | /api/image    | Retrieve a random image                    |
[Post](#post-api/image) | /api/image    | Retrieve a random image with given **tag** |
[Get](#get-api/quote)   | /api/quote    | Retrieve a random quote                    |

### GET /api/image
Retrieve a random image of [Hubble]( http://hubblesite.org/gallery/album/entire/ ) in json format where **src** is the image URL, **alt** is its title and **tag** is the database tag

Example request
```
GET /api/image HTTP/1.1
Host: 127.0.0.1:3000
Cache-Control: no-cache

```

Example response
```
{
  "src":"http://imgsrc.hubblesite.org/hu/db/images/hs-2016-24-a-web.jpg",
  "alt":"Auroras on Jupiter",
  "tag":"unknown"
}
```

### POST /api/image
Retrieve a random image with given **tag** ( must be specified on request body ) of [Hubble]( http://hubblesite.org/gallery/album/entire/ ) in json format where **src** is the image URL, **alt** is its title and **tag** is the database tag
- 
+ Possible tags:
  + star
  + galaxy
  + planet
  + nebulae
  + supernova

Example request
```
POST /api/image HTTP/1.1
Host: 127.0.0.1:3000
Cache-Control: no-cache
Content-Type: application/x-www-form-urlencoded

tag=planet
```

Example response
```
{
  "src": "http://imgsrc.hubblesite.org/hu/db/images/hs-1998-35-a-web.jpg",
  "alt": "Bright Clouds on Uranus",
  "tag": "planet"
}
```

### GET /api/quote
Retrieve a random quote of [Forismatic]( http://forismatic.com/en ) in json format where **text** is the quote text, **author** is its author and **link** is the link to origins quote

Example request
```
GET /api/quote HTTP/1.1
Host: 127.0.0.1:3000
Cache-Control: no-cache

```

Example response
```
{
  "text": "A failure is a man who has blundered but is not capable of cashing in on the experience.",
  "author": "Elbert Hubbard",
  "link": "http://forismatic.com/en/d74d7833cb/"
}
```

## usage

- recursively install dependencies (through *bin/preinstall.js*)
```
npm install
```

#### fresh starts
  + setup development environment
  ```
  grunt setup
  ```

  + run the html crawler script to fetch hubble images and fill db
  ```
  node bin/crawler.js
  ```

#### launching app
+ launch docker containers
```
grunt start
```

+ directly start server with
```
node index.js
```

#### develop
+ with code linting and live-reload
```
grunt develop
```

#### cleanup
- stop containers when done
```
grunt stop
```

- if needed you can kill containers
```
grunt kill
```

- to start fresh remove containers
```
grunt remove
```

- clean logs and output files
```
grunt clean
```

**!!!** removing docker containers means you will need to run the **crawler** script again to fill in orion with entities **!!!**
