# Developer Guidelines

## Source Control

* Developers will work on feature branches
* Branches will be named `devName-featureOrTheThingYouAreWorkingOn`
* We will have merge our pull request parties together, first thing in the morning (or through out the day)

## Code Style

* TDD
* four space indentation
* semi-colons

## User Stories

As an Admin, I want...
* to be able to see name, email, and role for each user and all users at once
* to be able to lock users on a case by case basis
* to be able to access an event log that includes login data such as timestamps and IPs for logins
* the system to assess the risk of each login attempt and block users with risk scores too high
* to be able to delete users
* to be able to alter user information (patch) by user id
* to be able to create reports from login event data and user data
* STRETCH: to be able to configure rules for risk assessment and according to my specific business needs (i.e. be able to turn set rules on and off)
* STRETCH: to be able to define my own rules in addition to turning existing rules on and off
* STRETCH: to be able to see appropriate data in an attractive dashboard

As a regular user, I want...
* to be able to sign up
* to be able to sign in
* to be able to see my name and email in the system
* any messages I see to be clear and relevant
* to be able to change my name, email, and password
* STRETCH: to be notified by email when I am locked out
* STRETCHY STRETCH: to have an automated validation email system so I don't have to contact an admin

As a developer, I want...
* to use correct endpoints and methods for a REST app
* to use a 3rd party API to enrich the information available to the app based off of users' IP addresses
* to be able to get enrichment data based off of both user emails and IPs
* to use a Mongo database and Mongoose to organize and keep the login events and user data
* STRETCH: to publish my package on npm so that it can be used by others
* STRETCH: to present login and user data to admins in an attractive and easy-to-use dashboard
