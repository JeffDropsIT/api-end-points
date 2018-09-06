# node-js-getting-started

A barebones Node.js app using [Express 4](http://expressjs.com/).

This application supports the [Getting Started with Node on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article - check it out.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone git@github.com:heroku/node-js-getting-started.git # or clone your own fork
$ cd node-js-getting-started
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)

## Afroturf basic RESTful API


| ENDPOINTS                                                                  | HTTP VERB        | ACTION                               |
| :--------------------------------------------------------------------------| :---------------:| :----------------------------------: |
| /afroturf/user/register                                                    | POST             | Registers user                       |
| /afroturf/user/login                                                       | POST             | Login user                           |
| /afroturf/user/edit/profile                                                | POST             | Edit a user                          |
| /afroturf/user/profile/create/salon                                        | POST             | Create salon                         |
| /afroturf/user/profile/edit/salon/dashboard                                | POST             | Edit salon details                   |
| /afroturf/user/profile/salon/:id/follow                                    | POST             | Follow salon                         |
| /afroturf/user/profile/salon/:id/review                                    | POST             | Write a review stylist/salon         |
| /afroturf/user/profile/messages/room                                       | POST             | Send a message to user/stylist/salon |
| /afroturf/user/profile/salon/apply                                         | POST             | Apply to a salon as stylist          |
| /afroturf/user/profile/salon/dashboard/applications/status                 | POST             | Accept stylist request               |
| /afroturf/user/profile/salon/service/bookings                              | POST             | Book a service in a salon            |
| /afroturf/user/profile/salon/service/stylist/bookings                      | POST             | Book a service by a stylist          |
| /afroturf/user/profile/salon/dashboard/bookings/status                     | POST             | Book a service in a salon            |
| /afroturf/user/profile/salon/service/bookings                              | POST             | Accept booking from stylist/salon    |
| /afroturf/user/profile/edit/salon/dashboard/subservices                    | PUT              | Add Subservice To Salon Services     |
| /afroturf/user/profile/edit/salon/dashboard/services                       | PUT              | Add Services To Salon                |
| /afroturf/user/profile/edit/salon/dashboard/services/avatar                | PUT              | Add Service Avatar                   |
| /afroturf/user/profile/edit/salon/dashboard/services                       | PATCH            | Update Service Name                  |
| /afroturf/user/profile/edit/salon/dashboard/subservices                    | PATCH            | Update Subservice                    |
| /afroturf/user/profile/salon/bookings                                      | GET              | Returns bookings for a salon         |
| /afroturf/user/profile/salon/bookings/:orderNumber                         | GET              | Returns booking by order Number      |
| /afroturf/user/profile/salon/bookings/duration/unavailable-b               | GET              | Returns Salon Orders By Date Before  |
| /afroturf/user/profile/salon/bookings/stylist/duration/unavailable-b       | GET              | Returns Stylist Orders By Date Before|
| /afroturf/user/profile/salon/bookings/duration/unavailable-btwn            | GET              | Returns Salon Orders By Date Between |
| /afroturf/user/profile/salon/bookings/stylist/duration/unavailable-btwn    | GET              | Returns Stylist Orders By DateBetween|
| /afroturf/user/profile/salon/bookings/duration/unavailable-btwn            | GET              | Returns Salon Orders By Date Between |
| /afroturf/user/profile/salon/bookings/unavailable                          | GET              | Returns Booked Time Slot For Salon   |
| /afroturf/user/profile/salon/bookings/stylist/unavailable                  | GET              | Returns Booked Time Slot For Stylist |
