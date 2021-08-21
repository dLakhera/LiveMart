# LiveMart



-- If you dont know how to get SRV for Mongo [Refer](https://docs.mongodb.com/drivers/node/quick-start#create-a-mongodb-cluster)

- Install npm packages with 

    npm install

- Run the Server with 

    node app.js

- Update config.js file with your Google Credentials and MonogDB SRV
## Introduction


We built an application as a middleman for Customers, Sellers, and Wholesalers to come to a platform for buying/selling. We have implemented the project on the MERN stack using React Native, which gave us the ability to make it platform-independent. We have tested the App for Android. This app allows users to register using Google/Facebook or a local login Database to register as three roles: Customers, Sellers, and Wholesalers. We also have an admin account that looks like wholesalers but can view and edit all the orders and items in the Mart. We use Google API to get users' addresses using his/her current location while placing orders. Users can add queries in the placed orders to which the seller can reply through his dashboard. Nothing in this project is hardcoded. Everything (Categories, Products, Product Details)
 has to be added by users 

The project has been thought of as two parts. Buyer And Seller. Customers are only Buyers so they see screens relevant to buying any product. Similarly Retailers can see both, while wholesalers can only see screens relevant to selling of any product. One Screen that every user can see is the user profile page.

The Backend has been hosted on Amazon Web Services. 

# Technology Stack:  

NodeJS 

Node.js is a free, open-sourced, cross-platform run-time environment for JavaScript that lets developers write command line tools and server-side scripts outside of a browser.
	

## Front End
The core application was developed using the React-Native framework; however, for designing, we used tools like Figma and BuilderX. Also, for better UI looks, we used libraries like native base. We had external help for designing logos and icons for the project.
React Native
React Router Dom: This library is used for navigation
React Hook Form: This library is used to easily maintain the form of our app.
Nativebase: This library is used to easily design the form of our app.
Figma And BuilderX
Figma is a vector graphics editor and prototyping tool which is primarily web-based, with additional offline features enabled by desktop applications for macOS and Windows. The Figma Mirror companion apps for Android and iOS allow viewing Figma
BuilderX is a screen design tool that codes React Native* for you. It generates beautiful, readable and editable code for the designs. Just design the components in your app, or import your Sketch file and it generates the corresponding code.


## Back End 
The ExpressJS Node server handles our backend. For the database, we used a cloud base service by MongoDB ( MongoDB Atlas ).


ExpressJS: 	Express is a minimal and flexible Node.js web application framework that provides us a robust set of features to develop web and mobile applications. It facilitates the rapid development of Node based Web applications. Following are some of the core features of Express framework −
Allows to set up middlewares to respond to HTTP Requests.
Defines a routing table which is used to perform different actions based on HTTP Method and URL.
Allows to dynamically render HTML Pages based on passing arguments to templates.

MongoDB: MongoDB is an Open Source, NoSQL database management system. MongoDB Atlas is the global cloud database service for modern applications where we can use MongoDB’s robust ecosystem of drivers, integrations, and tools to build faster and spend less time managing our database.

## Other Tools

Github
Android Studio (Android Emulator)
VS Code 
VS Code Live Share




# Functionalities:
## Registration and Sign-Up:

We can register and login on to the platform through the following ways :

EmailId and Password
Facebook
Google Sign In
Authentication is done using JWT tokens, and Passport Node Module is used to implement this.

Each time the user logs in, an OTP will be sent to his email address and phone no. for authentication.

Messagebird API and Nodemailer have been used to send  OTP to users Phone No. and email address.


## Dashboard for Users:

For Customer and Retailer, we have a Dashboard to buy products. We have all the products listed with filters at the top only to see particular products in the chosen category. It also shows the availability status of the products. We included images for categories in the filter, but that did not go well with our GUI structure, so we removed them.

For Retailers and Wholesalers, we have a panel to add categories products and respond to queries of his customers. User can edit the products or add his product already in the market by another seller.
A Profile page for all the users is made to check their registered details and queries they have submitted. Customers and Retailers can add queries to particular sellers in any trouble with the order from this page.


##Search Module/Navigation Module
Once the user selects the item, App shows all the Sellers/Shops having the required Item with location and cost per unit.

A location filter has been implemented, which shows shops listed according to the distance.

## Place Order and Status of the Order

Both online and offline modes of purchases have been implemented.

When an order is made online, tracking details appear on both customers and the retailer’s dashboard. Details such as the delivery person’s name and his phone number, tentative delivery date can be added by the seller making it visible in the customer’s dashboard.

## Feedback and Queries

After placing the order, the order’s status gets updated periodically (Pending/Shipped/Delivered). The status is shown and updated periodically on the dashboard for all the users. After delivering the product, an SMS/e-mail is sent to the user using the registered mobile number/email id for the product and delivery feedback. The feedback of the product is updated instantly on the page of the concerned item. If multiple items are ordered, feedback can be given for each product individually.


# Extra Functionality
You can add in pictures of an item and add description for it. For now the pictures are stored on the backend server but we can implement cloud storage in future.
Ensures security in apps such that it only allows users to see data relevant to them. 
Maintains proper hierarchy of market. Wholesalers can only sell items to Retailers and Retailers can only sell items to Wholesalers.
Code has been done thinking of future prospects of this project. Like we can add gross sales, featured projects, and other analytical information on the user dashboard.
Sellers can reply to buyers' queries and can be viewed and managed through the dashboard.








## APIs Used
Places API:
 For autocomplete in search for Map to add location of user while registration.
Geocoding API: 
The API using reverse geocoding gives out the address of a place using latitude and longitude. This is used to auto-fill users' addresses while placing orders.
Distance Matrix API:
 The API gives accurate distance between two locations. This is used to sort and filter sellers on the product page for users.
Messagebird API: 
The API sends custom messages to users' devices. This is used to send OTP and order status to users.



## Data Structures for Database


User Model

Our User Model Schema comprises of the following elements :
Email ID
Password
Role
Address
Name
List of Notifications(Object id to notification)
FeedbacksGiven (List of Feedbacks. Objectid of the feedback)
FeedbacksReceived
Cart Model


Notification Model


Our Notification model comprises of the following elements :
Notification heading
Notif Content
ImageUrl (If Needed)



Item Model 

Our Item model comprises the following elements :
Name
Retailer/Wholesaler
Total Quantity
NextAvailDate - null
List
Price
Quantity_total_available
Role ID - {Retailer/Wholesaler}




Cart Model :


Our Cart model comprised of the following elements :

List of  pair of <Item Model, List of <Pair of <Seller ID,quantity_to_buy> >
Address
Total Price



Feedback Model :

Our feedback model comprises of the following elements :

AddressedTo (String (“Developer or <Seler Name>“)
Query (String)
Reply (String If an)




# References

React Native · Learn once, write anywhere
NativeBase | Essential cross-platform UI components for React Native
@expo/vector-icons@12.0.4
Location Google API:
https://heartbeat.fritz.ai/how-to-use-the-geolocation-api-in-a-react-native-app-b5e611b00a0c
https://pusher.com/tutorials/food-ordering-app-react-native-part-1
GAUTH 
Frontendref - React-native authentication with Google OAuth 2 | by abnaceur | Medium
Networking (TO CONNECT BACKEND AND FRONTEND):
https://reactnative.dev/docs/network
AXIOS
Navigation:
Authentication flows | React Navigation
Linking URL REDIRECTION FRONTEND:
https://medium.com/react-native-training/deep-linking-your-react-native-app-d87c39a1ad5e
https://reactnative.dev/docs/linking
