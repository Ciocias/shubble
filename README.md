# shubble
Simple Web & REST service to post a random 'image and quote' tweet

## REST api
**todo**

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
