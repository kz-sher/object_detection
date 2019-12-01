# Object Detection - IBM Watson Visual Recognition API
This project is built on top of ReactJS and NodeJS, where the former handles the frontend and the latter copes with the backend. This is also a simple application to show how both frameworks can interact with each other.

### Additional Lesson Learned
A task scheduler is actually implemented in this project as IBM Watson Lite Plan will delete the instance after 30-day inactivity. Therefore, by using `node-cron` library, a functional timer can help perform API request forwarding once every month.
