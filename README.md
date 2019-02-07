This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## To run this project

In the project directory, you should run:

#### `npm install`

and then
#### `npm run dev`

The application will run in both 3000 and 3001 ports (API on 3001) <br/><br/>
PS: I didn't make the CRON Jobs linked to a lambda function. The CRONs are defined in the front-end, set in the componentDidUpdate method of App.js. I know it's not the best practice and probably not the solution wanted, but I did it this way due to the short available time. <br/>
Given this, the emails will only be sent while the application is <b>running</b>. <br/><br/>
PS2: Didn't add docker due to short available time (looking forward to learn how to use docker with you ;*) <br/><br/>
PS3: Created dummy email rmappdemo@gmail.com to send the emails. The email and password are hardcoded in the /api/EmailSender.js file. I know that's not the best practice but I did it that way to save time. <br/><br/>
PS4: EBAY_KEY hardcoded in app. I know that's not the best practice but I did it that way to save time. <br/><br/>
PS5: MONGO_URL hardcoded in app. I know that's not the best practice but I did it that way to save time. <br/><br/>
PS6: Did not add tests to save time. <br/><br/>

Sorry for all the missing items.