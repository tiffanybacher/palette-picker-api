# Palette Picker API

## Description
This is a translational one-to-many back-end repository storing projects, palettes, and user information.

## Setup

Simply begin by cloning down the repository.

```bash
git clone https://github.com/BrennanDuffey/build-your-own-backend.git
```

Once cloned run 

```bash
npm i
``` 

and 

```bash
npm start
``` 
Now to run the server locally in the development environment with: 

## Route Information

``` GET /api/v1/projects ```

An optional query parameted can be added to get all projects associated with a user ID provided after the = sign
``` GET /api/v1/projects?user_id={userId}} ```

#### Response


``` Status: 200 OK
[
    {
        "id": 4,
        "name": "Band Poster",
        "user_id": 1
    },
    {
        "id": 5,
        "name": "Website",
        "user_id": 1
    },
    {
        "id": 6,
        "name": "something great",
        "user_id": 2
    }
]
```

``` GET /api/v1/projects/:id ```
#### Response
```
Status 200 OK
{
    "id": 4,
    "name": "Band Poster",
    "user_id": 1
}
```

``` POST /api/v1/projects```
This endpoint will respond with a status of 201 if successful and the id of the newly created entry to the projects DB.
The body of this route requires the format { name: <string>, user_id: <number> }

#### Response

``` 
Status Code 201 OK 
{
    "id": 46
}
``` 

``` PUT /api/v1/projects/:id```
Where id param is the id of the project being edited.
The body of this route requires the format { name: <string> }
#### Responses
``` 
Status Code 200 OK
{
    "id": "4",
    "name": "Super Rock Band Poster",
    "user_id": "1"
}
```

```DELETE /api/v1/projects/:id```
Note: The response status will be a 204 upon proper deletion and a 202 on
#### Response
``` 
Status code 204
```

```POST /api/v1/categories```
Body must contain 'name' <String>.

#### Response
``` 
Status code 201 
{
    "name": " Literature",
    "id": 28
}
```

``` DELETE /api/v1/tossups/:id```
Parameter provided is the primary key of the row to be deleted

#### Response
``` Status Code 204 with no body``
