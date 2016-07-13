# shubble
Simple Web & REST service to post a random 'image and quote' tweet

## REST api
**todo**

## usage

- run default task to create docker containers (mongodb, fiware/orion)
```
grunt
```

- if this is a fresh start, run the html crawler script to fetch hubble images and fill db
```
node bin/crawler.js
```

- start server with
```
node index.js
```

- kill containers when done
```
grunt kill
```

- if needed you can remove both containers at once
```
grunt remove
```

**!!!** removing docker containers means you will need to run the **crawler** script again to fill in orion with entities **!!!**

## development

to benefit from code live-reloading you can run
```
grunt develop
```
which fires up the docker containers and launches our server through nodemon
