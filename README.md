# Default Homepage
Temporary Repo : https://github.com/CronixYT/cc-smarttrash-app
## GET Home (“/”)
Details :
Default home page
Login button
Sign up button
	Return : 
```
{ status: "success", message: "Render homepage" }
```

## GET Login (“/login”)
Details : 
Login form page
Return : 
```
{ status: "success", message: "Render login" }
```

## GET Sign Up (“/signup”)
Details : 
Sign up form page
Return : 
```
{ status: "success", message: "Render signup" }
```

## POST Login (“/login”)
Details : 
Find username & password in Database
Redirect to User Homepage (“/user/home”) if successful
	Return :
```
Redirect to "/user/home" -> { status: "success", message: "Welcome ${username} to the homepage, you have ${points} points right now.", data: { id: 1, username: "Bangkit", points: 200, trash_temp: null } }
```

	
## POST Sign Up (“/signup”)
Details : 
Insert username & password into Database (Minimum 7 characters)
Redirect to Login Page (“/login”)
	Return : 
```
{ status: "success", 
message: "Successfully Signed up"), 
data: { username: "Bangkit", password: "Bangkit" }
```


# User Homepage
## GET User Home (“/user/home”)
Details : 
User home page
Scan, Redeem, Logout button
Return : 
```
{ status: "success", 
message: "Welcome ${username} to the homepage, you have ${points} points right now.", 
data: { 
id: 1, 
username: "Bangkit", 
points: 200, 
trash_temp: null  } }
```

## GET User Scan (“/user/scan”)
Details : 
Trash scan page
	Return : 
```
{ status: "success", message: "Redeem your points here" }
```

## GET User Scan Add (“/user/scan/add”)
Details : 
Render the scanned trash
Able to select the amount of the scanned trash
3 Buttons on below (Scan again, Delete temp trash, and Create QR Code)
	Return : 
```
{ status: "success", 
message: "Successfully displayed trash_temp", 
data: [ { name: "Plastic", est_trash_point: 200}, { name: "Metal", est_trash_point: 1000} ] }
```

## POST User Scan Add (“/user/scan/add”)
Details : 
Add the scanned trash to user temp_trash array in database
	Return : 
```
{ status: "success", 
message: "Successfully updated trash_temp", 
data: [{ name: "Plastic Bottle", est_trash_point: 200}] }
```

## DELETE User Scan Remove (“/user/scan/remove”)
Details : 
Remove the user temp_trash array in database
	Return : 
```
{ status: "success", message: "Successfully deleted trash_temp", data: result }
```

## GET User Redeem Point (“/user/redeem”)
Details : 
Redeem point page
	Return : 
```
{ status: "success", message: "Redeem your points here" }
```

## GET Logout (“/user/logout”)
Details : 
Logout user from application
Remove user session
Redirect to Default Homepage (“/”)

# QR Code
## GET QR Display (“/qrcode/display/:id”)
Details : 
Display QR Code for Admin Scan
	Return : 
```
{ status: "success", 
message: "QR Code Found", 
data: { qrcodeId : "5d8bdcf9-cb1f-4de4-b1ff-617af383a2d6", 
status: "pending", 
userId: 1, 
username: "Bangkit", 
est_points: 200, 
total_trash: 10, 
imgLink: "https://storage.googleapis.com/${BUCKETNAME}/${qrId}.png" } }
```

## GET QR Approve (“/qrcode/approve/:id”)
Details : 
Display QR Code ID for Admin Authentication
	Return : 
```
(WEB) Render QR Code ID for Admin Authentication
```

## POST QR Approve ("/qrcode/approve/:id")
Details :
Approving the accumulated trash
Find the QR :id into the QR Database and update the status from “pending” to “approved”
	Return :
```
(WEB) Render QR Code ID again (status: "approved")
```

## POST QR Create (“/qrcode/create”)
Details : 
Create QR Code and insert to QR Database with a UNIQUE id resulted in the link (“/qrcode/approve/:id”)
QR Code Image is stored in Google Cloud Bucket
QR Data consist : User id, Total Trash accumulated, and Estimated Points
Redirect to QR Display (“/qrcode/display/:id”)
	Return : 
```
{ status: "success", 
message: "QR Code ${id} created", 
data: { 
qrId: "5d8bdcf9-cb1f-4de4-b1ff-617af383a2d6", 
status: "pending", 
userId: 1, 
username: "Bangkit", 
est_points: 200, 
total_trash: 200, 
imgLink: "https://storage.googleapis.com/${BUCKETNAME}/${qrId}.png" } }
```
