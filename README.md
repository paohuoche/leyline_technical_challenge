This is a [Next.js](https://nextjs.org/) project.



```bash
pnpm install
pnpm run mockServer # mock data server
pnpm dev
```

This project contains 4 pages: 

1. home: **/**, 

2. Party A: **/a**, 

3. Party B: **/b**, 

4. Settlement: **/settled**

Due to I don't have too much backend experiences, the apis were all mocked. 

**api.yaml** describes the api, which is common in my work, usually provided by backend worker. I generated it by chatgpt for this time.
mockServer and types of api were all depends on it.

## Party A
Using long polling to listen if there is new response from Party B

If yes, there will a toast to be popped up, with a button to refresh the status.

## Party B
Also using long polling to listen the new proposed amount.

After submiting the response to Party A, the api for submit should be returning a error that notified you have submited and without new amount updated.



