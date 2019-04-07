# OrganizedNotesBE

API for Programming Assignment for LEFT.

This API uses a MongoDB Atlas cloud database.  It does not require authentication.  

It is deployed in the Google Cloud Platform's App Engine, and can be accessed
via the URL <https://leftorganizednotes.appspot.com/api>.  All endpoints return
JSON-style documents.  The endpoints are as follows:

/cards
    GET: Returns all of the note cards.
    POST: Stores the card in the body of the request, and returns its stored
        _id.

/cards/:id
    GET: Returns the card with _id = request id.
    PUT: Updates the card with _id = request id with parameters passed in the
        body of the request.
    DELETE: Deletes the card with _id = request id.

/cards/date?startMonth={sm}&endMonth={em}&startDay={sd}&endDay={ed}
    GET: returns all cards with dates between sm and em and between sd and ed.