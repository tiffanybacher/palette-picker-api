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

### Note: All routes will return a response with a status of 500 upon and internal server error.


``` POST /api/v1/projects```
This endpoint will respond with a status of 201 if successful and the id of the newly created entry to the projects DB.
The body of this route requires the format { name: <string>, user_id: <number> }

#### Sample Response

``` 
Status Code 201 OK 
{
    "id": 46
}
``` 

---

``` GET /api/v1/projects ```

An optional query parameted can be added to get all projects associated with a user ID provided after the = sign

``` GET /api/v1/projects?user_id={userId}} ```

#### Sample Response

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

---

``` GET /api/v1/projects/:id ```

#### Sample Response

```
Status 200 OK
{
    "id": 4,
    "name": "Band Poster",
    "user_id": 1
}
```

---

``` PUT /api/v1/projects/:id```
Where id parameter is the id of the project being edited.
The body of this route requires the format { name: <string> }
    
#### Sample Response
``` 
Status Code 200 OK
{
    "id": "4",
    "name": "Super Rock Band Poster",
    "user_id": "1"
}
```

---

```DELETE /api/v1/projects/:id```
Note: The response status will be a 204 upon proper deletion and a 202 upon the item not being found for deletion.
#### Sample Response
``` 
Status code 204
```

---

``` POST /api/v1/palettes```
This endpoint will respond with a status of 201 if successful and the id of the newly created entry to the palettes DB.
The body of this route requires the format { name: <string>, project_id: <number>, colors_array: <array of objects> }

#### Sample Response

``` 
Status Code 201 OK 
{
    "id": 200
}
``` 

---

``` GET /api/v1/projects ```

An optional query parameted can be added to get all projects associated with a user ID provided after the = sign

``` GET /api/v1/projects?project_id={projectId}} ```

#### Sample Response

``` Status: 200 OK
[
    {
        "id": 7,
        "name": "Website Colors",
        "colors_array": [
            "495867",
            "577399",
            "BDD5EA",
            "F7F7FF",
            "FE5F55"
        ],
        "project_id": 5
    },
    {
        "id": 8,
        "name": "something really great",
        "colors_array": [
            "{\"isLocked\":false,\"hexCode\":\"#6ab78f\",\"id\":0}",
            "{\"isLocked\":false,\"hexCode\":\"#f7ad1f\",\"id\":1}",
            "{\"isLocked\":false,\"hexCode\":\"#af0491\",\"id\":2}",
            "{\"isLocked\":false,\"hexCode\":\"#7ad5f5\",\"id\":3}",
            "{\"isLocked\":false,\"hexCode\":\"#56ed7d\",\"id\":4}"
        ],
        "project_id": 6
    }
]
```

---


``` GET /api/v1/palette/:id ```

#### Sample Response

```
Status 200 OK
{
    "id": 8,
    "name": "something really great",
    "colors_array": [
        "{\"isLocked\":false,\"hexCode\":\"#6ab78f\",\"id\":0}",
        "{\"isLocked\":false,\"hexCode\":\"#f7ad1f\",\"id\":1}",
        "{\"isLocked\":false,\"hexCode\":\"#af0491\",\"id\":2}",
        "{\"isLocked\":false,\"hexCode\":\"#7ad5f5\",\"id\":3}",
        "{\"isLocked\":false,\"hexCode\":\"#56ed7d\",\"id\":4}"
    ],
    "project_id": 6
}
```

---

``` PUT /api/v1/palettes/:id```
Where id parameter is the id of the project being edited.
The body of this route requires the format { name: <string>, project_id: <number>, colors_array: <array of objects> }
    
#### Sample Response
``` 
Status Code 200 OK
{
    "id": 8,
    "name": "something really great",
    "colors_array": [
        "{\"isLocked\":false,\"hexCode\":\"#6ab78f\",\"id\":0}",
        "{\"isLocked\":false,\"hexCode\":\"#f7ad1f\",\"id\":1}",
        "{\"isLocked\":false,\"hexCode\":\"#af0491\",\"id\":2}",
        "{\"isLocked\":false,\"hexCode\":\"#7ad5f5\",\"id\":3}",
        "{\"isLocked\":false,\"hexCode\":\"#56ed7d\",\"id\":4}"
    ],
    "project_id": 6
}
```

---

```DELETE /api/v1/palettes/:id```
Note: The response status will be a 204 upon proper deletion and a 202 upon the item not being found for deletion.

#### Response

``` 
Status code 204
```

---

``` POST /api/v1/users```
This endpoint will respond with a status of 201 if successful and the id of the newly created entry to the users DB.
The body of this route requires the format { username: <string>, password: <string> }

#### Sample Response

``` 
Status Code 201 OK 
{
    "id": 200
}
``` 

---

``` GET /api/v1/users/:username/:password ```

#### Sample Response

``` 
{ 
  "id": 8, 
  "username": "danny_silk" 
}


