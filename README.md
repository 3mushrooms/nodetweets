# NodeTweets v0.1 
NodeTweets is a NodeJS based twitter like REST API system that allows basic functionalities.  
The main idea of this project is to build microservices services based model that communicates together to serve any requests from end user.  However, I only started this project two days ago, so i built the system loosely coupled so I can eventually move each microservice on its own docker container.  This version will have all microservices running together under local host.  

That being said, Each service is now running on its own server port ready to serve requests to it.  To simmulate this behavior, we achieved this with two main files:
* **home.js** is the main request server that runs on its own port and will be orchestracting different requests to other inner microsevices. 
* **home/home_routes.js** is the main request router that handles communications with different microservices.


##Featueres
* All API are implemented using REST API principles
* Simple Login simulation to demonstratre user service Login
* Ability to post tweets
* Ability to follow users
* Ability to unfollow users
* Ability to call tweets service to view tweets from any given user 
* Ability to search for users to follow using ```/users/searches``` resource
* Ability to retrieve all tweets from a homepage.

##TODO:
* Have the *home service* to pull list of tweets from followed users. 
* When user is unfollowed, remove past tweets and stop future tweets to view on user's home page.
* Add a **frontend** to this application.
* Have each microserive run on its own docket container
* Write build and deployment scripts
* Handle password Hash

##Architecutre Diagram:

![Image of NodeTweets Microservice Architecutre]
(https://github.com/3mushrooms/nodetweets/blob/master/assets/microservices_nodetweets.png)

##Core Microservices:
The following section will walk through different HTTP interactions with each microservice

###Login Microservice
**/login** endpoint
```
http://127.0.0.1:3000/login
```
Using HTTP.POST, post the following *payload*
```json
{
    username: "ahmad",
    password: "password"
}``` 
You 
###Users Microservice

####Search users
**/users/searches** endpoint
```http://127.0.0.1:3000/users/searches```
Using HTTP.POST, post the following *payload*
```
{
    "username": "om"
}
```
Result:
```json
{
  "info": "search results for: om",
  "data": [
    {
      "_id": "57b92c871c659aad4aeef97f",
      "username": "omar",
      "email": "omar@3mushrooms.net",
      "password": "3mushrooms",
      "__v": 0
    },
    {
      "_id": "57ba0f7a7e487ec16163a8fc",
      "username": "Tom",
      "email": "tom@3mushrooms.com",
      "password": "tom1234",
      "__v": 0
    }
  ]
}
```

###Followers Microservice
 
###Tweets Microservice

##Run The application
### Install *forever**
globally install forever using the following command:
```npm install -g forever```

### Run the Microservice
run the following commands:
```forever start users/user_server.js```
```forever start tweets/tweet_server.js```
```forever start follower/follower_server.js```
```forever start home.js```

once all the above services are running, run



