# Team ^ Presentation

<http://carret.herokuapp.com/>

<https://github.com/ACL-CMS-P1>

## What Is It?
* User login security solution
* To be deployed as NPM package for developers to implement in their own apps 

## What Does It Do?
* Reduces risk of malicious user access
* Stores user's profile and credentials
* Provides security analysis of login/signup events
* Full email risk analysis
* Enriches client IP addresses with full risk analysis and geolocation
* Generates IP and email blacklists
* Role based access controls (admin, user)

## Third-Party API

* [Sqreen](https://www.sqreen.io/)
* [API Docs](https://doc.sqreen.io/reference)

> The Sqreen API allows you to tap into our extensive knowledge base to *discover security risks* hiding in your own data. Find out whether that email address is from an anonymizing service, or that IP address is a Tor exit point. You can even find out if the address has been implicated in a past security attack.

* Sample risk assessment responses
```json
// email address
{
  "email": "ChunkyLover53@aol.com",
  "risk_score": 0,
  "is_known_attacker": false,
  "high_risk_security_events_count": 0,
  "security_events_count": 0,
  "is_disposable": false,
  "is_email_malformed": false,
  "is_email_harmful": false
}

// ip address
{
  "ip": "8.8.8.8",
  "ip_version": 4,
  "risk_score": 5,
  "is_known_attacker": false,
  "security_events_count": 0,
  "high_risk_security_events_count": 0,
  "ip_geo": {
    "latitude": 37.38600158691406,
    "city": "Mountain View",
    "longitude": -122.08380126953125,
    "country_code": "USA"
  },
  "is_datacenter": true,
  "is_vpn": false,
  "is_proxy": false,
  "is_private": false,
  "is_tor": false
}
```

---

# Demo

description | method | route
--- | --- | ---
Sign up an admin | POST with body | `http://carret.herokuapp.com/auth/signup` _COPY TOKEN_
```
{
    "name": "Mr. New Admin",
    "email": "admin@caret.com",
    "password": "pswd",
    "role": "admin",
    "status": "active"
}
```



description | method | route
--- | --- | ---
Sign in an admin | POST with header & body | `http://carret.herokuapp.com/auth/signin`

SET HEADER: `Authorization`: _token_

```
{ "email": "admin@teamcaret.com", "password": "pswd" }
```



## Admin only routes

SET HEADER: `Authorization`: _token_

description | method | route
--- | --- | ---
View all users | GET | `http://carret.herokuapp.com/admin/users`
View user | GET | `http://carret.herokuapp.com/admin/users/christy@teamcaret.com`
Lock a user | PATCH | `http://carret.herokuapp.com/admin/users/christy@teamcaret.com`
Remove a user | DELETE | `http://carret.herokuapp.com/admin/users/Catelyn.Stark@gameofthrones.tv`
View event history | GET | `http://carret.herokuapp.com/admin/reports/events/`
View a type of event | GET query | `http://carret.herokuapp.com/admin/reports/events?type=login`
View a user's events | GET query | `http://carret.herokuapp.com/admin/reports/events?email=Catelyn.Stark@gameofthrones.tv`



## User routes (admins are users too!)

description | method | route
--- | --- | ---
Sign up user | POST with body | `http://carret.herokuapp.com/auth/signup`
```
{
    "name": "Mr. New user",
    "email": "user@caret.com",
    "password": "imuser",
    "role": "user",
    "status": "active"
}
```

description | method | route
--- | --- | ---
Sign in user | POST with body | `http://carret.herokuapp.com/auth/signup` _COPY TOKEN_

```
{ "email": "user@caret.com", "password": "imuser" }
```

description | method | route
--- | --- | ---
View my info | GET | `http://carret.herokuapp.com/me`
Update my info | PATCH | `http://carret.herokuapp.com/me`
Remove my account | DELETE | `http://carret.herokuapp.com/me`


## Rejections

description | method | route
--- | --- | ---
Standard user is not allowed to access Admin options | GET | `http://carret.herokuapp.com/admin/users`
Sign up failed with wrong email or password | POST | `http://carret.herokuapp.com/auth/signin`
User account locks with 3 consecutive failed login attempts | POST | `http://carret.herokuapp.com/auth/signup`
Sign up failed because user already exists | POST | `http://carret.herokuapp.com/auth/signup`
```
{
    "name": "Mr. New user",
    "email": "user@caret.com",
    "password": "imuser",
    "role": "user",
    "status": "active"
}
```


## Security Threats

description | method | route
--- | --- | ---
Sign up failed for known hacker | POST | `http://carret.herokuapp.com/auth/signup`
```
{
    "name": "Elliot Alderson",
    "email": "test@test.com",
    "password": "fsociety",
    "role": "user",
    "status": "active"
}
```

...more bad emails...
```
[
  { "name": "Darlene Alderson", "email": "k399792@mvrht.net", "password": "fsociety", "role": "user", "status": "active"},
  { "name": "Angela Moss", "email": "hhhhhhhhhhhhhhhh@mailinator.com", "password": "fsociety", "role": "user", "status": "active"},
  { "name": "Tyrell Wellick", "email": "email@email.com", "password": "fsociety", "role": "user", "status": "active"},
  { "name": "Mr Robot", "email": "k888246@mvrht.net", "password": "fsociety", "role": "user", "status": "active"},
  { "name": "Phillip Price", "email": "mail@mail.com", "password": "fsociety", "role": "user", "status": "active"},
  { "name": "Joanna Wellick", "email": "mail@mail.com", "password": "fsociety", "role": "user", "status": "active"},
  { "name": "Dominique Dom DiPierro", "email": "mail@mail.com", "password": "fsociety", "role": "user", "status": "active"}
]
```
