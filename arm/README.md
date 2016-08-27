# Docker Swarmmode Test Scenarios

These scenarios are designed to test the basic connectivity and features of swarmmode on the Raspberry Pi.

* [Get Docker installed on your Pi](http://blog.alexellis.io/getting-started-with-docker-on-raspberry-pi/)

### Reporting feedback

Please report feedback to Docker Captain [@alexellisuk](http://twitter.com/alexellisuk) by creating a Github Issue in this repository. 

Please include:

* Hardware used
* Installation method
* Linux Distribution i.e. Raspbian/Raspbian Lite/HypriotOS/Arch Linux
* Kernel version `uname -a`
* `docker version`

## Scenario 1 - the scaled service

This scenario tests basic scheduling and orchestration.

With at least two nodes in the swarm:

```
# docker service create --name ping1 --replicas=2 alexellis2/arm-pingcurl ping docker.com
```

* Testing:

Check logs on both nodes for successful ping responses.

* Cleanup:

```
docker service rm ping1
```

* Source:

[arm-pingcurl](https://github.com/alexellis/swarmmode-tests/tree/master/arm/arm-pingcurl)

## Scenario 2 - the hello world webservice

This scenario tests the built-in load balancing / mesh routing capabilities.

With at least two nodes in the swarm:

```
# docker service create --name hello1 --publish 3000:3000 --replicas=2 alexellis2/arm-alpinehello
```

* Testing

Perform this step 4 times while logged into the manager only.

```
# curl -4 localhost:3000
hello
# curl -4 localhost:3000
hello
# curl -4 localhost:3000
hello
# curl -4 localhost:3000
hello
```

> `curl -4` forces IPv4

* Cleanup:

```
docker service rm hello1
```

* Source

[arm-alpinehello](https://github.com/alexellis/swarmmode-tests/tree/master/arm/arm-alpinehello)

## Scenario 3 - inter-container communication

Thie scenario tests inter-container resolution and connectivity. A redis database runs on only one node and on both nodes we run a hit counter which will increment a number held in the redis database with each GET request.

Make sure you have at least 2 nodes in your swarm.

* Setting up:

```
# docker network create --driver overlay --subnet 20.0.14.0/24 armnet
# docker service create --replicas=1 --network=armnet --name redis alexellis2/redis-arm:v6
# docker service create --name counter --replicas=2 --network=armnet --publish 3000:3000 alexellis2/arm_redis_counter
```

* Testing / verification

Perform this test logged into the manager.

Use `docker service ps counter` and check that at there is one `counter` replica on either host.

Check there are no error messages in the logs of `docker service ps counter` and if needed check the daemon logs on the node.

```
# curl localhost:3000/incr
{"count":1}
# curl localhost:3000/incr
{"count":2}
# curl localhost:3000/incr
{"count":3}
# curl localhost:3000/incr
{"count":4}

```

The counter should now equal 4.

* Clean-up

```
# docker service rm counter
# docker service rm redis
# docker network rm armnet
```

* Source

[arm_redis_counter](https://github.com/alexellis/swarmmode-tests/tree/master/arm/arm_redis_counter)


### Heads-up

Running the Docker daemon in debug mode `dockerd --daemon` appears to suggest that the kernel module VXLAN is not available. Please run `rpi-update` and if this command is not available it can be installed with `apt-get`.
