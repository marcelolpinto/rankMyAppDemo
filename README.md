This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## To run this project

In the project directory, you should run:

### `npm install`
### `npm run dev`

The application will run in both 3000 and 3001 ports (API on 3001) <br/>
PS: I didn't make the CRON Jobs linked to a lambda function. The CRONs are defined in the front-end. I know it's not the best practice and probably no the solution wanted, but I did it this way due to the short available time. <br/>
Given this, the emails will only be sent while the application is <b>running</b>. <br/><br/>
PS2: Didn't add docker due to short available time (looking forward to learn how to use docker with you ;*)