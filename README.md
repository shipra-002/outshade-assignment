# outshade-assignment

SO in this assignment i have created two models that is usermodel and eventmodel 
1. In usermodel ,I have created the userschema with some detalis.
2. In usercontroller, I have created 4 api's first is createuser,loginuser, logoutuser and resetpassword.
3. In createuser api, we can create user and when the user is created and then we can login that user with email and password. we will get the hashed password.
3. In logout user api, We can use logout api for that particular user.
4. In resetuser api , We can also reset the password that we have created for the particular api and for the token we have used the jsonwebtoken package for that. 
5. And i have used express,mongoose,bycrpt,jsonwebtoken packages for that.

6. In eventmodel, I have created eventschema with some details.
7. In eventcontroller,I have created four api's that is createevent,geteventbyId,geteventbyquery and updateevent
8. In createevent ,we can create the event and also used the authentication here ,only the authenticated user create the event.
9. In geteventbyid , we have to give the eventid in params , and will get the event.
10. In getevent api, we have to give the query, that means any search filter, and we will get the result in sorted order by eventname. and also we will get the pages of event in pages with the use of pagination here.
11. In updateevent ,we can update any event ,only the authenticated and authorized user can update any event ,
12, In middleware ,I have write the auth file or authenticatioin and authorization.